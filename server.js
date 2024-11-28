const express = require('express');

const bodyParser = require('body-parser');


const app = express();

// Connect to MongoDB
const mongoose = require('mongoose');

const uri = 'mongodb+srv://s1380246:s1380246@cluster0.plvwi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// mongoose.connect(uri);

const drinkSchema = require('./models/drinks');

// Compile our schema into a Model. 
const Drink = mongoose.model('Drink', drinkSchema);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');

// Route for admin dashboard
app.get('/admin', async (req, res) => {
  try {
    const drinks = await Drink.find();
    res.render('admin', { drinks });
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
    res.redirect('/admin');
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
    res.redirect('/admin');
  } catch (error) {
    console.error('Error updating drink:', error);
    res.status(500).send('Error updating drink');
  }
});

// Delete drink
app.post('/drinks/delete/:id', async (req, res) => {
  try {
    await Drink.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
  } catch (error) {
    console.error('Error deleting drink:', error);
    res.status(500).send('Error deleting drink');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));






