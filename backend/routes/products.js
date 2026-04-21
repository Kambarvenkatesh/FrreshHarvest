const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

const seedProducts = [
  { name:'Oyster Mushrooms', price:150, category:'mushroom', emoji:'🍄', tag:'Best Seller', organic:true, unit:'kg' },
  { name:'Button Mushrooms', price:180, category:'mushroom', emoji:'🍄', tag:'Popular', organic:false, unit:'kg' },
  { name:'Milky Mushrooms',  price:200, category:'mushroom', emoji:'🍄', tag:'Premium',   organic:true, unit:'kg' },
  { name:'Shiitake Mushrooms',price:280,category:'mushroom', emoji:'🍄', tag:'Exotic',    organic:true, unit:'kg' },
  { name:'King Oyster',      price:320, category:'mushroom', emoji:'🍄', tag:'Rare',      organic:true, unit:'kg' },
  { name:'Organic Veggie Box',price:299,category:'box',      emoji:'🥬', tag:'Weekly Box',organic:true, unit:'wk' },
];

router.get('/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    const products = await Product.insertMany(seedProducts);
    res.json({ message: `${products.length} products seeded!`, products });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', protect, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
