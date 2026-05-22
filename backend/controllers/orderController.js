const Order = require('../models/order');
const sendEmail = require('../utils/sendEmail'); 

// 1. CREATE: Save a new order
const createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    
    // 👉 REMOVED: Email block used to be here. It is now safely in paymentcontroller!

    res.status(201).json(savedOrder);
  } catch (error) {
    console.log("Error creating order:", error);
    res.status(500).json({ message: "Server error creating order" });
  }
};

// 2. READ: Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); 
    res.status(200).json(orders);
  } catch (error) {
    console.log("Error fetching orders:", error);
    res.status(500).json({ message: "Server error fetching orders" });
  }
};

// 3. UPDATE: Change order status 
const updateOrderStatus = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true } 
    );

    // Send Status Update Email
    if (updatedOrder && updatedOrder.customerEmail) {
      let subject = `Update on your Prabha Dairy Order #${updatedOrder._id.toString().slice(-6)}`;
      let message = `Your order status has been updated to: <strong>${req.body.status}</strong>.`;

      if (req.body.status === 'Out for Delivery') {
        subject = '🚚 Your Prabha Dairy order is Out for Delivery!';
        message = 'Great news! Our delivery partner has picked up your fresh dairy and is on the way to your address.';
      } else if (req.body.status === 'Delivered') {
        subject = '✅ Your Prabha Dairy order has been Delivered!';
        message = 'Your order has arrived safely. Enjoy your farm-fresh goodness!';
      }

      const emailHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
          <h2 style="color: #333;">Order Update</h2>
          <p>Hi ${updatedOrder.customerName},</p>
          <p style="font-size: 16px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #00B894;">${message}</p>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">Thank you for shopping with Prabha Dairy.</p>
        </div>
      `;

      sendEmail({
        email: updatedOrder.customerEmail,
        subject: subject,
        html: emailHTML
      });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.log("Error updating order status:", error);
    res.status(500).json({ message: "Server error updating order" });
  }
};

// 4. READ: Get the last order
const getUserLastOrder = async (req, res) => {
  try {
    const lastOrder = await Order.findOne({ customerEmail: req.params.email }).sort({ createdAt: -1 });
    
    if (lastOrder) {
      res.status(200).json(lastOrder);
    } else {
      res.status(404).json({ message: "No previous orders found" });
    }
  } catch (error) {
    console.log("Error fetching last order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus, getUserLastOrder };