const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const Drink = require('./models/drink');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://new_user_1:new_user_1@cluster0.3aytms0.mongodb.net/', {
  retryWrites: true,
  w: 'majority'
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');

// Route for admin dashboard
app.get('/admin', async (req, res) => {
  try {
    const drinks = await Drink.find();
    res.render('admin', { drinks });
  } catch (err) {
    res.status(500).send('Error retrieving drinks');
  }
});

// API Endpoints

// Add new drink
app.post('/api/drinks', async (req, res) => {
  const { name, description, price } = req.body;
  try {
    const drink = new Drink({ name, description, price });
    await drink.save();
    res.redirect('/admin');
  } catch (err) {
    res.status(500).send('Error adding drink');
  }
});

// Edit drink form
app.get('/drinks/edit/:id', async (req, res) => {
  try {
    const drink = await Drink.findById(req.params.id);
    res.render('edit_drink', { drink });
  } catch (err) {
    res.status(500).send('Error retrieving drink for edit');
  }
});

// Update drink
app.put('/api/drinks/:id', async (req, res) => {
  const { name, description, price } = req.body;
  try {
    await Drink.findByIdAndUpdate(req.params.id, { name, description, price });
    res.redirect('/admin');
  } catch (err) {
    res.status(500).send('Error updating drink');
  }
});

// Delete drink
app.delete('/api/drinks/:id', async (req, res) => {
  try {
    await Drink.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
  } catch (err) {
    res.status(500).send('Error deleting drink');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));






