import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setAccessToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await api.post('/auth/refresh-token');
        const { accessToken } = response.data;
        setAccessToken(accessToken);

        const meResponse = await api.get('/auth/me');
        const userData = meResponse.data.user;
        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));
      } catch (error) {
        setAccessToken(null);
        setUser(null);
        localStorage.removeItem('auth_user');
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, user: userData } = response.data;
      setAccessToken(accessToken);
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      return { success: true, message: response.data.message, user: userData };
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'Login failed. Please check your credentials.';
      const fieldErrors = error.response?.data?.errors || [];
      return { success: false, message: errorMsg, errors: fieldErrors };
    }
  };

  const register = async (name, email, password, confirmPassword, role = 'user') => {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        confirmPassword,
        role,
      });
      return { success: true, message: response.data.message, user: response.data.user };
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'Registration failed. Please try again.';
      const fieldErrors = error.response?.data?.errors || [];
      return { success: false, message: errorMsg, errors: fieldErrors };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout request error:', error);
    } finally {
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem('auth_user');
      localStorage.removeItem('cart_items');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        role: user?.role || 'guest',
        isSeller: user?.role === 'seller',
        isUser: user?.role === 'user',
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
