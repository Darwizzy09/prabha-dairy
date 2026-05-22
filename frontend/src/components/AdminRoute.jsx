import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminRoute() {
  const { user } = useContext(AuthContext);

  const ADMIN_EMAILS = [
    "rohitliverpool777@gmail.com", 
    "prabhadairy.1992@gmail.com", 
    "sawalkarsoham88@gmail.com"
  ];

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check if the user's email exists inside the array
  if (ADMIN_EMAILS.includes(user.email)) {
    return <Outlet />; // They are an admin, let them in!
  } else {
    toast.error("Not authorized as an admin");
    return <Navigate to="/" />; // Kick them back to home
  }
}