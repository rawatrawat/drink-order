const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Connect to MongoDB
mongoose.connect('mongodb+srv://your_username:your_password@cluster0.mongodb.net/your_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create Express app
const app = express();

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Middleware for parsing URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Set static folder for public resources
app.use(express.static('public'));

// Set views folder for EJS templates
app.set('views', './views');
app.set('view engine', 'ejs');

// Define the Drink model
const Drink = mongoose.model('Drink', new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
}));

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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





