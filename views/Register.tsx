import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';

const Register: React.FC = () => {
  const { register, isLoading } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.password || formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      await register(formData.email, formData.password, formData.firstName, formData.lastName);
      navigate('/account');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error for this field when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-funky-light flex items-center justify-center px-6 py-24 animate-fade-in">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-white relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-funky-yellow via-funky-pink to-funky-blue"></div>

        <div className="p-10">
          <div className="text-center mb-8">
            <h1 className="font-heading font-black text-4xl text-funky-dark mb-2">JOIN JUMPLINGS</h1>
            <p className="text-gray-500 font-medium">Create your account and start shopping funky socks!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">First Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className={`w-full bg-funky-light border-2 ${validationErrors.firstName ? 'border-red-300' : 'border-transparent focus:border-funky-blue'} rounded-xl pl-10 pr-4 py-3 font-bold text-funky-dark outline-none transition-colors text-sm`}
                    placeholder="John"
                  />
                </div>
                {validationErrors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Last Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className={`w-full bg-funky-light border-2 ${validationErrors.lastName ? 'border-red-300' : 'border-transparent focus:border-funky-blue'} rounded-xl pl-10 pr-4 py-3 font-bold text-funky-dark outline-none transition-colors text-sm`}
                    placeholder="Doe"
                  />
                </div>
                {validationErrors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full bg-funky-light border-2 ${validationErrors.email ? 'border-red-300' : 'border-transparent focus:border-funky-blue'} rounded-xl pl-12 pr-4 py-4 font-bold text-funky-dark outline-none transition-colors`}
                  placeholder="you@example.com"
                />
              </div>
              {validationErrors.email && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`w-full bg-funky-light border-2 ${validationErrors.password ? 'border-red-300' : 'border-transparent focus:border-funky-blue'} rounded-xl pl-12 pr-4 py-4 font-bold text-funky-dark outline-none transition-colors`}
                  placeholder="••••••••"
                />
              </div>
              {validationErrors.password && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
              )}
              <p className="text-gray-400 text-xs mt-1">Must be at least 8 characters</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`w-full bg-funky-light border-2 ${validationErrors.confirmPassword ? 'border-red-300' : 'border-transparent focus:border-funky-blue'} rounded-xl pl-12 pr-4 py-4 font-bold text-funky-dark outline-none transition-colors`}
                  placeholder="••••••••"
                />
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.confirmPassword}</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm font-bold text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-funky-dark text-white py-4 rounded-xl font-heading font-black text-lg hover:bg-funky-pink transition-all flex items-center justify-center gap-2 shadow-lg hover:translate-y-[-2px] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <>CREATE ACCOUNT <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-funky-pink font-bold hover:underline">
                Sign In
              </Link>
            </p>
            <Link 
              to="/" 
              className="mt-4 inline-flex items-center gap-2 text-gray-500 hover:text-funky-dark text-sm font-bold transition-colors"
            >
              <ArrowLeft size={16} /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

