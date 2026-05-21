const express = require('express');
const router = express.Router();
const { createCashfreeOrder } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth'); // User must be logged in to pay!

router.post('/create-order', protect, createCashfreeOrder);

module.exports = router;