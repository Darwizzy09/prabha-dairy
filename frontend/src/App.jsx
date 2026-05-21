import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import ProductDetails from './pages/ProductDetails';
import PaymentSuccess from './pages/PaymentSuccess';
import MyOrders from './pages/MyOrders';
import Updates from './pages/Updates';
import ScrollToTop from './components/ScrollToTop';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Shipping from './pages/Shipping';
import Refunds from './pages/Refunds';
import Contact from './pages/Contact';
import About from './pages/About';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Admin Pages & Layouts
import AdminRoute from './components/AdminRoute';
import AdminLayout from './pages/admin/AdminLayout';
import Inventory from './pages/admin/Inventory';
import Orders from './pages/admin/Order';
import Analytics from './pages/admin/Analytics';
import AdminPosts from './pages/admin/AdminPosts';



// MAKE SURE THIS IMPORT IS AT THE TOP OF YOUR FILE:
// import AdminPosts from './admin/AdminPosts'; // (Or './pages/AdminPosts' depending on where you saved it)

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          {/* The Navbar must be OUTSIDE of <Routes> so it shows on every page */}
          <ScrollToTop />
          <Navbar />
          <Toaster position="top-right" />

          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/updates" element={<Updates />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/login" element={<Login />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/refunds" element={<Refunds />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/resetpassword/:token" element={<ResetPassword />} />

            {/* SECURE ADMIN VAULT */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                {/* The paths here are relative to "/admin" */}
                <Route path="inventory" element={<Inventory />} />
                <Route path="orders" element={<Orders />} />
                <Route path="analytics" element={<Analytics />} />

                {/* 👉 THE FIX: Changed from "/admin/posts" to just "posts" */}
                <Route path="posts" element={<AdminPosts />} />
              </Route>
            </Route>

          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;