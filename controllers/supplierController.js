const Material = require('../models/Material');
const Order = require('../models/Order');
const asyncHandler = require('../middleware/asyncHandler');

module.exports.addMaterial = asyncHandler(async (req, res) => {
  const { name, pricePerUnit, stock } = req.body;

  const material = await Material.create({
    name,
    pricePerUnit,
    stock,
    supplier: req.user._id,
  });

  return res.status(201).json({ message: 'Material added', material });
});

// Get orders placed to this supplier
module.exports.getSupplierOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ supplier: req.user._id });
  return res.json(orders);
});

exports.getMyMaterials = asyncHandler(async (req, res) => {
  const materials = await Material.find({ supplierId: req.user._id });
  res.json(materials);
});
