const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  paymentMethod: { 
    type: String, 
    required: true,
    default: 'Cash on Delivery' 
  },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  
  // This saves an array of the exact items they bought
  items: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
  }],
  
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending' }, // Starts as Pending automatically
}, { timestamps: true }); // Tracks exact date/time ordered

module.exports = mongoose.model('Order', orderSchema);