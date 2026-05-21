// authRoutes.js
const express = require('express');
const router = express.Router();
const { login, register, forgotPassword, resetPassword } = require('../controllers/authController');
router.post('/login', login); // Add register similarly
router.post('/register', register); // Add this line!
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:token', resetPassword);
module.exports = router;

