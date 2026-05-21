const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  caption: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String, 
    required: true 
  },
  likes: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);