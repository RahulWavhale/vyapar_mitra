const express = require('express');
const router = express.Router();
const { approveSupplier, getAllUsers, getDashboardStats } = require('../controllers/adminController');
const protectHandler = require('../middleware/protectHandler');
const requireRole = require('../middleware/roleHandler');

// All admin routes need protect + admin role
router.use(protectHandler, requireRole('admin'));

router.get('/users', getAllUsers);
router.put('/approve-supplier/:id', approveSupplier);
router.get('/dashboard', getDashboardStats);

module.exports = router;
