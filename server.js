const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const multer = require('multer');
const path = require('path');
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
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Route for admin dashboard
app.get('/admin', async (req, res) => {
  const items = await Item.find();
  res.render('admin', { items });
});

// Add new item
app.post('/items', upload.single('image'), async (req, res) => {
  const { name, description, price } = req.body;
  const image = req.file ? `/images/${req.file.filename}` : null;
  const item = new Item({ name, description, price, image });
  await item.save();
  res.redirect('/admin');
});

// Edit item form
app.get('/items/edit/:id', async (req, res) => {
  const item = await Item.findById(req.params.id);
  res.render('edit_item', { item });
});

// Update item
app.put('/items/:id', upload.single('image'), async (req, res) => {
  const { name, description, price } = req.body;
  const image = req.file ? `/images/${req.file.filename}` : req.body.existingImage;
  await Item.findByIdAndUpdate(req.params.id, { name, description, price, image });
  res.redirect('/admin');
});

// Delete item
app.delete('/items/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.redirect('/admin');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




