const User = require('../models/user');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Helper function to create the Digital ID (Token)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// 1. SIGNUP LOGIC (Create Account)
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already has an account
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create the new user in MongoDB
    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.log("THE REAL ERROR IS:", error); // <-- Add this line
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// 2. LOGIN LOGIC (Sign In)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if user exists and password is correct
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

// 3. FORGOT PASSWORD LOGIC (Generates & Sends Email)
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "No user found with that email" });
    }

    // Generate a random reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash it and save it to the database (valid for 15 minutes)
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    // Create the Reset URL for the frontend (Update to Vercel URL later!)
    const resetUrl = `http://localhost:5173/resetpassword/${resetToken}`; 

    // Set up Nodemailer to send via Gmail
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your Gmail App Password
      },
    });

    // Send the email
    await transporter.sendMail({
      from: `"Prabha Dairy" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <a href="${resetUrl}" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    });

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.log("Forgot Password Error:", error);
    res.status(500).json({ message: "Email could not be sent" });
  }
};

// 4. RESET PASSWORD LOGIC (Saves new password)
exports.resetPassword = async (req, res) => {
  try {
    // Hash the token from the URL to match what is in the DB
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // Find the user with that exact token, ensuring it hasn't expired
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Set the new password and clear the reset fields
    user.password = req.body.password; 
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful! You can now log in." });
  } catch (error) {
    console.log("Reset Password Error:", error);
    res.status(500).json({ message: "Server error during reset" });
  }
};