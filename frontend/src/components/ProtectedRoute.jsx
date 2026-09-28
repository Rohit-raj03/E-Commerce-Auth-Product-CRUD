import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center">
        <div className="w-8 h-8 border-2 border-[#8B9686] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs tracking-widest text-[#5F5A52] uppercase font-serif">
          Verifying session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role || 'user';
    if (!allowedRoles.includes(userRole)) {
      // Redirect to their respective authorized area
      const fallbackPath = userRole === 'seller' ? '/seller/dashboard' : '/products';
      return <Navigate to={fallbackPath} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
