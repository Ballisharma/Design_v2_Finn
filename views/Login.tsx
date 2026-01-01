import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const { login, isLoading } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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

          <div className="mt-8 text-center border-t border-gray-100 pt-6 space-y-6">
            <div className="bg-funky-light p-6 rounded-2xl text-left border-2 border-dashed border-gray-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-funky-pink text-white text-[10px] font-black px-2 py-1 rounded-bl-lg">PRO TIP</div>
              <p className="text-xs font-bold text-funky-dark uppercase mb-2">New to Jumplings?</p>
              <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
                Placed a guest order? We've already created an account for you! Check your email for a <b>"Set Password"</b> link to access your funky order history.
              </p>
              <Link to="/contact" className="text-[10px] font-black text-funky-blue hover:underline uppercase flex items-center gap-1">
                Still need help? Contact Us <ArrowRight size={10} />
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => alert("Please check your email for the 'Set Password' link, or use the WordPress default login at https://jumplings.in/my-account/lost-password/")}
                className="text-funky-blue font-black hover:text-funky-pink uppercase tracking-wide text-xs transition-colors"
              >
                Forgot your password?
              </button>
              <p className="text-gray-400 text-sm">Don't have an account? <Link to="/shop" className="text-funky-pink font-bold hover:underline">Start Shopping</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;