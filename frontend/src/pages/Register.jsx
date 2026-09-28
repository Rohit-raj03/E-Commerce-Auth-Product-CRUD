import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, ShoppingBag, Store } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user', // default: 'user'
  });

  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (generalError) setGeneralError('');
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setGeneralError('');
    setFieldErrors({});

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.confirmPassword,
      formData.role
    );

    if (result.success) {
      setSuccessMessage(
        `Registered as ${formData.role === 'seller' ? 'Seller' : 'Customer'} successfully! Redirecting to login...`
      );
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else {
      setGeneralError(result.message);
      if (result.errors && result.errors.length > 0) {
        const errorObj = {};
        result.errors.forEach((err) => {
          errorObj[err.field] = err.message;
        });
        setFieldErrors(errorObj);
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-[#FFFFFF] border border-[#D5CEC1] p-8 md:p-10 rounded-xl shadow-sm">
        <div className="text-center mb-6">
          <h2 className="font-serif text-3xl font-semibold tracking-wide text-[#24221F]">
            Create an Account
          </h2>
          <p className="text-xs text-[#5F5A52] tracking-wider uppercase mt-2">
            Join the AURA Market Community
          </p>
        </div>

        {/* Account Role Selector Cards */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#24221F] mb-2">
            Select Your Account Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleRoleSelect('user')}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                formData.role === 'user'
                  ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20 shadow-sm'
                  : 'border-[#D5CEC1] hover:border-stone-400 bg-stone-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <ShoppingBag
                  size={20}
                  className={formData.role === 'user' ? 'text-amber-700' : 'text-stone-500'}
                />
                <span
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    formData.role === 'user'
                      ? 'border-amber-600 bg-amber-600'
                      : 'border-stone-400'
                  }`}
                >
                  {formData.role === 'user' && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#24221F]">Customer</p>
                <p className="text-[11px] text-[#5F5A52] leading-tight mt-0.5">
                  Browse products, manage cart & buy items
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('seller')}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                formData.role === 'seller'
                  ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-sm'
                  : 'border-[#D5CEC1] hover:border-stone-400 bg-stone-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Store
                  size={20}
                  className={formData.role === 'seller' ? 'text-emerald-700' : 'text-stone-500'}
                />
                <span
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    formData.role === 'seller'
                      ? 'border-emerald-600 bg-emerald-600'
                      : 'border-stone-400'
                  }`}
                >
                  {formData.role === 'seller' && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#24221F]">Seller / Merchant</p>
                <p className="text-[11px] text-[#5F5A52] leading-tight mt-0.5">
                  Add, edit, delete & manage product inventory
                </p>
              </div>
            </button>
          </div>
        </div>

        {successMessage && (
          <div className="mb-6 p-3.5 bg-emerald-50 border-l-4 border-emerald-600 rounded-r text-xs text-emerald-800 font-medium">
            {successMessage}
          </div>
        )}

        {generalError && (
          <div className="mb-6 p-3.5 bg-rose-50 border-l-4 border-rose-600 rounded-r text-xs text-rose-800 font-medium">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#24221F] mb-1 font-medium">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className={`w-full px-3.5 py-2.5 bg-[#FAF8F5] border text-sm text-[#24221F] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#24221F] ${
                fieldErrors.name ? 'border-rose-500' : 'border-[#D5CEC1]'
              }`}
              required
            />
            {fieldErrors.name && (
              <p className="mt-1 text-[11px] text-rose-600">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#24221F] mb-1 font-medium">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full px-3.5 py-2.5 bg-[#FAF8F5] border text-sm text-[#24221F] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#24221F] ${
                fieldErrors.email ? 'border-rose-500' : 'border-[#D5CEC1]'
              }`}
              required
            />
            {fieldErrors.email && (
              <p className="mt-1 text-[11px] text-rose-600">{fieldErrors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#24221F] mb-1 font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 chars"
                className={`w-full px-3.5 py-2.5 bg-[#FAF8F5] border text-sm text-[#24221F] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#24221F] ${
                  fieldErrors.password ? 'border-rose-500' : 'border-[#D5CEC1]'
                }`}
                required
              />
              {fieldErrors.password && (
                <p className="mt-1 text-[11px] text-rose-600">{fieldErrors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#24221F] mb-1 font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className={`w-full px-3.5 py-2.5 bg-[#FAF8F5] border text-sm text-[#24221F] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#24221F] ${
                  fieldErrors.confirmPassword ? 'border-rose-500' : 'border-[#D5CEC1]'
                }`}
                required
              />
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-[11px] text-rose-600">{fieldErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full mt-4 flex items-center justify-center space-x-2 py-3 px-4 text-xs tracking-widest uppercase font-semibold text-white transition-all rounded-lg shadow-sm ${
              formData.role === 'seller'
                ? 'bg-emerald-700 hover:bg-emerald-800'
                : 'bg-[#24221F] hover:bg-black'
            } ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <span>
              {submitting
                ? 'Creating Account...'
                : `Register as ${formData.role === 'seller' ? 'Seller' : 'Customer'}`}
            </span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#D5CEC1]/60 text-center">
          <p className="text-xs text-[#5F5A52]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-[#24221F] hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
