// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true, //COOKIES
    headers: {
      'Content-Type': 'application/json',
    },
  });


  const login = async (credential) => {
    try {
      const response = await api.post('/api/login', { credential }, {
        headers: { 'Accept': 'application/json' },
        withCredentials: true
      });
  
      if (response.status === 200) {
        setIsAuthenticated(true);
        navigate('/');
        return true;  // ✅ Fix: Ensure true is returned
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return false;  // ✅ Fix: Ensure false is returned
      }
      throw error;
    }
  };
  

  const logout = async () => {
    try {
      await api.post('/api/logout');
      setIsAuthenticated(false);
      navigate('/login');
      alert('Logged out successfully.');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const verifyAuth = async () => {
    try {
      const response = await api.get('/api/verify_token');
      console.log('Verify auth response:', response.data);
      setIsAuthenticated(response.data.valid);
      return response.data.valid;
    } catch (error) {
      console.error('Verify auth error:', error.response?.data || error.message);
      setIsAuthenticated(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, verifyAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error(
      'useAuth must be used within an AuthProvider. ' +
      'Wrap your component tree with <AuthProvider>.'
    );
  }
  return context;
};