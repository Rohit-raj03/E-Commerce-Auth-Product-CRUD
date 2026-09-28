import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setAccessToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await api.post('/auth/refresh-token');
        const { accessToken } = response.data;
        setAccessToken(accessToken);

        const meResponse = await api.get('/auth/me');
        setUser(meResponse.data.user);
      } catch (error) {
        setAccessToken(null);
        setUser(null);
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
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'Login failed. Please check your credentials.';
      const fieldErrors = error.response?.data?.errors || [];
      return { success: false, message: errorMsg, errors: fieldErrors };
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        confirmPassword,
      });
      return { success: true, message: response.data.message };
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
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
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
