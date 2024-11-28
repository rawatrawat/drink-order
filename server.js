const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');

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
  secret: 'your_secret_key',
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
    res.redirect('/dashboard'); // Redirect to dashboard if user is already logged in
  } else {
    res.render('login'); // Render login EJS template
  }
});

// Route for handling login logic
app.post('/login', async (req, res) => {
  const { user_name, user_password } = req.body;
  try {
    const user = await mongoose.model('User', new mongoose.Schema({
      user_name: String,
      user_password: String
    })).findOne({ user_name, user_password });
    if (user) {
      req.session.user = user;
      res.redirect('/dashboard'); // Redirect to dashboard after successful login
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Route for logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
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

// Create a new item
app.post('/:action', async (req, res) => {
    const { action } = req.params;
    const { criteria, doc } = req.body;

    const results = await performCRUDOperation(db, action, { id, name, quantity, location });

    res.json(results);
});

// ..................................................
// RESTful CRUD

// RESTful CRUD Endpoints

// Create a new drink
app.post('/api/drinks', async (req, res) => {
  try {
    const { name, description, price, image } = req.body;
    const drink = new Drink({ name, description, price, image });
    const savedDrink = await drink.save();
    res.status(201).json(savedDrink);
  } catch (error) {
    res.status(500).json({ message: 'Error creating drink', error });
  }
});

// Read all drinks
app.get('/api/drinks', async (req, res) => {
  try {
    const drinks = await Drink.find();
    res.status(200).json(drinks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching drinks', error });
  }
});

// Read a single drink by ID
app.get('/api/drinks/:id', async (req, res) => {
  try {
    const drink = await Drink.findById(req.params.id);
    if (drink) {
      res.status(200).json(drink);
    } else {
      res.status(404).json({ message: 'Drink not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching drink', error });
  }
});

// Update a drink
app.put('/api/drinks/:id', async (req, res) => {
  try {
    const { name, description, price, image } = req.body;
    const updatedDrink = await Drink.findByIdAndUpdate(req.params.id, { name, description, price, image }, { new: true });
    if (updatedDrink) {
      res.status(200).json(updatedDrink);
    } else {
      res.status(404).json({ message: 'Drink not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating drink', error });
  }
});

// Delete a drink
app.delete('/api/drinks/:id', async (req, res) => {
  try {
    const deletedDrink = await Drink.findByIdAndDelete(req.params.id);
    if (deletedDrink) {
      res.status(200).json({ message: 'Drink deleted' });
    } else {
      res.status(404).json({ message: 'Drink not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting drink', error });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



