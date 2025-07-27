const Order = require('../models/Order');
const Material = require('../models/Material');
const asyncHandler = require('../middleware/asyncHandler');

module.exports.placeOrder = asyncHandler(async (req, res) => {
  const { materialId, quantity } = req.body;

  const material = await Material.findById(materialId);
  if (!material || material.stockAvailable < quantity) {
    return res.status(400).json({ message: 'Insufficient stock or invalid material' });
  }
  const order = await Order.create({
    material: material._id,
    quantity,
    buyer: req.user._id,
    supplier: material.supplierId,
  });
//reduce stock 
  material.stockAvailable -= quantity;
  await material.save();
  return res.status(201).json({ message: 'Order placed', order });
});

// Get buyer's own orders
module.exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id }).populate('Material');
  return res.json(orders);
});
