import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, Menu, X, PlusCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
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
        Free shipping on orders over $150 | Easy 30-day returns
      </div>

      <nav className="max-w-aura-container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="hidden lg:flex items-center space-x-8 text-xs uppercase tracking-widest text-[#24221F] font-sans">
          <RouterLink
            to="/products"
            className={`transition-opacity hover:opacity-60 ${
              isActive('/products') ? 'border-b border-[#24221F] pb-1' : ''
            }`}
          >
            Shop
          </RouterLink>
          <span className="hover:opacity-60 cursor-pointer transition-opacity">New In</span>
          <span className="hover:opacity-60 cursor-pointer transition-opacity">Collections</span>
          <span className="hover:opacity-60 cursor-pointer transition-opacity">Lookbook</span>
          <span className="hover:opacity-60 cursor-pointer transition-opacity">About</span>
        </div>

        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-[#24221F] focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>

        <div className="text-center">
          <RouterLink to="/products" className="inline-block group">
            <h1 className="font-serif text-2xl md:text-3xl tracking-[0.25em] uppercase text-[#24221F] font-medium leading-none">
              A U R A
            </h1>
            <p className="text-[9px] uppercase tracking-[0.35em] text-[#5F5A52] mt-1 font-sans">
              E S S E N T I A L S
            </p>
          </RouterLink>
        </div>

        <div className="flex items-center space-x-4 md:space-x-6 text-[#24221F]">
          <button className="hidden sm:block hover:opacity-60 transition-opacity" aria-label="Search">
            <Search size={18} strokeWidth={1.5} />
          </button>

          {isAuthenticated && (
            <RouterLink
              to="/products/add"
              className="hidden md:flex items-center space-x-1 text-xs uppercase tracking-wider text-[#8B9686] hover:text-[#24221F] transition-colors border border-[#8B9686] px-3 py-1 rounded-[2px]"
            >
              <PlusCircle size={14} strokeWidth={1.5} />
              <span>Add Product</span>
            </RouterLink>
          )}

          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <span className="hidden sm:inline-block text-xs tracking-wider text-[#5F5A52]">
                Hi, <strong className="text-[#24221F] font-medium">{user?.name}</strong>
              </span>
              <button
                onClick={handleLogout}
                title="Logout"
                className="hover:opacity-60 transition-opacity text-[#5F5A52] hover:text-[#24221F] flex items-center space-x-1"
              >
                <LogOut size={18} strokeWidth={1.5} />
              </button>
            </div>
          ) : (
            <RouterLink
              to="/login"
              className="hover:opacity-60 transition-opacity flex items-center space-x-1 text-xs tracking-widest uppercase"
              title="Sign In"
            >
              <User size={18} strokeWidth={1.5} />
              <span className="hidden sm:inline">Sign In</span>
            </RouterLink>
          )}

          <button className="hidden sm:block hover:opacity-60 transition-opacity" aria-label="Wishlist">
            <Heart size={18} strokeWidth={1.5} />
          </button>

          <button className="hover:opacity-60 transition-opacity relative" aria-label="Cart">
            <ShoppingBag size={18} strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F7F3ED] border-b border-[#D5CEC1] px-6 py-6 space-y-4 text-xs uppercase tracking-widest">
          <RouterLink
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#24221F] border-b border-[#E4DED3]"
          >
            Shop All Products
          </RouterLink>

          {isAuthenticated ? (
            <>
              <RouterLink
                to="/products/add"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-[#8B9686] border-b border-[#E4DED3]"
              >
                + Add New Product
              </RouterLink>
              <div className="py-2 text-[#5F5A52] flex justify-between items-center border-b border-[#E4DED3]">
                <span>Logged in as {user?.email}</span>
                <button onClick={handleLogout} className="text-[#24221F] font-semibold underline">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <RouterLink
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-[#24221F] border-b border-[#E4DED3]"
              >
                Sign In
              </RouterLink>
              <RouterLink
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-[#24221F] border-b border-[#E4DED3]"
              >
                Create Account
              </RouterLink>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
