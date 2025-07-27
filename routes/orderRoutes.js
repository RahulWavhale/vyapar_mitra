const express = require('express');
const router = express.Router();
const { createOrder, updateOrderStatus,getBuyerOrders, getSupplierOrders, getOrderById } = require('../controllers/orderController');
const requireRole = require('../middleware/roleHandler');
const protectHandler = require('../middleware/protectHandler');


router.post('/create', protectHandler, requireRole('buyer'), createOrder);
router.patch('/:orderId/status', protectHandler, requireRole('supplier'), updateOrderStatus);

router.get('/buyer', protectHandler, getBuyerOrders);
router.get('/supplier', protectHandler, getSupplierOrders);
router.get('/:orderId', protectHandler, getOrderById);


module.exports = router;
