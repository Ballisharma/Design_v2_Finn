import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Loader2, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { requestPasswordReset, resetPasswordWithToken } from '../utils/wordpress';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token');
  const resetKey = searchParams.get('key');
  const login = searchParams.get('login');

  // Step 1: Request reset (enter email)
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'request' | 'reset' | 'success'>(
    (resetToken && resetKey && login) ? 'reset' : 'request'
  );
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Step 2: Reset password (with token)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // If we have token and key in URL, we're on step 2
    if (resetToken && resetKey && login) {
      setStep('reset');
    }
  }, [resetToken, resetKey, login]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      await requestPasswordReset(email);
      setSuccessMessage('Password reset link sent! Please check your email and click the link to reset your password.');
      setEmail(''); // Clear email for security
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    return errors;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPasswordErrors({});

    // Validate passwords
    const passwordValidation = validatePassword(newPassword);
    if (passwordValidation.length > 0) {
      setPasswordErrors({ password: passwordValidation[0] });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    if (!resetToken || !resetKey || !login) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPasswordWithToken(login, resetKey, newPassword);
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. The link may have expired. Please request a new one.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Request Password Reset
  if (step === 'request') {
    return (
      <div className="min-h-screen bg-funky-light flex items-center justify-center px-6 py-24 animate-fade-in">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-white relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-funky-yellow via-funky-pink to-funky-blue"></div>

          <div className="p-10">
            <div className="text-center mb-8">
              <h1 className="font-heading font-black text-4xl text-funky-dark mb-2">RESET PASSWORD</h1>
              <p className="text-gray-500 font-medium">Enter your email to receive a password reset link.</p>
            </div>

            <form onSubmit={handleRequestReset} className="space-y-6">
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

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="text-red-500" size={20} />
                    <p className="text-red-600 text-sm font-bold">{error}</p>
                  </div>
                </div>
              )}

              {successMessage && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={20} />
                    <p className="text-green-600 text-sm font-bold">{successMessage}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-funky-dark text-white py-4 rounded-xl font-heading font-black text-lg hover:bg-funky-pink transition-all flex items-center justify-center gap-2 shadow-lg hover:translate-y-[-2px] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <>SEND RESET LINK <ArrowRight size={20} /></>}
              </button>
            </form>

            <div className="mt-8 text-center border-t border-gray-100 pt-6">
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 text-gray-500 hover:text-funky-dark text-sm font-bold transition-colors"
              >
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Reset Password (with token)
  if (step === 'reset') {
    return (
      <div className="min-h-screen bg-funky-light flex items-center justify-center px-6 py-24 animate-fade-in">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-white relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-funky-yellow via-funky-pink to-funky-blue"></div>

          <div className="p-10">
            <div className="text-center mb-8">
              <h1 className="font-heading font-black text-4xl text-funky-dark mb-2">NEW PASSWORD</h1>
              <p className="text-gray-500 font-medium">Enter your new password below.</p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (passwordErrors.password) {
                        setPasswordErrors({ ...passwordErrors, password: '' });
                      }
                    }}
                    required
                    className={`w-full bg-funky-light border-2 ${passwordErrors.password ? 'border-red-300' : 'border-transparent focus:border-funky-blue'} rounded-xl pl-12 pr-4 py-4 font-bold text-funky-dark outline-none transition-colors`}
                    placeholder="••••••••"
                  />
                </div>
                {passwordErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{passwordErrors.password}</p>
                )}
                <p className="text-gray-400 text-xs mt-1">
                  Must be at least 8 characters with uppercase, lowercase, and number
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (passwordErrors.confirmPassword) {
                        setPasswordErrors({ ...passwordErrors, confirmPassword: '' });
                      }
                    }}
                    required
                    className={`w-full bg-funky-light border-2 ${passwordErrors.confirmPassword ? 'border-red-300' : 'border-transparent focus:border-funky-blue'} rounded-xl pl-12 pr-4 py-4 font-bold text-funky-dark outline-none transition-colors`}
                    placeholder="••••••••"
                  />
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword}</p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="text-red-500" size={20} />
                    <p className="text-red-600 text-sm font-bold">{error}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-funky-dark text-white py-4 rounded-xl font-heading font-black text-lg hover:bg-funky-pink transition-all flex items-center justify-center gap-2 shadow-lg hover:translate-y-[-2px] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <>RESET PASSWORD <ArrowRight size={20} /></>}
              </button>
            </form>

            <div className="mt-8 text-center border-t border-gray-100 pt-6">
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 text-gray-500 hover:text-funky-dark text-sm font-bold transition-colors"
              >
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Success
  return (
    <div className="min-h-screen bg-funky-light flex items-center justify-center px-6 py-24 animate-fade-in">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-white relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-funky-green via-funky-blue to-funky-pink"></div>

        <div className="p-10 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-500" size={48} />
            </div>
            <h1 className="font-heading font-black text-4xl text-funky-dark mb-2">PASSWORD RESET!</h1>
            <p className="text-gray-500 font-medium">Your password has been successfully reset.</p>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
            <p className="text-green-600 text-sm font-bold">
              You can now log in with your new password.
            </p>
          </div>

          <Link
            to="/login"
            className="w-full bg-funky-dark text-white py-4 rounded-xl font-heading font-black text-lg hover:bg-funky-pink transition-all flex items-center justify-center gap-2 shadow-lg hover:translate-y-[-2px] inline-block"
          >
            GO TO LOGIN <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

