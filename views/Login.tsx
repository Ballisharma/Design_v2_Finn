import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { requestPasswordReset } from '../utils/wordpress';

const Login: React.FC = () => {
  const { login, isLoading } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/account');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-funky-light flex items-center justify-center px-6 py-24 animate-fade-in">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-white relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-funky-yellow via-funky-pink to-funky-blue"></div>

        <div className="p-10">
          <div className="text-center mb-8">
            <h1 className="font-heading font-black text-4xl text-funky-dark mb-2">WELCOME BACK</h1>
            <p className="text-gray-500 font-medium">Login to view your sock stash.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-funky-light border-2 border-transparent focus:border-funky-blue rounded-xl pl-12 pr-4 py-4 font-bold text-funky-dark outline-none transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-funky-light border-2 border-transparent focus:border-funky-blue rounded-xl pl-12 pr-4 py-4 font-bold text-funky-dark outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm font-bold text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-funky-dark text-white py-4 rounded-xl font-heading font-black text-lg hover:bg-funky-pink transition-all flex items-center justify-center gap-2 shadow-lg hover:translate-y-[-2px] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <>LET'S GO <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <div className="bg-funky-light p-4 rounded-2xl text-left border-2 border-dashed border-gray-200 mb-4">
              <p className="text-xs font-bold text-funky-dark uppercase mb-1">Guest Order?</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Placed a guest order? An account was created for you! Check your email for a password setup link.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={async () => {
                  if (!email) {
                    setError('Please enter your email address first');
                    return;
                  }
                  setIsResettingPassword(true);
                  setResetMessage('');
                  setError('');
                  try {
                    await requestPasswordReset(email);
                    setResetMessage('Password reset link sent! Please check your email.');
                  } catch (err: any) {
                    setError(err.message || 'Failed to send password reset email. Please try again.');
                  } finally {
                    setIsResettingPassword(false);
                  }
                }}
                disabled={isResettingPassword}
                className="text-funky-blue font-black hover:text-funky-pink uppercase tracking-wide text-xs transition-colors disabled:opacity-50"
              >
                {isResettingPassword ? 'Sending...' : 'Forgot your password?'}
              </button>
              {resetMessage && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3">
                  <p className="text-green-600 text-xs font-bold text-center">{resetMessage}</p>
                </div>
              )}
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-funky-pink font-bold hover:underline">
                  Create Account
                </Link>
              </p>
              <Link 
                to="/" 
                className="mt-2 inline-flex items-center justify-center gap-2 text-gray-500 hover:text-funky-dark text-sm font-bold transition-colors"
              >
                <ArrowLeft size={16} /> Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;