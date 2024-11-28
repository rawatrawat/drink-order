const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Item = require('./models/item');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://new_user_1:new_user_1@cluster0.3aytms0.mongodb.net/', {
  retryWrites: true,
  w: 'majority'
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');

// Route for admin dashboard
app.get('/admin', async (req, res) => {
  const items = await Item.find();
  res.render('admin', { items });
});

// Add new item
app.post('/items', async (req, res) => {
  const { name, description, price } = req.body;
  const item = new Item({ name, description, price });
  await item.save();
  res.redirect('/admin');
});

// Edit item form
app.get('/items/edit/:id', async (req, res) => {
  const item = await Item.findById(req.params.id);
  res.render('edit_item', { item });
});

// Update item
app.post('/items/update/:id', async (req, res) => {
  const { name, description, price } = req.body;
  await Item.findByIdAndUpdate(req.params.id, { name, description, price });
  res.redirect('/admin');
});

// Delete item
app.post('/items/delete/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.redirect('/admin');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





