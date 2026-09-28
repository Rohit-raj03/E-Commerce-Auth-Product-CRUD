import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  PlusCircle,
  Edit2,
  Trash2,
  Search,
  SlidersHorizontal,
  ArrowRight,
  Eye,
} from 'lucide-react';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Footwear', 'Accessories', 'Home & Living'];

const Products = () => {
  const { isAuthenticated, isSeller, user } = useAuth();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [addingId, setAddingId] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      if (res.data.success) {
        setProducts(res.data.products || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    const pid = product._id || product.id;
    setAddingId(pid);
    await addToCart(product, 1);
    setAddingId(null);
  };

  const handleDeleteProduct = async (id, name, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Seller Notification Banner */}
      {isSeller && (
        <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="p-2 bg-emerald-600 text-white rounded-xl">🏪</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                You are logged in as a Merchant (Seller)
              </p>
              <p className="text-xs text-emerald-700">
                You can manage your products, edit prices & stock from the Seller Dashboard.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              to="/seller/dashboard"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors"
            >
              Seller Dashboard
            </Link>
            <Link
              to="/seller/products/add"
              className="px-4 py-2 bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-100 text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors"
            >
              + Add Product
            </Link>
          </div>
        </div>
      )}

      {/* Catalog Hero Banner */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8B9686]">
          Curated Catalog
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#24221F] mt-1.5">
          Explore Our Collection
        </h1>
        <p className="text-xs sm:text-sm text-[#5F5A52] mt-2">
          Discover handpicked lifestyle, tech, and artisanal essentials with real-time stock availability.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white border border-[#D5CEC1] p-4 rounded-2xl shadow-sm mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by title, keyword, or description..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#D5CEC1] rounded-xl text-xs sm:text-sm text-[#24221F] focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider mr-1 flex items-center space-x-1">
            <SlidersHorizontal size={13} />
            <span>Category:</span>
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#24221F] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center">
          <div className="w-9 h-9 border-2 border-[#24221F] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs uppercase tracking-widest text-[#5F5A52] mt-4 font-sans font-medium">
            Fetching catalog items...
          </p>
        </div>
      ) : error ? (
        <div className="max-w-md mx-auto p-6 bg-rose-50 border border-rose-200 text-center rounded-2xl text-xs text-rose-800">
          <p className="font-semibold">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-3 px-4 py-1.5 bg-rose-700 text-white rounded-lg uppercase tracking-wider text-[11px] font-bold"
          >
            Retry
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-white border border-[#D5CEC1] rounded-3xl p-10">
          <ShoppingBag size={40} className="mx-auto text-stone-300 mb-3" />
          <h3 className="font-serif text-xl font-bold text-stone-800">No Products Available</h3>
          <p className="text-xs text-stone-500 mt-1 mb-6">
            No products match your search query or selected category.
          </p>
          {isSeller && (
            <Link
              to="/seller/products/add"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-emerald-800"
            >
              <PlusCircle size={15} />
              <span>Add First Product</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const pid = product._id || product.id;
            const isOutOfStock = product.stock <= 0;
            const isLowStock = product.stock > 0 && product.stock <= 5;
            const isOwner = isSeller && product.sellerId?._id === user?.id;

            return (
              <div
                key={pid}
                className="group bg-white border border-[#D5CEC1] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Image Container with Badge */}
                <div className="relative aspect-square overflow-hidden bg-stone-100">
                  <Link to={`/products/${pid}`} className="block w-full h-full">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80';
                      }}
                    />
                  </Link>

                  {/* Stock Status Badge */}
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm backdrop-blur-md ${
                      isOutOfStock
                        ? 'bg-rose-600/90 text-white'
                        : isLowStock
                        ? 'bg-amber-500/90 text-white'
                        : 'bg-stone-900/80 text-white'
                    }`}
                  >
                    {isOutOfStock ? 'Out of Stock' : isLowStock ? `Only ${product.stock} Left` : `${product.stock} in stock`}
                  </span>

                  {/* Category Tag */}
                  {product.category && (
                    <span className="absolute bottom-3 left-3 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-white/90 text-stone-800 rounded-md backdrop-blur-sm shadow-sm">
                      {product.category}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <Link to={`/products/${pid}`}>
                      <h3 className="font-serif font-bold text-base text-[#24221F] group-hover:text-amber-800 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-[#5F5A52] mt-1 line-clamp-2 leading-relaxed font-sans">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#D5CEC1]/50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase text-stone-400 font-semibold block">Price</span>
                      <span className="font-serif text-xl font-bold text-[#24221F]">
                        ₹{product.price}
                      </span>
                    </div>

                    {/* ROLE-BASED ACTION CONTROLS: */}
                    {/* Normal Users & Guests: Show ONLY "Add to Cart" (NO CRUD BUTTONS) */}
                    {!isSeller ? (
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={isOutOfStock || addingId === pid}
                        className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-sm ${
                          isOutOfStock
                            ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                            : 'bg-[#24221F] hover:bg-black text-white active:scale-95'
                        }`}
                      >
                        <ShoppingBag size={14} />
                        <span>{isOutOfStock ? 'Sold Out' : addingId === pid ? 'Adding...' : 'Add'}</span>
                      </button>
                    ) : (
                      /* Sellers: Show Edit / Delete or Details */
                      <div className="flex items-center space-x-1">
                        <Link
                          to={`/seller/products/edit/${pid}`}
                          className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button
                          onClick={(e) => handleDeleteProduct(pid, product.name, e)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Products;
