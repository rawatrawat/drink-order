const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Connect to MongoDB
mongoose.connect('mongodb+srv://s1380246:s1380246@cluster0.plvwi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');

// Assuming you have a MongoDB client connected and available as `db`
const db = mongoose.connection;

const drinkSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
});
const Drink = mongoose.model('Drink', drinkSchema);

// Route for admin dashboard
app.get('/admin/drinks', async (req, res) => {
  try {
    const drinks = await Drink.find();
    res.render('admin_drinks', { drinks });
  } catch (error) {
    console.error('Error retrieving drinks:', error);
    res.status(500).send('Error retrieving drinks');
  }
});

// Add new drink
app.post('/drinks', async (req, res) => {
  const { name, description, price } = req.body;
  const drink = new Drink({ name, description, price });
  try {
    await drink.save();
    res.redirect('/admin/drinks');
  } catch (error) {
    console.error('Error adding drink:', error);
    res.status(500).send('Error adding drink');
  }
});

// Edit drink form
app.get('/drinks/edit/:id', async (req, res) => {
  try {
    const drink = await Drink.findById(req.params.id);
    res.render('edit_drink', { drink });
  } catch (error) {
    console.error('Error retrieving drink for edit:', error);
    res.status(500).send('Error retrieving drink for edit');
  }
});

// Update drink
app.post('/drinks/update/:id', async (req, res) => {
  const { name, description, price } = req.body;
  try {
    await Drink.findByIdAndUpdate(req.params.id, { name, description, price });
    res.redirect('/admin/drinks');
  } catch (error) {
    console.error('Error updating drink:', error);
    res.status(500).send('Error updating drink');
  }
});

// Delete drink
app.post('/drinks/delete/:id', async (req, res) => {
  try {
    await Drink.findByIdAndDelete(req.params.id);
    res.redirect('/admin/drinks');
  } catch (error) {
    console.error('Error deleting drink:', error);
    res.status(500).send('Error deleting drink');
  }
});

// CRUD operations using direct MongoDB collection access
const performCRUDOperation = async (action, data) => {
  const collection = db.collection('drinks');
  let results;

  switch (action) {
    case 'create':
      results = await collection.insertOne(data);
      console.log("Inserted one document: " + JSON.stringify(results));
      break;
    case 'read':
      results = await collection.find({_id: mongoose.Types.ObjectId(data.id)}).toArray();
      console.log("Found documents: " + JSON.stringify(results));
      break;
    case 'update':
      results = await collection.updateOne({_id: mongoose.Types.ObjectId(data.id)}, {$set: data});
      console.log("Updated one document: " + JSON.stringify(results));
      break;
    case 'delete':
      results = await collection.deleteMany({_id: mongoose.Types.ObjectId(data.id)});
      console.log("Deleted documents: " + JSON.stringify(results));
      break;
    default:
      console.log("Invalid action specified.");
      break;
  }

  return results;
};

// Route for creating a document
app.post('/create', async (req, res) => {
  const { name, description, price } = req.body;
  const results = await performCRUDOperation('create', { name, description, price });
  res.json(results);
});

// Route for reading documents
app.post('/read', async (req, res) => {
  const { id } = req.body;
  const results = await performCRUDOperation('read', { id });
  res.json(results);
});

// Route for updating a document
app.post('/update', async (req, res) => {
  const { id, name, description, price } = req.body;
  const results = await performCRUDOperation('update', { _id: id, name, description, price });
  res.json(results);
});

// Route for deleting documents
app.post('/delete', async (req, res) => {
  const { id } = req.body;
  const results = await performCRUDOperation('delete', { id });
  res.json(results);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



