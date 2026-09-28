import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Lock, Mail } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Role-based redirection: Seller -> /seller/dashboard, User -> /products
      const userRole = result.user?.role || 'user';
      const defaultPath = userRole === 'seller' ? '/seller/dashboard' : '/products';
      const redirectPath = location.state?.from?.pathname || defaultPath;
      navigate(redirectPath, { replace: true });
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
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#FFFFFF] border border-[#D5CEC1] p-8 md:p-10 rounded-xl shadow-sm">
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl font-semibold tracking-wide text-[#24221F]">
            Sign In
          </h2>
          <p className="text-xs text-[#5F5A52] tracking-wider uppercase mt-2">
            Access your Customer or Seller Account
          </p>
        </div>

        {generalError && (
          <div className="mb-6 p-3.5 bg-rose-50 border-l-4 border-rose-600 rounded-r text-xs text-rose-800 font-medium">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#24221F] mb-1 font-medium">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full pl-9 pr-3.5 py-2.5 bg-[#FAF8F5] border text-sm text-[#24221F] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#24221F] ${
                  fieldErrors.email ? 'border-rose-500' : 'border-[#D5CEC1]'
                }`}
                required
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1 text-[11px] text-rose-600">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#24221F] mb-1 font-medium">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Lock size={16} />
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-9 pr-3.5 py-2.5 bg-[#FAF8F5] border text-sm text-[#24221F] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#24221F] ${
                  fieldErrors.password ? 'border-rose-500' : 'border-[#D5CEC1]'
                }`}
                required
              />
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-[11px] text-rose-600">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full mt-4 flex items-center justify-center space-x-2 py-3 px-4 text-xs tracking-widest uppercase font-semibold text-white bg-[#24221F] hover:bg-black transition-all rounded-lg shadow-sm ${
              submitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <span>{submitting ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#D5CEC1]/60 text-center">
          <p className="text-xs text-[#5F5A52]">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-[#24221F] hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
