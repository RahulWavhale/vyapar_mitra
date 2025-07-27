const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders } = require('../controllers/buyerController');
const requireRole = require('../middleware/roleHandler');
const protectHandler = require('../middleware/protectHandler');

router.use(protectHandler, requireRole('buyer'));

router.post('/place-order', placeOrder);
router.get('/my-orders', getMyOrders);

module.exports = router;
