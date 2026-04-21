const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
  try {
    const { items, address, paymentMethod } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ message: 'No items in order' });
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const deliveryCharge = subtotal >= 500 ? 0 : 50;
    const order = await Order.create({
      user: req.user._id, items, address,
      paymentMethod: paymentMethod || 'cod',
      subtotal, deliveryCharge, total: subtotal + deliveryCharge,
    });
    res.status(201).json(order);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name emoji').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email').populate('items.product', 'name emoji')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email').populate('items.product', 'name emoji price');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin)
      return res.status(403).json({ message: 'Not authorized' });
    res.json(order);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['placed','confirmed','packed','shipped','delivered','cancelled'];
    if (!valid.includes(status))
      return res.status(400).json({ message: 'Invalid status value' });
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    if (['shipped','delivered'].includes(order.status))
      return res.status(400).json({ message: 'Cannot cancel after shipping' });
    order.status = 'cancelled';
    await order.save();
    res.json(order);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
