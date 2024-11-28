const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Drink = require('./models/drink');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://s1380246:s1380246@cluster0.plvwi.mongodb.net/');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');


// Display drinks menu
app.get('/drinks', isLoggedIn, async (req, res) => {
    const drinks = await Drink.find();
    res.render('drinks', { drinks });
});

// Add new drink
app.post('/drinks', isLoggedIn, upload.single('image'), async (req, res) => {
    const { name, description, price } = req.body;
    const image = req.file ? `/images/${req.file.filename}` : null;
    const drink = new Drink({ name, description, price, image });
    await drink.save();
    res.redirect('/drinks');
});


// Edit drink form
app.get('/drinks/edit/:id', isLoggedIn, async (req, res) => {
    const drink = await Drink.findById(req.params.id);
    res.render('edit_drink', { drink });
});

// Update drink
app.put('/drinks/:id', isLoggedIn, upload.single('image'), async (req, res) => {
    const { name, description, price } = req.body;
    const image = req.file ? `/images/${req.file.filename}` : req.body.existingImage;
    await Drink.findByIdAndUpdate(req.params.id, { name, description, price, image });
    res.redirect('/drinks');
});

// Delete drink
app.delete('/drinks/:id', isLoggedIn, async (req, res) => {
    await Drink.findByIdAndDelete(req.params.id);
    res.redirect('/drinks');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));