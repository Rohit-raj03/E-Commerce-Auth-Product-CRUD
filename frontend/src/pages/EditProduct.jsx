import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Save } from 'lucide-react';

const CATEGORIES = [
  'Clothing',
  'Footwear',
  'Accessories',
  'Electronics',
  'Home & Living',
  'General',
];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Clothing',
    price: '',
    stock: '',
    image: '',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products/' + id);
        const product = response.data.product;
        if (product) {
          setFormData({
            name: product.name || '',
            description: product.description || '',
            category: product.category || 'General',
            price: product.price !== undefined ? product.price : '',
            stock: product.stock !== undefined ? product.stock : '',
            image: product.image || '',
          });
        }
      } catch (error) {
        setGeneralError(
          error.response?.data?.message || 'Failed to fetch product details or product does not exist.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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
      const response = await api.put('/products/' + id, {
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
        error.response?.data?.message || 'Failed to update product. Please try again.';
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-xs tracking-widest text-[#5F5A52] uppercase">Loading product details...</p>
      </div>
    );
  }

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
          <h2 className="font-serif text-3xl font-medium text-[#24221F]">Edit Product</h2>
          <p className="text-xs text-[#5F5A52] tracking-wider uppercase mt-1">
            Modify product information, pricing, or stock units
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
                <span>Saving Changes...</span>
              ) : (
                <>
                  <Save size={15} />
                  <span>Update Product</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
