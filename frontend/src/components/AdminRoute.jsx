import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminRoute() {
  const { user } = useContext(AuthContext);

  // CHANGE THIS to the email you want to use as the Admin
  const ADMIN_EMAIL = ["rohitliverpool777@gmail.com", "prabhadairy.1992@gmail.com", "sawalkarsoham88@gmail.com"];

  if (!user) {
    return <Navigate to="/login" />;
  }

  // 👉 2. Check if the logged-in user's email exists inside the array
  if (req.user && ADMIN_EMAIL.includes(req.user.email)) {
    next(); // They are an admin, let them in!
  } else {
    res.status(401).json({ message: "Not authorized as an admin" });
  }

  // If they are logged in AND the email matches, let them inside the vault
  return <Outlet />;
}