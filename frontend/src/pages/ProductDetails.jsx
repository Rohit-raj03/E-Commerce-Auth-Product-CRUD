import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Edit,
  Trash2,
} from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSeller, user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${id}`);
      if (res.data.success && res.data.product) {
        setProduct(res.data.product);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    await addToCart(product, quantity);
    setAdding(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete product "${product.name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      navigate('/seller/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-stone-800 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs uppercase tracking-wider text-stone-500 mt-3 font-sans">
          Loading product...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">Product Not Found</h2>
        <p className="text-xs text-stone-500 mb-6">{error || 'The requested product is unavailable.'}</p>
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider"
        >
          <ArrowLeft size={14} />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isOwnerSeller = isSeller && product.sellerId?._id === user?.id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/products"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-500 hover:text-black uppercase tracking-wider mb-8 transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Back to Catalog</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Product Image */}
        <div className="bg-white border border-[#D5CEC1] p-4 rounded-3xl shadow-sm overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 sm:h-[480px] object-cover rounded-2xl bg-stone-100"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80';
            }}
          />
        </div>

        {/* Product Details & Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 rounded-full">
                {product.category || 'General'}
              </span>

              <span
                className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full ${
                  isOutOfStock
                    ? 'bg-rose-100 text-rose-800'
                    : product.stock <= 5
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {isOutOfStock ? 'Out of Stock' : `${product.stock} Units In Stock`}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#24221F] leading-tight">
              {product.name}
            </h1>

            <p className="font-serif text-3xl font-bold text-[#24221F] mt-3">
              ₹{product.price}
            </p>
          </div>

          <div className="border-t border-b border-[#D5CEC1]/70 py-4">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-400 mb-2">
              Description
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed font-sans">
              {product.description}
            </p>
          </div>

          {/* User Quantity & Add to Cart Controls */}
          {!isSeller && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-4">
                <span className="text-xs uppercase tracking-wider font-bold text-stone-700">
                  Select Quantity:
                </span>
                <div className="flex items-center border border-[#D5CEC1] rounded-xl bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-2 text-stone-600 hover:text-black disabled:opacity-40"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-stone-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="p-2 text-stone-600 hover:text-black disabled:opacity-40"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <span className="text-xs text-stone-500 font-medium">
                  Subtotal: <strong className="text-black font-bold">₹{(product.price * quantity).toLocaleString()}</strong>
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || adding}
                className={`w-full py-4 px-6 flex items-center justify-center space-x-2 text-xs uppercase tracking-widest font-semibold text-white rounded-xl shadow-md transition-all ${
                  isOutOfStock
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    : 'bg-[#24221F] hover:bg-black active:scale-[0.99]'
                }`}
              >
                <ShoppingBag size={16} />
                <span>{isOutOfStock ? 'Sold Out' : adding ? 'Adding to Bag...' : 'Add to Cart'}</span>
              </button>
            </div>
          )}

          {/* Seller-Specific Controls */}
          {isSeller && (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                🏪 Merchant Management Options
              </p>
              <div className="flex items-center space-x-3">
                <Link
                  to={`/seller/products/edit/${product._id || product.id}`}
                  className="flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors"
                >
                  <Edit size={14} />
                  <span>Edit Product</span>
                </Link>
                <button
                  onClick={handleDelete}
                  className="py-2.5 px-4 bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 transition-colors"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          )}

          {/* Perks Bar */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#D5CEC1]/50 text-center text-[11px] text-stone-600 font-sans">
            <div className="p-2.5 bg-stone-50 rounded-xl">
              <Truck size={18} className="mx-auto text-stone-500 mb-1" />
              <span>Fast Delivery</span>
            </div>
            <div className="p-2.5 bg-stone-50 rounded-xl">
              <RotateCcw size={18} className="mx-auto text-stone-500 mb-1" />
              <span>Easy 30-Day Returns</span>
            </div>
            <div className="p-2.5 bg-stone-50 rounded-xl">
              <ShieldCheck size={18} className="mx-auto text-stone-500 mb-1" />
              <span>100% Authentic</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
