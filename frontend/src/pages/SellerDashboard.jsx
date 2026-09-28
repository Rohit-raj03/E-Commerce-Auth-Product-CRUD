import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Package,
  PlusCircle,
  Edit,
  Trash2,
  AlertTriangle,
  Boxes,
  TrendingUp,
  Search,
  ExternalLink,
} from 'lucide-react';

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Stats calculation
  const totalProducts = products.length;
  const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const inventoryValue = products.reduce((acc, p) => acc + (p.price || 0) * (p.stock || 0), 0);
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#D5CEC1] gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full">
              Merchant Panel
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#24221F] mt-1.5">Seller Dashboard</h1>
          <p className="text-xs text-[#5F5A52] tracking-wider uppercase mt-0.5">
            Monitor inventory, list new items & manage products
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/products"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors"
          >
            <span>View Public Store</span>
            <ExternalLink size={14} />
          </Link>
          <Link
            to="/seller/products/add"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors shadow-sm"
          >
            <PlusCircle size={15} strokeWidth={2} />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
        <div className="bg-white border border-[#D5CEC1] p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Total Listings</p>
            <div className="p-2 bg-stone-100 text-stone-700 rounded-xl">
              <Package size={20} />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-[#24221F] mt-2">{totalProducts}</p>
          <p className="text-[11px] text-stone-400 mt-1">Active products in your store</p>
        </div>

        <div className="bg-white border border-[#D5CEC1] p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Total Units Stock</p>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <Boxes size={20} />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-[#24221F] mt-2">{totalStock}</p>
          <p className="text-[11px] text-stone-400 mt-1">Total physical stock inventory</p>
        </div>

        <div className="bg-white border border-[#D5CEC1] p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Inventory Value</p>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-emerald-800 mt-2">
            ₹{inventoryValue.toLocaleString()}
          </p>
          <p className="text-[11px] text-stone-400 mt-1">Estimated asset valuation</p>
        </div>

        <div className="bg-white border border-[#D5CEC1] p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Stock Alerts</p>
            <div className={`p-2 rounded-xl ${lowStockCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-500'}`}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <p className={`font-serif text-3xl font-bold mt-2 ${lowStockCount > 0 ? 'text-amber-800' : 'text-stone-700'}`}>
            {lowStockCount}
          </p>
          <p className="text-[11px] text-stone-400 mt-1">Items with 5 or fewer units</p>
        </div>
      </div>

      {/* Product Management Section */}
      <div className="bg-white border border-[#D5CEC1] rounded-2xl shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-5 border-b border-[#D5CEC1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your products by name or category..."
              className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#D5CEC1] rounded-xl text-xs text-[#24221F] focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="text-xs font-medium text-[#5F5A52]">
            Showing <strong className="text-black">{filteredProducts.length}</strong> of {totalProducts} products
          </div>
        </div>

        {/* Product Table */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs uppercase tracking-wider text-stone-500 mt-3">Loading your products...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-xs text-rose-600 font-medium">
            {error}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center">
            <Package size={36} className="mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-semibold text-stone-700">No products found</p>
            <p className="text-xs text-stone-400 mt-1 mb-4">
              {searchTerm ? 'Try changing your search keywords' : 'Get started by listing your first product'}
            </p>
            <Link
              to="/seller/products/add"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-emerald-800 transition-colors"
            >
              <PlusCircle size={14} />
              <span>Add Product</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#D5CEC1] text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D5CEC1]/50 text-stone-700 font-sans">
                {filteredProducts.map((p) => {
                  const pid = p._id || p.id;
                  const isLow = p.stock <= 5;
                  const isOut = p.stock === 0;

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
                          <p className="text-[11px] text-stone-400 line-clamp-1 max-w-xs">{p.description}</p>
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
                          {isOut ? 'Out of Stock' : `${p.stock} units`}
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

export default SellerDashboard;
