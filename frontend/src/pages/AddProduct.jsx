import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, PlusCircle } from 'lucide-react';

const CATEGORIES = [
  'Clothing',
  'Footwear',
  'Accessories',
  'Electronics',
  'Home & Living',
  'General',
];

const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Clothing',
    price: '',
    stock: '',
    image: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (generalError) setGeneralError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setGeneralError('');
    setFieldErrors({});

    try {
      const response = await api.post('/products', {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        image: formData.image.trim(),
      });

      if (response.data.success) {
        navigate('/seller/dashboard');
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'Failed to create product. Please try again.';
      setGeneralError(errorMsg);

      if (error.response?.data?.errors) {
        const errorObj = {};
        error.response.data.errors.forEach((err) => {
          errorObj[err.field] = err.message;
        });
        setFieldErrors(errorObj);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-6">
        <Link
          to="/seller/dashboard"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#5F5A52] hover:text-[#24221F] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Seller Dashboard</span>
        </Link>
      </div>

      <div className="bg-[#FFFFFF] border border-[#D5CEC1] p-8 md:p-10 rounded-2xl shadow-sm">
        <div className="mb-8 border-b border-[#D5CEC1]/50 pb-4">
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded-full">
              Seller Portal
            </span>
          </div>
          <h2 className="font-serif text-3xl font-medium text-[#24221F]">Add New Product</h2>
          <p className="text-xs text-[#5F5A52] tracking-wider uppercase mt-1">
            List a new product for buyers to discover
          </p>
        </div>

        {generalError && (
          <div className="mb-6 p-3 bg-rose-50 border-l-2 border-rose-600 text-xs text-rose-800 rounded">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#24221F] mb-1.5 font-sans font-semibold">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Cashmere Ribbed Knitwear Sweater"
              className={`w-full bg-[#FAF8F5] border ${
                fieldErrors.name ? 'border-rose-500' : 'border-[#D5CEC1]'
              } px-3.5 py-2.5 text-xs text-[#24221F] placeholder-[#8A8176] focus:outline-none focus:border-[#24221F] rounded-lg transition-colors`}
            />
            {fieldErrors.name && (
              <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#24221F] mb-1.5 font-sans font-semibold">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-[#FAF8F5] border border-[#D5CEC1] px-3.5 py-2.5 text-xs text-[#24221F] focus:outline-none focus:border-[#24221F] rounded-lg transition-colors cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#24221F] mb-1.5 font-sans font-semibold">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                min="0"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="499"
                className={`w-full bg-[#FAF8F5] border ${
                  fieldErrors.price ? 'border-rose-500' : 'border-[#D5CEC1]'
                } px-3.5 py-2.5 text-xs text-[#24221F] placeholder-[#8A8176] focus:outline-none focus:border-[#24221F] rounded-lg transition-colors`}
              />
              {fieldErrors.price && (
                <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.price}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#24221F] mb-1.5 font-sans font-semibold">
              Stock Quantity *
            </label>
            <input
              type="number"
              name="stock"
              min="0"
              required
              value={formData.stock}
              onChange={handleChange}
              placeholder="25"
              className={`w-full bg-[#FAF8F5] border ${
                fieldErrors.stock ? 'border-rose-500' : 'border-[#D5CEC1]'
              } px-3.5 py-2.5 text-xs text-[#24221F] placeholder-[#8A8176] focus:outline-none focus:border-[#24221F] rounded-lg transition-colors`}
            />
            {fieldErrors.stock && (
              <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.stock}</p>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#24221F] mb-1.5 font-sans font-semibold">
              Description *
            </label>
            <textarea
              name="description"
              rows={3}
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of materials, fit, dimensions, and craftsmanship..."
              className={`w-full bg-[#FAF8F5] border ${
                fieldErrors.description ? 'border-rose-500' : 'border-[#D5CEC1]'
              } px-3.5 py-2.5 text-xs text-[#24221F] placeholder-[#8A8176] focus:outline-none focus:border-[#24221F] rounded-lg transition-colors`}
            />
            {fieldErrors.description && (
              <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#24221F] mb-1.5 font-sans font-semibold">
              Image URL *
            </label>
            <input
              type="url"
              name="image"
              required
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/photo-..."
              className={`w-full bg-[#FAF8F5] border ${
                fieldErrors.image ? 'border-rose-500' : 'border-[#D5CEC1]'
              } px-3.5 py-2.5 text-xs text-[#24221F] placeholder-[#8A8176] focus:outline-none focus:border-[#24221F] rounded-lg transition-colors`}
            />
            {fieldErrors.image && (
              <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.image}</p>
            )}
            {formData.image && (
              <div className="mt-2 flex items-center space-x-3">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-lg border border-stone-200"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <span className="text-[11px] text-stone-500">Image preview</span>
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white py-3 px-4 text-xs tracking-widest uppercase rounded-xl transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 font-semibold shadow-sm"
            >
              {submitting ? (
                <span>Publishing Product...</span>
              ) : (
                <>
                  <PlusCircle size={15} />
                  <span>Publish Product</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
