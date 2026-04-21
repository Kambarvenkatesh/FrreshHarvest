const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  price:       { type: Number, required: true, min: 0 },
  category:    { type: String, required: true, enum: ['mushroom', 'box'] },
  emoji:       { type: String, default: '🍄' },
  tag:         { type: String, default: '' },
  organic:     { type: Boolean, default: false },
  description: { type: String, default: '' },
  inStock:     { type: Boolean, default: true },
  unit:        { type: String, default: 'kg' },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
