const Order = require('../models/order');
const sendEmail = require('../utils/sendEmail'); // 👉 Make sure this file exists!

// 1. CREATE: Save a new order (Used on the Checkout page)
const createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();

    // 👉 NEW: Send Confirmation Email (Fire and forget, no await)
    if (savedOrder.customerEmail) {
      const emailHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #00B894; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Order Confirmed!</h1>
          </div>
          <div style="padding: 20px;">
            <p>Hi <strong>${savedOrder.customerName}</strong>,</p>
            <p>Thank you for choosing Prabha Dairy! Your order <strong>#${savedOrder._id.toString().slice(-6)}</strong> has been successfully placed.</p>
            
            <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Summary</h3>
            <ul style="list-style: none; padding: 0;">
              ${savedOrder.items.map(item => `
                <li style="margin-bottom: 10px; display: flex; justify-content: space-between;">
                  <span>${item.quantity}x ${item.name}</span>
                </li>
              `).join('')}
            </ul>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0;"><strong>Total Amount:</strong> ₹${savedOrder.totalAmount}</p>
              <p style="margin: 5px 0 0 0;"><strong>Payment Method:</strong> ${savedOrder.paymentMethod}</p>
            </div>
            
            <p style="margin-top: 20px; color: #666; font-size: 14px;">We are preparing your fresh dairy. You will receive another update when it is out for delivery.</p>
          </div>
        </div>
      `;

      sendEmail({
        email: savedOrder.customerEmail,
        subject: 'Your Prabha Dairy Order is Confirmed!',
        html: emailHTML
      });
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    console.log("Error creating order:", error);
    res.status(500).json({ message: "Server error creating order" });
  }
};

// 2. READ: Get all orders (Used on the Admin Orders & Analytics pages)
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // Newest orders at the top
    res.status(200).json(orders);
  } catch (error) {
    console.log("Error fetching orders:", error);
    res.status(500).json({ message: "Server error fetching orders" });
  }
};

// 3. UPDATE: Change order status (Used when Admin clicks dropdown)
const updateOrderStatus = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, // We just update the status field
      { new: true } 
    );

    // 👉 NEW: Send Status Update Email
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

// 4. READ: Get the last order for a specific user (For Auto-fill Checkout)
const getUserLastOrder = async (req, res) => {
  try {
    // Find the newest order matching the email sent in the URL
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

// 👉 Don't forget to export it! Add it to the bottom list:
module.exports = { createOrder, getOrders, updateOrderStatus, getUserLastOrder };