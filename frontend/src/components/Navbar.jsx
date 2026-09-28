import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  User as UserIcon,
  ShoppingBag,
  Menu,
  X,
  PlusCircle,
  LogOut,
  LayoutDashboard,
  Package,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, isSeller, isUser, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#F7F3ED] border-b border-[#D5CEC1]">
      <div className="bg-[#EFE9DF] text-[#5F5A52] text-xs py-2 text-center tracking-wider border-b border-[#D5CEC1]/50 font-sans">
        Free Delivery on orders over ₹999 | 100% Genuine Products
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Left Side Navigation Links */}
        <div className="hidden lg:flex items-center space-x-6 text-xs uppercase tracking-widest text-[#24221F] font-sans">
          <RouterLink
            to="/products"
            className={`transition-opacity hover:opacity-60 font-medium ${
              isActive('/products') ? 'border-b-2 border-[#24221F] pb-1' : ''
            }`}
          >
            All Products
          </RouterLink>

          {isSeller && (
            <>
              <RouterLink
                to="/seller/dashboard"
                className={`transition-opacity hover:opacity-60 flex items-center space-x-1.5 font-medium text-emerald-800 ${
                  isActive('/seller/dashboard') ? 'border-b-2 border-emerald-800 pb-1' : ''
                }`}
              >
                <LayoutDashboard size={14} />
                <span>Seller Dashboard</span>
              </RouterLink>

              <RouterLink
                to="/seller/products"
                className={`transition-opacity hover:opacity-60 flex items-center space-x-1.5 font-medium ${
                  isActive('/seller/products') ? 'border-b-2 border-[#24221F] pb-1' : ''
                }`}
              >
                <Package size={14} />
                <span>Manage Products</span>
              </RouterLink>
            </>
          )}

          {(!isAuthenticated || isUser) && (
            <RouterLink
              to="/cart"
              className={`transition-opacity hover:opacity-60 flex items-center space-x-1.5 font-medium ${
                isActive('/cart') ? 'border-b-2 border-[#24221F] pb-1' : ''
              }`}
            >
              <span>Cart ({totalItems})</span>
            </RouterLink>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#24221F] focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </div>

        {/* Logo */}
        <div className="text-center">
          <RouterLink to={isSeller ? '/seller/dashboard' : '/products'} className="inline-block group">
            <h1 className="font-serif text-2xl md:text-3xl tracking-[0.22em] uppercase text-[#24221F] font-bold leading-none">
              A U R A
            </h1>
            <p className="text-[9px] uppercase tracking-[0.35em] text-[#5F5A52] mt-0.5 font-sans">
              M A R K E T
            </p>
          </RouterLink>
        </div>

        {/* Right Action Icons & Auth Profile */}
        <div className="flex items-center space-x-3 md:space-x-5 text-[#24221F]">
          {/* Seller Quick Action: Add Product */}
          {isSeller && (
            <RouterLink
              to="/seller/products/add"
              className="hidden sm:flex items-center space-x-1.5 text-xs uppercase tracking-wider bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-3.5 py-1.5 rounded-lg shadow-sm transition-colors"
            >
              <PlusCircle size={14} strokeWidth={2} />
              <span>Add Product</span>
            </RouterLink>
          )}

          {/* User Cart Icon with Badge */}
          {(!isSeller) && (
            <RouterLink
              to="/cart"
              className="relative p-1.5 hover:opacity-75 transition-opacity"
              title="Shopping Cart"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </RouterLink>
          )}

          {/* User Profile / Role Pill */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-3 pl-2 border-l border-[#D5CEC1]">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-semibold text-[#24221F]">{user?.name}</span>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block self-end mt-0.5 ${
                    isSeller
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {user?.role === 'seller' ? '🏪 Seller' : '🛍️ Customer'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-1.5 text-stone-500 hover:text-rose-600 transition-colors flex items-center"
              >
                <LogOut size={18} strokeWidth={1.8} />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <RouterLink
                to="/login"
                className="hover:opacity-70 flex items-center space-x-1 text-xs tracking-wider uppercase font-semibold text-[#24221F] px-2.5 py-1.5"
                title="Sign In"
              >
                <UserIcon size={16} strokeWidth={1.8} />
                <span className="hidden sm:inline">Sign In</span>
              </RouterLink>
              <RouterLink
                to="/register"
                className="bg-[#24221F] text-white hover:bg-black px-3.5 py-1.5 rounded-md text-xs uppercase tracking-wider font-medium transition-colors"
              >
                Register
              </RouterLink>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F7F3ED] border-b border-[#D5CEC1] px-6 py-5 space-y-4">
          {isAuthenticated && (
            <div className="pb-3 border-b border-[#D5CEC1] flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#24221F]">{user?.name}</p>
                <p className="text-xs text-[#5F5A52]">{user?.email}</p>
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  isSeller
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {user?.role === 'seller' ? 'Seller' : 'Customer'}
              </span>
            </div>
          )}

          <div className="flex flex-col space-y-3 text-sm uppercase tracking-wider text-[#24221F] font-sans">
            <RouterLink
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 font-medium hover:text-[#8B9686]"
            >
              All Products
            </RouterLink>

            {isSeller ? (
              <>
                <RouterLink
                  to="/seller/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 font-medium text-emerald-800 flex items-center space-x-2"
                >
                  <LayoutDashboard size={16} />
                  <span>Seller Dashboard</span>
                </RouterLink>
                <RouterLink
                  to="/seller/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 font-medium flex items-center space-x-2"
                >
                  <Package size={16} />
                  <span>Manage Products</span>
                </RouterLink>
                <RouterLink
                  to="/seller/products/add"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 font-medium text-emerald-700 flex items-center space-x-2"
                >
                  <PlusCircle size={16} />
                  <span>Add New Product</span>
                </RouterLink>
              </>
            ) : (
              <RouterLink
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 font-medium flex items-center space-x-2 text-amber-900"
              >
                <ShoppingBag size={16} />
                <span>Cart ({totalItems})</span>
              </RouterLink>
            )}

            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="text-left py-2 font-medium text-rose-600 flex items-center space-x-2 pt-2 border-t border-[#D5CEC1]"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            ) : (
              <div className="pt-2 border-t border-[#D5CEC1] flex space-x-4">
                <RouterLink
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 font-medium"
                >
                  Sign In
                </RouterLink>
                <RouterLink
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 font-medium font-bold text-amber-800"
                >
                  Create Account
                </RouterLink>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
