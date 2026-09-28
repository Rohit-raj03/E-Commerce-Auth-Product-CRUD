import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight } from 'lucide-react';

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

  const from = location.state?.from?.pathname || '/products';

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
      navigate(from, { replace: true });
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
      <div className="w-full max-w-md bg-[#FFFFFF] border border-[#D5CEC1] p-8 md:p-10 rounded-[2px] shadow-sm">
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl font-medium tracking-wide text-[#24221F]">
            Welcome Back
          </h2>
          <p className="text-xs text-[#5F5A52] tracking-wider uppercase mt-2">
            Sign in to your AURA account
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
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="rohit@example.com"
              className={`w-full bg-[#F7F3ED] border ${
                fieldErrors.email ? 'border-red-500' : 'border-[#D5CEC1]'
              } px-3.5 py-2.5 text-xs text-[#24221F] placeholder-[#8A8176] focus:outline-none focus:border-[#24221F] rounded-[2px] transition-colors`}
            />
            {fieldErrors.email && (
              <p className="text-[11px] text-red-600 mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#24221F] mb-1.5 font-sans">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full bg-[#F7F3ED] border ${
                fieldErrors.password ? 'border-red-500' : 'border-[#D5CEC1]'
              } px-3.5 py-2.5 text-xs text-[#24221F] placeholder-[#8A8176] focus:outline-none focus:border-[#24221F] rounded-[2px] transition-colors`}
            />
            {fieldErrors.password && (
              <p className="text-[11px] text-red-600 mt-1">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#8B9686] hover:bg-[#24221F] text-white py-3 px-4 text-xs tracking-widest uppercase rounded-[2px] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {submitting ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-[#D5CEC1]/50 text-xs text-[#5F5A52]">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-[#24221F] font-semibold underline hover:opacity-75 transition-opacity"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
