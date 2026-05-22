const axios = require('axios');
const Order = require('../models/order'); 
const sendEmail = require('../utils/sendEmail'); // 👉 Added so this file can send emails!

exports.createCashfreeOrder = async (req, res) => {
  try {
    const { orderAmount, customerName, customerEmail, customerPhone } = req.body;

    const orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

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
        // 👉 FIXED: Now points to your frontend Vercel app
        return_url: "https://prabha-dairy-store.vercel.app/payment-success?order_id={order_id}" 
      }
    };

    const response = await axios.post('https://api.cashfree.com/pg/orders', requestData, {
      headers: {
        'x-client-id': process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
        'x-api-version': '2023-08-01',
        'Content-Type': 'application/json'
      }
    });

    res.status(200).json({
      payment_session_id: response.data.payment_session_id,
      order_id: orderId
    });

  } catch (error) {
    console.error("Cashfree Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to initiate payment" });
  }
};

// 👉 NEW: This function runs AFTER they return from Cashfree
exports.verifyPayment = async (req, res) => {
  try {
    const { order_id, database_order_id } = req.body; // Sent from your React frontend

    // 1. Ask Cashfree if the payment actually succeeded
    const response = await axios.get(`https://api.cashfree.com/pg/orders/${order_id}`, {
      headers: {
        'x-client-id': process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
        'x-api-version': '2023-08-01'
      }
    });

    if (response.data.order_status === "PAID") {
      // 2. Update order in DB to 'Paid'
      const savedOrder = await Order.findByIdAndUpdate(database_order_id, { status: 'Paid' }, { new: true });

      // 3. SEND THE EMAIL (Because they actually paid!)
      if (savedOrder && savedOrder.customerEmail) {
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

      res.status(200).json({ success: true, message: "Payment verified!" });
    } else {
      res.status(400).json({ success: false, message: "Payment not completed." });
    }
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ message: "Server error verifying payment" });
  }
};