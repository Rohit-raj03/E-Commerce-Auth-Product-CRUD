import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Package,
  PlusCircle,
  Edit,
  Trash2,
  Search,
  ArrowLeft,
  LayoutDashboard,
} from 'lucide-react';

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  const fetchSellerProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products/seller/my-products');
      if (res.data.success) {
        setProducts(res.data.products || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load seller products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await api.delete(`/products/${id}`);
      if (res.data.success) {
        setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Breadcrumb & Nav */}
      <div className="mb-4">
        <Link
          to="/seller/dashboard"
          className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-widest text-[#5F5A52] hover:text-[#24221F] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#D5CEC1] gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#24221F]">Product Management</h1>
          <p className="text-xs text-[#5F5A52] tracking-wider uppercase mt-1">
            Manage, update, and monitor your listed inventory items
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/seller/dashboard"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors"
          >
            <LayoutDashboard size={14} />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/seller/products/add"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors shadow-sm"
          >
            <PlusCircle size={15} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#D5CEC1] rounded-2xl p-4 my-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product title or description..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] border border-[#D5CEC1] rounded-xl text-xs text-[#24221F] focus:outline-none focus:border-stone-900"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 whitespace-nowrap">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Content */}
      <div className="bg-white border border-[#D5CEC1] rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs uppercase tracking-wider text-stone-500 mt-3">Loading product inventory...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-xs text-rose-600 font-medium">
            {error}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center">
            <Package size={36} className="mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-semibold text-stone-700">No products match your criteria</p>
            <p className="text-xs text-stone-400 mt-1 mb-4">Try clearing filters or add a new listing</p>
            <Link
              to="/seller/products/add"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-emerald-800 transition-colors"
            >
              <PlusCircle size={14} />
              <span>Add New Product</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#D5CEC1] text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Product Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Unit Price</th>
                  <th className="py-3.5 px-4">Stock Level</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D5CEC1]/50 text-stone-700 font-sans">
                {filteredProducts.map((p) => {
                  const pid = p._id || p.id;
                  const isOut = p.stock === 0;
                  const isLow = p.stock > 0 && p.stock <= 5;

                  return (
                    <tr key={pid} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 flex items-center space-x-3.5">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded-lg border border-stone-200 bg-stone-100 flex-shrink-0"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80';
                          }}
                        />
                        <div>
                          <p className="font-semibold text-stone-900 text-sm line-clamp-1">{p.name}</p>
                          <p className="text-[11px] text-stone-400 line-clamp-1 max-w-sm">{p.description}</p>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-stone-100 text-stone-700">
                          {p.category || 'General'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-stone-900">
                        ₹{p.price}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                            isOut
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : isLow
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isOut ? 'Out of Stock' : `${p.stock} in stock`}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="inline-flex items-center space-x-2">
                          <Link
                            to={`/seller/products/edit/${pid}`}
                            className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(pid, p.name)}
                            disabled={deletingId === pid}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProducts;
