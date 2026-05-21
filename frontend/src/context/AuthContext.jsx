import { createContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // This runs automatically when the website starts
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo)); // "Remember" the user from the browser storage
    }
  }, []);

  // LOGIN FUNCTION
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data); // Set the user in the app memory
    localStorage.setItem('userInfo', JSON.stringify(data)); // Save to browser storage
  };

  // LOGOUT FUNCTION
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo'); // Clear from browser storage
    window.location.href = '/login'; // Send them back to login page
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};