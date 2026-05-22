require('dotenv').config(); // 👈 Reads the .env file FIRST

// 1. --- IMPORTS ---
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const postRoutes = require('./routes/postRoutes');

// Initialize App
const app = express();

// 1. --- GLOBAL SECURITY & MIDDLEWARES ---

// 👉 CORS MUST BE THE VERY FIRST THING
app.use(cors({
  origin: ['http://localhost:5173', 'https://prabha-dairy-store.vercel.app'], 
  credentials: true
}));

// Body parser
app.use(express.json());

// 👉 RELAX HELMET'S CROSS-ORIGIN POLICY
app.use(helmet({
  crossOriginResourcePolicy: false, 
}));


// Logger
app.use(morgan('dev'));


// 3. --- RATE LIMITING (The Login Shield) ---
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per 15 minutes
  message: {
    message: "Too many login attempts from this IP, please try again after 15 minutes."
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

// Apply the shield directly to the specific authentication endpoints!
// (Assuming your auth routes are /login and /register inside authRoutes)
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth/register', loginLimiter);


// 4. --- DATABASE CONNECTION ---
mongoose.connect("mongodb+srv://rohitliverpool777_db_user:TkuarLbAaCXS7ddd@cluster001.el8mnex.mongodb.net/?appName=Cluster001/Prabhadairy")
  .then(() => console.log('MongoDB Connected ✅'))
  .catch(err => console.error('MongoDB Connection Error ❌:', err));


// 5. --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/posts', postRoutes);


// 6. --- START SERVER ---

// For Vercel Serverless Export (Keep this commented out for local development)
module.exports = app;

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running securely on port ${PORT} 🚀`));