const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:    { type: String, required: true },
  price:   { type: Number, required: true },
  qty:     { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:   [orderItemSchema],
  address: {
    street:  { type: String, required: true },
    city:    { type: String, required: true },
    state:   { type: String, required: true },
    pincode: { type: String, required: true },
    phone:   { type: String, required: true },
  },
  paymentMethod:  { type: String, enum: ['cod','razorpay','upi'], default: 'cod' },
  paymentStatus:  { type: String, enum: ['pending','paid','failed'], default: 'pending' },
  razorpayOrderId:   String,
  razorpayPaymentId: String,
  subtotal:       { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },
  total:          { type: Number, required: true },
  status: {
    type: String,
    enum: ['placed','confirmed','packed','shipped','delivered','cancelled'],
    default: 'placed',
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
