const axios = require('axios');
const Order = require('../models/order'); // Assuming we created this earlier!

exports.createCashfreeOrder = async (req, res) => {
  try {
    const { orderAmount, customerName, customerEmail, customerPhone } = req.body;

    // 1. Generate a unique Order ID for your database
    const orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // 2. Prepare the data for Cashfree
    const requestData = {
      order_id: orderId,
      order_amount: orderAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: req.user._id.toString(),
        customer_name: customerName || "Guest User",
        customer_email: customerEmail || "guest@prabhadairy.com",
        customer_phone: customerPhone || "9999999999"
      },
      order_meta: {
        return_url: "https://prabha-dairy.vercel.app/payment-success?order_id={order_id}" // We will build this page next!
      }
    };

    // 3. Send request to Cashfree (Using Sandbox/Test environment URL)
    // NOTE: Change 'sandbox' to 'api' when going live!
    const response = await axios.post('https://api.cashfree.com/pg/orders', requestData, {
      headers: {
        'x-client-id': process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
        'x-api-version': '2023-08-01',
        'Content-Type': 'application/json'
      }
    });

    // 4. Send the Payment Session ID back to the React frontend
    res.status(200).json({
      payment_session_id: response.data.payment_session_id,
      order_id: orderId
    });

  } catch (error) {
    console.error("Cashfree Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to initiate payment" });
  }
};