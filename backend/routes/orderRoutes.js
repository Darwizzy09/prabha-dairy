const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus, getUserLastOrder } = require('../controllers/orderController');

// Define the endpoints
router.post('/', createOrder);                // Customer places an order
router.get('/', getOrders);                   // Admin views all orders
router.put('/:id/status', updateOrderStatus); // Admin updates order status
router.get('/last/:email', getUserLastOrder);

module.exports = router;