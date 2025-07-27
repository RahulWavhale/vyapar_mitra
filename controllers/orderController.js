const asyncHandler = require('../middleware/asyncHandler');
const Order = require('../models/Order');

//Buyer places a new order
exports.createOrder = asyncHandler(async (req, res) => {
  const { supplierId, materials, deliveryAddress } = req.body;
  const buyerId = req.user.id;

  if (!supplierId || !materials || materials.length === 0) {
    return res.status(400).json({ message: 'Missing required order details' });
  }

  let totalAmount = 0;
  for (const item of materials) {
    totalAmount += item.quantity * item.priceAtPurchase;
  }

  const order = await Order.create({
    buyerId,
    supplierId,
    materials,
    deliveryAddress,
    totalAmount,
  });

  return res.status(201).json({ message: 'Order placed successfully', order });
});

//Supplier updates order status
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const validStatuses = ['accepted', 'in_transit', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status update' });
  }
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  //Only supplier can update
  if (req.user.id !== order.supplierId.toString()) {
    return res.status(403).json({ message: 'Unauthorized to update this order' });
  }
  order.status = status;
  await order.save();
  res.json({ message: 'Order status updated', order });
});

//Buyer views their orders
exports.getBuyerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyerId: req.user.id }).populate('supplierId', 'name phone').populate('materials.material', 'name');
  res.json(orders);
});

//Supplier views orders placed to them
exports.getSupplierOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ supplierId: req.user.id }).populate('buyerId', 'name phone').populate('materials.material', 'name');
  res.json(orders);
});


// Get single order by ID
exports.getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId)
    .populate('buyerId', 'name')
    .populate('supplierId', 'name')
    .populate('materials.material', 'name');
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const userId = req.user._id.toString();
  const isBuyer = order.buyerId._id.toString() === userId;
  const isSupplier = order.supplierId._id.toString() === userId;
  const isAdmin = order.supplierId._id.toString() === userId;

  if (!isBuyer || !isSupplier || !isAdmin) {
    return res.status(403).json({ message: 'You are not authorized to view this order' });
  }

  res.json(order);
});

