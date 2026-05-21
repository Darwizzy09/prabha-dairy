import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const ADMIN_EMAIL = [ "rohitliverpool777@gmail.com", "prabhadairy.1992@gmail.com", "sawalkarsoham88@gmail.com"];

  // 1. If no user is logged in, send them to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If user is logged in but NOT the admin, send them home
  if (user.email !== ADMIN_EMAIL) {
    return <Navigate to="/" replace />;
  }

  // 3. If they pass both tests, let them through
  return children;
};

export default ProtectedRoute;