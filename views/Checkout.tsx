import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useUser } from '../context/UserContext';
import { ArrowLeft, CreditCard, Truck, ShieldCheck, CheckCircle2, AlertCircle, Lock, Users, TrendingUp, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createWooOrder, updateWooOrder, RAZORPAY_KEY_ID } from '../utils/wordpress';
import {
  INDIAN_STATES,
  validatePincode,
  validatePhone,
  validateEmail,
  fetchPincodeDetails
} from '../utils/indianAddressValidation';

const Checkout: React.FC = () => {
  const { items, subtotal, shippingCost, cartTotal, clearCart } = useCart();
  const { products, updateProduct, dataSource, refreshProducts } = useProducts();
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-fill from user context
  const [customer, setCustomer] = useState({
    email: user?.email || '',
    phone: user?.billing?.phone || '',
    firstName: user?.first_name || user?.billing?.first_name || '',
    lastName: user?.last_name || user?.billing?.last_name || '',
    address: user?.billing?.address_1 || '',
    city: user?.billing?.city || '',
    pincode: user?.billing?.postcode || '',
    state: (user?.billing as any)?.state || ''
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPinLoading, setIsPinLoading] = useState(false);
  const [viewerCount] = useState(Math.floor(Math.random() * 15) + 10); // 10-25 viewers

  // Update form when user changes
  useEffect(() => {
    if (user?.billing) {
      setCustomer({
        email: user.email || '',
        phone: user.billing.phone || '',
        firstName: user.first_name || user.billing.first_name || '',
        lastName: user.last_name || user.billing.last_name || '',
        address: user.billing.address_1 || '',
        city: user.billing.city || '',
        pincode: user.billing.postcode || '',
        state: (user.billing as any).state || ''
      });
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center flex-col gap-6 animate-fade-in">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
          <Package size={48} className="text-gray-400" />
        </div>
        <h2 className="text-3xl font-black text-gray-900">Your cart is empty</h2>
        <Link to="/" className="px-8 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg">
          Start Shopping
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'email':
        return !validateEmail(value) ? 'Please enter a valid email address' : '';
      case 'phone':
        return !validatePhone(value) ? 'Enter valid 10-digit mobile number' : '';
      case 'pincode':
        return !validatePincode(value) ? 'Enter valid 6-digit PIN code' : '';
      case 'firstName':
      case 'lastName':
      case 'address':
      case 'state':
        return !value.trim() ? 'This field is required' : '';
      default:
        return '';
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const pin = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCustomer(prev => ({ ...prev, pincode: pin }));

    if (errors.pincode) {
      setErrors(prev => ({ ...prev, pincode: '' }));
    }

    if (validatePincode(pin)) {
      setIsPinLoading(true);
      const details = await fetchPincodeDetails(pin);
      setIsPinLoading(false);

      if (details) {
        setCustomer(prev => ({
          ...prev,
          city: details.city,
          state: details.state
        }));
        setErrors(prev => ({ ...prev, city: '', state: '' }));
      }
    }
  };

  // Pre-load Razorpay SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    }
  }, []);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(customer).forEach(key => {
      const error = validateField(key, customer[key as keyof typeof customer]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorField = Object.keys(newErrors)[0];
      document.getElementsByName(firstErrorField)[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsProcessing(true);

    try {
      if (dataSource === 'wordpress') {
        const order = await createWooOrder(customer, items, cartTotal, 'razorpay', user?.id, shippingCost);

        if (!RAZORPAY_KEY_ID) {
          throw new Error("Razorpay Key ID is missing.");
        }

        const options: any = {
          key: RAZORPAY_KEY_ID,
          amount: Math.round(cartTotal * 100),
          currency: 'INR',
          name: 'Jumplings',
          description: `Order #${order.id}`,
          prefill: {
            name: `${customer.firstName} ${customer.lastName}`,
            email: customer.email,
            contact: customer.phone,
          },
          theme: { color: '#14B8A6' },
          handler: async function (response: any) {
            try {
              await updateWooOrder(order.id, {
                status: 'processing',
                set_paid: true,
                transaction_id: response.razorpay_payment_id
              });

              refreshProducts();
              clearCart();

              if (user) {
                navigate('/account');
                alert("Payment Successful! 🎉");
              } else {
                navigate('/login');
                alert("Payment Successful! Check your email to set a password.");
              }
            } catch (err: any) {
              console.error("Payment sync failed:", err);
              alert(`Payment received, but order update failed: ${err.message}`);
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            }
          }
        };

        if (RAZORPAY_KEY_ID.startsWith('rzp_live')) {
          options.image = 'https://jumplings.in/wp-content/uploads/2023/06/cropped-Jumplings-Logo-Small.png';
        }

        const rzpInstance = new (window as any).Razorpay(options);

        rzpInstance.on('payment.failed', function (response: any) {
          alert(`Payment Failed: ${response.error.description}`);
          setIsProcessing(false);
        });

        rzpInstance.open();
      } else {
        setTimeout(() => {
          clearCart();
          setIsProcessing(false);
          alert("Order Processed (Test Mode) 🎉");
          navigate('/');
        }, 1500);
      }
    } catch (error: any) {
      console.error("Checkout failed:", error);
      alert(`Checkout Failed: ${error.message || "Something went wrong."}`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-gray-900 mb-6 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to Shop
          </Link>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <Lock size={24} className="text-teal-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900">Secure Checkout</h1>
                <p className="text-sm text-gray-500">256-bit SSL encrypted</p>
              </div>
            </div>

            {/* Live indicators */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-sm border border-gray-100">
                <Users size={14} className="text-teal-600" />
                <span className="font-medium">{viewerCount} viewing</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-sm border border-gray-100">
                <TrendingUp size={14} className="text-orange-500" />
                <span className="font-medium">Fast checkout</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Left: Form */}
          <div className="lg:col-span-7 space-y-6">

            {/* Contact Info */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                  <span className="text-teal-600 font-black text-sm">1</span>
                </div>
                <h2 className="text-xl font-black text-gray-900">Contact Information</h2>
              </div>

              <form id="checkout-form" onSubmit={handlePayment} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-wider">Email Address</label>
                  <div className="relative">
                    <input
                      name="email"
                      value={customer.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      type="email"
                      placeholder="you@example.com"
                      className={`w-full bg-white border-2 ${errors.email ? 'border-red-300' : customer.email && validateEmail(customer.email) ? 'border-green-300' : 'border-gray-200'} focus:border-teal-500 focus:ring-4 focus:ring-teal-100 rounded-xl px-4 py-3 font-medium outline-none transition-all text-base`}
                    />
                    {!errors.email && customer.email && validateEmail(customer.email) && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={20} />
                    )}
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-wider">Phone Number</label>
                  <div className="relative">
                    <input
                      name="phone"
                      value={customer.phone}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      type="tel"
                      placeholder="98765 43210"
                      maxLength={10}
                      className={`w-full bg-white border-2 ${errors.phone ? 'border-red-300' : customer.phone && validatePhone(customer.phone) ? 'border-green-300' : 'border-gray-200'} focus:border-teal-500 focus:ring-4 focus:ring-teal-100 rounded-xl px-4 py-3 font-medium outline-none transition-all text-base`}
                    />
                    {!errors.phone && customer.phone && validatePhone(customer.phone) && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={20} />
                    )}
                  </div>
                  {errors.phone && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.phone}</p>}
                </div>
              </form>
            </section>

            {/* Shipping Address */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                  <span className="text-teal-600 font-black text-sm">2</span>
                </div>
                <h2 className="text-xl font-black text-gray-900">Shipping Address</h2>
              </div>

              <div className="space-y-4">
                {/* PIN Code */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-wider">PIN Code <span className="text-teal-500 normal-case font-medium">(auto-fills city & state)</span></label>
                  <div className="relative">
                    <input
                      name="pincode"
                      value={customer.pincode}
                      onChange={handlePincodeChange}
                      onBlur={handleBlur}
                      required
                      type="text"
                      placeholder="400001"
                      maxLength={6}
                      className={`w-full bg-white border-2 ${errors.pincode ? 'border-red-300' : customer.pincode && validatePincode(customer.pincode) ? 'border-green-300' : 'border-gray-200'} focus:border-teal-500 focus:ring-4 focus:ring-teal-100 rounded-xl px-4 py-3 font-medium outline-none transition-all text-base`}
                    />
                    {isPinLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-teal-600 border-t-transparent"></div>
                      </div>
                    )}
                    {!isPinLoading && !errors.pincode && customer.pincode && validatePincode(customer.pincode) && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={20} />
                    )}
                  </div>
                  {errors.pincode && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.pincode}</p>}
                  {!errors.pincode && <p className="text-[10px] text-gray-400 mt-1">6-digit Indian PIN code</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* City */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-wider">City <span className="text-gray-300 normal-case font-medium">(optional)</span></label>
                    <div className="relative">
                      <input
                        name="city"
                        value={customer.city}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Mumbai"
                        className="w-full bg-white border-2 border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 rounded-xl px-4 py-3 font-medium outline-none transition-all text-base"
                      />
                    </div>
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-wider">State</label>
                    <div className="relative">
                      <select
                        name="state"
                        value={customer.state}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        required
                        className={`w-full bg-white border-2 ${errors.state ? 'border-red-300' : customer.state ? 'border-green-300' : 'border-gray-200'} focus:border-teal-500 focus:ring-4 focus:ring-teal-100 rounded-xl px-4 py-3 font-medium outline-none transition-all text-base appearance-none pr-10`}
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {errors.state && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.state}</p>}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-wider">Street Address</label>
                  <input
                    name="address"
                    value={customer.address}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    type="text"
                    placeholder="123 Happy Feet Street"
                    className={`w-full bg-white border-2 ${errors.address ? 'border-red-300' : customer.address ? 'border-green-300' : 'border-gray-200'} focus:border-teal-500 focus:ring-4 focus:ring-teal-100 rounded-xl px-4 py-3 font-medium outline-none transition-all text-base`}
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-wider">First Name</label>
                    <input
                      name="firstName"
                      value={customer.firstName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      type="text"
                      placeholder="John"
                      className={`w-full bg-white border-2 ${errors.firstName ? 'border-red-300' : customer.firstName ? 'border-green-300' : 'border-gray-200'} focus:border-teal-500 focus:ring-4 focus:ring-teal-100 rounded-xl px-4 py-3 font-medium outline-none transition-all text-base`}
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-wider">Last Name</label>
                    <input
                      name="lastName"
                      value={customer.lastName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      type="text"
                      placeholder="Doe"
                      className={`w-full bg-white border-2 ${errors.lastName ? 'border-red-300' : customer.lastName ? 'border-green-300' : 'border-gray-200'} focus:border-teal-500 focus:ring-4 focus:ring-teal-100 rounded-xl px-4 py-3 font-medium outline-none transition-all text-base`}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Info */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="text-teal-600" size={24} />
                <h2 className="text-xl font-black text-gray-900">Secure Payment</h2>
              </div>

              <div className="bg-teal-50 rounded-xl p-6 border border-teal-100">
                <div className="flex items-start gap-4">
                  <ShieldCheck className="text-teal-600 flex-shrink-0 mt-1" size={32} />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Safe & Secure Checkout</h3>
                    <p className="text-sm text-gray-600 mb-4">Payments processed via Razorpay. UPI, Cards, NetBanking, and Wallets supported.</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-white px-3 py-1 rounded-lg text-xs font-bold text-gray-700 border border-teal-200">UPI</span>
                      <span className="bg-white px-3 py-1 rounded-lg text-xs font-bold text-gray-700 border border-teal-200">Cards</span>
                      <span className="bg-white px-3 py-1 rounded-lg text-xs font-bold text-gray-700 border border-teal-200">NetBanking</span>
                      <span className="bg-white px-3 py-1 rounded-lg text-xs font-bold text-gray-700 border border-teal-200">Wallets</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-black mb-6 pb-4 border-b border-gray-100">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map(item => (
                  <div key={item.cartId} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm leading-tight mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} · {item.selectedSize}</p>
                      <p className="font-bold text-sm mt-1">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-bold">{shippingCost === 0 ? <span className="text-green-600">FREE</span> : `₹${shippingCost}`}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="font-black text-lg">Total</span>
                  <span className="font-black text-2xl text-teal-600">₹{cartTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isProcessing}
                className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-xl font-black text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>
                    <Lock size={20} />
                    Pay ₹{cartTotal}
                  </>
                )}
              </button>

              {/* Trust signals */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span>Free shipping on all orders</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span>Secure 256-bit SSL encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 z-50 flex items-center gap-4 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
        <div className="flex-1">
          <span className="text-xs text-gray-500 block">Total</span>
          <span className="text-xl font-black text-teal-600">₹{cartTotal}</span>
        </div>
        <button
          onClick={() => (document.getElementById('checkout-form') as HTMLFormElement)?.requestSubmit()}
          disabled={isProcessing}
          className="bg-teal-600 text-white px-8 py-3 rounded-xl font-black shadow-lg active:scale-95 transition-all"
        >
          {isProcessing ? '...' : 'Pay Now'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;