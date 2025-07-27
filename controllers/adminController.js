const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

// GET all users (admin dashboard)
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-passwordHash');
  res.json(users);
});

// Approve a supplier (or any user)
exports.approveSupplier = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user || user.role !== 'supplier') {
    return res.status(404).json({ message: 'Supplier not found' });
  }

  user.isApproved = true;
  await user.save();

  return res.json({ message: 'Supplier approved successfully' });
});

// Admin Dashboard Stats
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalSuppliers = await User.countDocuments({ role: 'supplier' });
  const totalBuyers = await User.countDocuments({ role: 'buyer' });

  return res.json({
    totalUsers,
    totalSuppliers,
    totalBuyers,
    message: 'Stats fetched successfully',
  });
});
