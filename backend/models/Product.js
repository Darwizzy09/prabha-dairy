const mongoose = require('mongoose');

// 👉 1. We create a "mini-schema" just for reviews
const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Links the review to the logged-in user
  },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String },
  description: { type: String, default: "Farm fresh goodness from Prabha Dairy." },
  isNewLaunch: { type: Boolean, default: false },
  isOutOfStock: { type: Boolean, default: false },

  // 👉 BULLETPROOF VARIANTS ARRAY
  variants: {
    type: [
      {
        size: { type: String, required: true }, 
        price: { type: Number, required: true },
        mrp: { type: Number, required: true }
      }
    ],
    // The Magic Translator: If the controller accidentally passes a JSON string, 
    // this instantly parses it into an array before MongoDB sees it!
    set: function(val) {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch (e) {
          return val;
        }
      }
      return val;
    }
  },

  // 👉 2. We attach the reviews and rating system to the main product
  reviews: [reviewSchema], 
  // (Removed 'required: true' since default: 0 already guarantees a value exists)
  rating: { type: Number, default: 0 }, 
  numReviews: { type: Number, default: 0 }, 

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);