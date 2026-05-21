const express = require('express');
const router = express.Router();
const { getPosts, createPost, likePost } = require('../controllers/postController');
const upload = require('../middleware/upload'); 
const { protect } = require('../middleware/auth'); // Bring in your security guard!

// ✅ PUBLIC ROUTE
router.get('/', getPosts);

// 🔒 PROTECTED ROUTE (Only logged in admins can post updates)
router.post('/', protect, upload.single('image'), createPost); 

// Depending on your logic, you might want anyone to like, or only logged-in users. 
// If only logged in users can like, add 'protect' here too:
router.put('/:id/like', likePost);

module.exports = router;