const mongoose = require('mongoose'); // 👉 NEW: Required to check the connection status
const Product = require('../models/Product');

// GET: Fetch all products
const getProducts = async (req, res) => {
  try {
    // 👉 THE NUCLEAR FIX: If Vercel dropped the connection, force it open right now
    if (mongoose.connection.readyState !== 1) {
      console.log("Wake up call! Forcing fresh MongoDB connection...");
      // Replace YOUR_NEW_PASSWORD below with your actual password
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000 // Only wait 5 seconds instead of 10
      });
    }

    const products = await Product.find().sort({ createdAt: -1 }); // Newest first
    res.status(200).json(products);
  } catch (error) {
    console.error("NUCLEAR FIX ERROR:", error);
    res.status(500).json({ message: "Server error fetching products", exactError: error.message });
  }
};

// --- CREATE PRODUCT ---
const createProduct = async (req, res) => {
  try {
    // 1. Safely parse the variants string into a real JavaScript array
    let parsedVariants = [];
    if (req.body.variants) {
      try {
        parsedVariants = JSON.parse(req.body.variants);
      } catch (parseError) {
        return res.status(400).json({ message: "Invalid variants format" });
      }
    }

    // 2. Build a brand new object manually
    const productData = {
      name: req.body.name,
      category: req.body.category,
      description: req.body.description || '',
      isNewLaunch: req.body.isNewLaunch === 'true',
      isOutOfStock: req.body.isOutOfStock === 'true',
      variants: parsedVariants,
    };

    // 3. Add the Cloudinary image URL if one was uploaded
    if (req.file) {
      productData.image = req.file.path;
    }

    // 4. Save to MongoDB
    const product = new Product(productData);
    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};


// --- UPDATE PRODUCT ---
const updateProduct = async (req, res) => {
  try {
    // 1. Create a clean update object
    const updateData = {
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      isNewLaunch: req.body.isNewLaunch === 'true',
      isOutOfStock: req.body.isOutOfStock === 'true',
    };

    // 2. Safely parse variants if they are included in the update
    if (req.body.variants) {
      try {
        updateData.variants = JSON.parse(req.body.variants);
      } catch (parseError) {
        return res.status(400).json({ message: "Invalid variants format" });
      }
    }

    // 3. Update Cloudinary image if a new one was uploaded
    if (req.file) {
      updateData.image = req.file.path;
    }

    // 4. Send the clean object to MongoDB
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true } 
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

// DELETE: Remove a product
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
};

const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'You have already reviewed this product' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;

      product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 5) / product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview
};