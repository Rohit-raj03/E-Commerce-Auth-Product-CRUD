import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Products from '../pages/Products';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import SellerDashboard from '../pages/SellerDashboard';
import SellerProducts from '../pages/SellerProducts';
import AddProduct from '../pages/AddProduct';
import EditProduct from '../pages/EditProduct';
import ProtectedRoute from '../components/ProtectedRoute';

// Dynamic home redirect based on role
const RootRedirect = () => {
  const { isAuthenticated, isSeller, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-stone-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  if (isAuthenticated && isSeller) {
    return <Navigate to="/seller/dashboard" replace />;
  }
  return <Navigate to="/products" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />

      {/* User Only Routes */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <Cart />
          </ProtectedRoute>
        }
      />

      {/* Seller Only Routes */}
      <Route
        path="/seller/dashboard"
        element={
          <ProtectedRoute allowedRoles={['seller']}>
            <SellerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/products"
        element={
          <ProtectedRoute allowedRoles={['seller']}>
            <SellerProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/products/add"
        element={
          <ProtectedRoute allowedRoles={['seller']}>
            <AddProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/products/edit/:id"
        element={
          <ProtectedRoute allowedRoles={['seller']}>
            <EditProduct />
          </ProtectedRoute>
        }
      />

      {/* Legacy / Convenience Aliases */}
      <Route
        path="/products/add"
        element={
          <ProtectedRoute allowedRoles={['seller']}>
            <AddProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['seller']}>
            <EditProduct />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
};

export default AppRoutes;
