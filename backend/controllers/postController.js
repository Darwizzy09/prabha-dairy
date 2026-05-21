const Post = require('../models/Post');

// 1. Get all posts (For the public Feed page)
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Failed to fetch updates" });
  }
};

// 2. Create a new post (For the Admin panel)
const createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file ? req.file.path : req.body.image; 

    const newPost = new Post({ caption, image });
    const savedPost = await newPost.save();
    
    // 👉 Fixed: This now correctly says savedPost
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Failed to create post" });
  }
};

// 3. Like a post (For user engagement)
const likePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } }, 
      { new: true }
    );
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to like post" });
  }
};

module.exports = { getPosts, createPost, likePost };