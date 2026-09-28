import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, PlusCircle } from 'lucide-react';

const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
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
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        image: formData.image,
      });

      if (response.data.success) {
        navigate('/products');
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
          to="/products"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#5F5A52] hover:text-[#24221F] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Products</span>
        </Link>
      </div>

      <div className="bg-[#FFFFFF] border border-[#D5CEC1] p-8 md:p-10 rounded-[2px] shadow-sm">
        <div className="mb-8 border-b border-[#D5CEC1]/50 pb-4">
          <h2 className="font-serif text-3xl font-medium text-[#24221F]">Add New Product</h2>
          <p className="text-xs text-[#5F5A52] tracking-wider uppercase mt-1">
            Create a new item in the AURA catalog
          </p>
        </div>

        {generalError && (
          <div className="mb-6 p-3 bg-[#EFE9DF] border-l-2 border-[#24221F] text-xs text-[#24221F]">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#24221F] mb-1.5 font-sans">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Cashmere Ribbed Knitwear Sweater"
              className={`w-full bg-[#F7F3ED] border ${
                fieldErrors.name ? 'border-red-500' : 'border-[#D5CEC1]'
              } px-3.5 py-2.5 text-xs text-[#24221F] placeholder-[#8A8176] focus:outline-none focus:border-[#24221F] rounded-[2px] transition-colors`}
            />
            {fieldErrors.name && (
              <p className="text-[11px] text-red-600 mt-1">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#24221F] mb-1.5 font-sans">
              Description *
            </label>
            <textarea
              name="description"
              rows={3}
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of materials, fit, and craftsmanship..."
              className={`w-full bg-[#F7F3ED] border ${
                fieldErrors.description ? 'border-red-500' : 'border-[#D5CEC1]'
              } px-3.5 py-2.5 text-xs text-[#24221F] placeholder-[#8A8176] focus:outline-none focus:border-[#24221F] rounded-[2px] transition-colors`}
            />
            {fieldErrors.description && (
              <p className="text-[11px] text-red-600 mt-1">{fieldErrors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#24221F] mb-1.5 font-sans">
                Price ($) *
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                min="0"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="120"
                className={`w-full bg-[#F7F3ED] border ${
                  fieldErrors.price ? 'border-red-500' : 'border-[#D5CEC1]'
                } px-3.5 py-2.5 text-xs text-[#24221F] placeholder-[#8A8176] focus:outline-none focus:border-[#24221F] rounded-[2px] transition-colors`}
              />
              {fieldErrors.price && (
                <p className="text-[11px] text-red-600 mt-1">{fieldErrors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#24221F] mb-1.5 font-sans">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                min="0"
                required
                value={formData.stock}
                onChange={handleChange}
                placeholder="10"
                className={`w-full bg-[#F7F3ED] border ${
                  fieldErrors.stock ? 'border-red-500' : 'border-[#D5CEC1]'
                } px-3.5 py-2.5 text-xs text-[#24221F] placeholder-[#8A8176] focus:outline-none focus:border-[#24221F] rounded-[2px] transition-colors`}
              />
              {fieldErrors.stock && (
                <p className="text-[11px] text-red-600 mt-1">{fieldErrors.stock}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#24221F] mb-1.5 font-sans">
              Image URL *
            </label>
            <input
              type="text"
              name="image"
              required
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/photo-..."
              className={`w-full bg-[#F7F3ED] border ${
                fieldErrors.image ? 'border-red-500' : 'border-[#D5CEC1]'
              } px-3.5 py-2.5 text-xs text-[#24221F] placeholder-[#8A8176] focus:outline-none focus:border-[#24221F] rounded-[2px] transition-colors`}
            />
            {fieldErrors.image && (
              <p className="text-[11px] text-red-600 mt-1">{fieldErrors.image}</p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#8B9686] hover:bg-[#24221F] text-white py-3 px-4 text-xs tracking-widest uppercase rounded-[2px] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {submitting ? (
                <span>Creating Product...</span>
              ) : (
                <>
                  <PlusCircle size={14} />
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
