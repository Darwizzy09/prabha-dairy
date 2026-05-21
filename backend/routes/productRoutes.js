const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload'); 
const { getProducts, createProduct, updateProduct, deleteProduct, createProductReview } = require('../controllers/productController');
const { protect } = require('../middleware/auth'); // Make sure this path is correct for your auth file!

// ✅ PUBLIC ROUTES
router.get('/', getProducts);

// 🔒 PROTECTED ROUTES (Notice how 'protect' is added before 'upload')
router.post('/', protect, upload.single('image'), createProduct);
router.put('/:id', protect, upload.single('image'), updateProduct);
router.delete('/:id', protect, deleteProduct);

// Reviews route
router.post('/:id/reviews', protect, createProductReview);

module.exports = router;