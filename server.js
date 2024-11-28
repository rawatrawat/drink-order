const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');

const userSchema = new mongoose.Schema({
  user_name: String,
  user_password: String
});
const User = mongoose.model('User', userSchema);

// Connect to MongoDB
mongoose.connect('mongodb+srv://new_user_1:new_user_1@cluster0.3aytms0.mongodb.net/', {
  retryWrites: true,
  w: 'majority'
});

// Create Express app
const app = express();

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Middleware for parsing cookie data
app.use(cookieParser());

// Middleware for session management
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using https
}));

// Set static folder for public resources
app.use(express.static('public'));

// Set views folder for EJS templates
app.set('views', './views');
app.set('view engine', 'ejs');

// Route for login page
app.get('/login', (req, res) => {
  if (req.session.user) {
    res.redirect(req.session.user.user_name === 'admin' ? '/admin' : '/orders');
  } else {
    res.render('login');
  }
});

// Route for handling login logic
app.post('/login', async (req, res) => {
  const { user_name, user_password } = req.body;
  try {
    const user = await User.findOne({ user_name, user_password });
    if (user) {
      req.session.user = user;
      res.redirect(req.session.user.user_name === 'admin' ? '/admin' : '/orders');
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Server error');
  }
});

// Route for logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

// Define routes for admin and orders pages
app.get('/admin', ensureAuthenticated, (req, res) => {
  res.render('admin', { user: req.session.user });
});

app.get('/orders', ensureAuthenticated, (req, res) => {
  res.render('order', { user: req.session.user });
});

// ..................................................
// CRUD
const performCRUDOperation = async (db, action, data) => {
    var collection = db.collection('drinks');
    let results;

    switch (action) {
        case 'create':
            results = await collection.insertOne(data);
            console.log("Inserted one document: " + JSON.stringify(results));
            break;
        case 'read':
            results = await collection.find({id: data.id}).toArray();
            console.log("Found documents: " + JSON.stringify(results));
            break;
        case 'update':
            results = await collection.updateOne({id: data.id}, {$set: data});
            console.log("Updated one document: " + JSON.stringify(results));
            break;
        case 'delete':
            results = await collection.deleteMany({id: data.id});
            console.log("Deleted documents: " + JSON.stringify(results));
            break;
        default:
            console.log("Invalid action specified.");
            break;
    }

    return results;
}

// Route for creating a document
app.get('/create', async (req, res) => {
    const { id, name, quantity, location } = req.body;
    const results = await performCRUDOperation(db, 'create', { id, name, quantity, location });

    res.json(results);
});

// Route for reading documents
app.get('/read', async (req, res) => {
    const { id } = req.body;
    const results = await performCRUDOperation(db, 'read', { id });

    res.json(results);
});

// Route for updating a document
app.get('/update', async (req, res) => {
    const { id, name, quantity, location } = req.body;
    const results = await performCRUDOperation(db, 'update', { id, name, quantity, location });

    res.json(results);
});

// Route for deleting documents
app.get('/delete', async (req, res) => {
    const { id } = req.body;
    const results = await performCRUDOperation(db, 'delete', { id });

    res.json(results);
});

// order CRUD
const orderCRUDOperation = async (db, action, data) => {
  var collection = db.collection('order');
  let results;

  switch (action) {
      case 'create':
          results = await collection.insertOne(data);
          console.log("Inserted one document: " + JSON.stringify(results));
          break;
      case 'read':
          results = await collection.find({name: data.name}).toArray();
          console.log("Found documents: " + JSON.stringify(results));
          break;
      case 'update':
          results = await collection.updateOne({name: data.name}, {$set: data});
          console.log("Updated one document: " + JSON.stringify(results));
          break;
      case 'delete':
          results = await collection.deleteMany({name: data.name});
          console.log("Deleted documents: " + JSON.stringify(results));
          break;
      default:
          console.log("Invalid action specified.");
          break;
  }

  return results;
}

// Route for creating a document
app.get('/order/create', async (req, res) => {
  const { name, ice, orderAmount, size, sugar } = req.query;
  const results = await orderCRUDOperation(db, 'create', { name, ice, orderAmount, size, sugar });

  res.render('order_success',{ action: 'create' });
});

// Route for reading documents
app.get('/order/read', async (req, res) => {
  const { name } = req.query;
  const results = await orderCRUDOperation(db, 'read', { name });

  res.render('order_success',{ action: 'read' });
});

// Route for updating a document
app.get('/order/update', async (req, res) => {
  const { name, ice, orderAmount, size, sugar } = req.query;
  const results = await orderCRUDOperation(db, 'update', { name, ice, orderAmount, size, sugar });

  res.render('order_success',{ action: 'update' });
});

// Route for deleting documents
app.get('/order/delete', async (req, res) => {
  const { name } = req.query;
  const results = await orderCRUDOperation(db, 'delete', { name });

  res.render('order_success',{ action: 'delete' });
});

// Create a new item
app.post('/:action', async (req, res) => {
    const { action } = req.params;
    const { criteria, doc } = req.body;

    const results = await performCRUDOperation(db, action, { id, name, quantity, location });

    res.json(results);
});

// ..................................................
// RESTful CRUD

// ...
const user = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String
}));

const drinks = mongoose.model('Drinks', new mongoose.Schema({
  id: Number,
  drinks_name: String,
  drinks_vaild: String    
}));

const orders = mongoose.model('orders', new mongoose.Schema({
  drinks_name: String,
  drinks_orderAmount: Number,
  drinks_ice: {
      type: String,
      enum: ['50%', '25%', '0%'],
      required: true
  },    
  drinks_sugar: {
      type: String,
      enum: ['100%', '75%', '50%', '25%', '0%'],
      required: true
  },
  drinks_size: {
      type: String,
      enum: ['S', 'M', 'L'],
      required: true
  } 
}));

//RESTful services: Create
app.post('/api/user', async function(req, res) {  //Create new User
  const newUser = new user({
      username: req.body.username,
      password: req.body.password
  });
  
  await newUser.save();
  res.status(200).json(newUser);
  
  // curl -X POST http://localhost:8099/api/user -H "Content-Type: application/json" -d '{"username": "Mike", "password": "12345"}'
});

app.post('/api/drinks', async function(req, res) {  // Create new Drinks
  const newDrink = new drinks({
      drinks_name: req.body.name,
      drinks_vaild: req.body.vaild,
  });
  
  try{
      await newDrink.save();
      res.status(200).json(newDrink);
  }catch{
      res.status(500).json({ message: "Error creating drinks", error: error.message });
  }
   
  // curl -X POST http://localhost:8099/api/drinks -H "Content-Type: application/json" -d '{"name": "milk tea", "vaild": "100"}'
});

app.post('/api/orders', async function(req, res) {  // Create new orders
  const newOrder = new orders({      
      drinks_name: req.body.drinks_name,
      drinks_orderAmount: req.body.drinks_orderAmount,
      drinks_ice: req.body.drinks_ice,
      drinks_sugar: req.body.drinks_sugar,
      drinks_size: req.body.drinks_size,
  });    
  
  try{
      await newOrder.save();
      res.status(200).json(newOrder);
  }catch{
      res.status(500).json({ message: "Error creating orders", error: error.message });
  }
      
  // curl -X POST http://localhost:8099/api/orders -H "Content-Type: application/json" -d '{"drinks_name": "milk tea", "drinks_orderAmount": 2, "drinks_ice": "50%", "drinks_sugar": "75%", "drinks_size": "M"}'
});


//RESTful services: Read
app.get('/api/user', async function(req, res) { // Read User message
  const usersData = await user.find();
  res.status(200).json(usersData);
  
  // curl -X GET http://localhost:8099/api/user

});

app.get('/api/drinks', async function(req, res) { // Read Drinks message
  const drinksData = await drinks.find();
  res.status(200).json(drinksData);
  
  // curl -X GET http://localhost:8099/api/drinks

});

app.get('/api/orders', async function(req, res) { // Read Orders message
  const ordersData = await orders.find();
  res.status(200).json(ordersData);
  
  // curl -X GET http://localhost:8099/api/orders

});

//RESTful services: Update
app.put('/api/user/username/:username', async function(req, res) {  //Delete user messgae
  if(req.params.username){
    const updateUser = await user.findOneAndUpdate(
        { username: req.params.username },
        { password: req.body.password},
        { new: true }
    );
    res.status(200).json(updateUser);
  }
  else{
    res.status(500).json({ message: "Error: User not found" });
  }

  // curl -X PUT http://localhost:8099/api/user/password/Mike -H "Content-Type: application/json" -d '{"password": "abcde"}'
});

app.put('/api/drinks/drinks_name/:drinks_name', async function(req, res) { // Read Drinks message
  if(req.params.drinks_name){
      const updateDrink = await drinks.findOneAndUpdate(
          { drinks_name: req.params.drinks_name },
          { drinks_vaild: req.body.drinks_vaild},
          { new: true }
      );
      res.status(200).json(updateDrink);
  }
  else{
      res.status(500).json({ message: "Error: Drink not found" });
  }
     
  // curl -X PUT http://localhost:8099/api/drinks/drinks_name/milk%20tea -H "Content-Type: application/json" -d '{"drinks_vaild": "101"}'
});

app.put('/api/orders/drinks_name/:drinks_name', async function(req, res) { // Read Drinks message
  if(req.params.drinks_name){
      const updateOrder = await orders.findOneAndUpdate(
          { drinks_name: req.params.drinks_name },
          { drinks_orderAmount: req.body.drinks_orderAmount, drinks_ice: req.body.drinks_ice, drinks_sugar: req.body.drinks_sugar, drinks_size: req.body.drinks_size},
          { new: true }
      );
      res.status(200).json(updateOrder);
  }
  else{
      res.status(500).json({ message: "Error: Order not found" });
  }
     
  // curl -X PUT http://localhost:8099/api/orders/drinks_name/milk%20tea -H "Content-Type: application/json" -d '{"drinks_orderAmount": "3", "drinks_ice": "0%", "drinks_sugar": "100%", "drinks_size": "S"}'
});


//RESTful services: Delete
app.delete('/api/user/username/:username', async function(req, res) {  //Delete user messgae
  if(req.params.username){
      await user.deleteOne({username: req.params.username});
     
      res.status(200).json({ message: `User ${req.params.username} deleted` });     
  }
  else{
      res.status(500).json({ message: "Error: User not found" });
  }
  
  // curl -X DELETE http://localhost:8099/api/user/username/Mike
});

app.delete('/api/drinks/drinks_name/:drinks_name', async function(req, res) {  //Delete drink messgae
  if(req.params.drinks_name){
      await drinks.deleteOne({drinks_name: req.params.drinks_name});
     
      res.status(200).json({ message: `Drink ${req.params.drinks_name} deleted` });     
  }
  else{
      res.status(500).json({ message: "Error: Drink not found" });
  }
  
  // curl -X DELETE http://localhost:8099/api/drinks/drinks_name/milk%20tea
});


app.delete('/api/orders/drinks_name/:drinks_name', async function(req, res) {  //Delete order messgae
  if(req.params.drinks_name){
      await orders.deleteOne({drinks_name: req.params.drinks_name});
     
      res.status(200).json({ message: `Order ${req.params.drinks_name} deleted` });     
  }
  else{
      res.status(500).json({ message: "Error: Order not found" });
  }
  
  // curl -X DELETE http://localhost:8099/api/orders/drinks_name/milk%20tea
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
