import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useUser } from '../context/UserContext';
import { ArrowLeft, CreditCard, Truck, ShieldCheck, Gift } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createWooOrder, updateWooOrder, RAZORPAY_KEY_ID } from '../utils/wordpress';

const Checkout: React.FC = () => {
  const { items, subtotal, shippingCost, cartTotal, clearCart } = useCart();
  const { products, updateProduct, dataSource, refreshProducts } = useProducts();
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const paymentMethod = 'razorpay'; // Forced online payment for faster checkout

  // Auto-fill from user context if available
  const [customer, setCustomer] = useState({
    email: user?.email || '',
    phone: user?.billing?.phone || '',
    firstName: user?.first_name || user?.billing?.first_name || '',
    lastName: user?.last_name || user?.billing?.last_name || '',
    address: user?.billing?.address_1 || '',
    city: user?.billing?.city || '',
    pincode: user?.billing?.postcode || '',
    state: user?.billing?.state || ''
  });

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
        state: user.billing.state || ''
      });
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center flex-col gap-6 animate-fade-in">
        <div className="text-8xl animate-bounce-slow">🛒</div>
        <h2 className="text-3xl font-heading font-black text-funky-dark">Your cart is empty!</h2>
        <Link to="/" className="px-8 py-3 bg-funky-blue text-white rounded-xl font-bold hover:bg-funky-dark transition-colors shadow-lg">
          Go Fill It Up
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
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
    setIsProcessing(true);
    console.log("💳 Processing Order...");

    try {
      if (dataSource === 'wordpress') {
        const order = await createWooOrder(customer, items, cartTotal, 'razorpay', user?.id, shippingCost);
        console.log("✅ Order created ID:", order.id);

        if (!RAZORPAY_KEY_ID) {
          throw new Error("Razorpay Key ID is missing. Please configure VITE_RAZORPAY_KEY_ID in your environment.");
        }
        console.log("💳 Opening Razorpay for Key:", `${RAZORPAY_KEY_ID.substring(0, 8)}...`);

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
          theme: { color: '#EF476F' },
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
                alert("Payment Successful! Your happy feet are on the way. 🎉");
              } else {
                navigate('/login');
                alert("Payment Successful! An account was created for you. Please check your email to set a password and view your orders.");
              }
            } catch (err: any) {
              console.error("Payment sync failed:", err);
              alert(`Payment received, but we had trouble updating the order: ${err.message || 'Unknown Error'}`);
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              console.log("Payment window closed by user");
            }
          }
        };

        if (RAZORPAY_KEY_ID.startsWith('rzp_live')) {
          options.image = 'https://jumplings.in/wp-content/uploads/2023/06/cropped-Jumplings-Logo-Small.png';
        }

        const rzpInstance = new (window as any).Razorpay(options);

        rzpInstance.on('payment.failed', function (response: any) {
          console.error("Payment Step Failed:", response.error);
          alert(`Payment Failed: ${response.error.description}`);
          setIsProcessing(false);
        });

        rzpInstance.open();
        return;
      } else {
        setTimeout(() => {
          clearCart();
          setIsProcessing(false);
          alert("Order Processed (Simulated Mode) 🎉");
          navigate('/');
        }, 1500);
      }
    } catch (error: any) {
      console.error("Checkout failed:", error);
      alert(`Oops! Checkout Step Failed: ${error.message || "Something went wrong."}`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 animate-fade-in font-body">
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-funky-dark mb-10 transition-colors tracking-wide group">
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> BACK TO SHOP
        </Link>

        <h1 className="text-4xl md:text-5xl font-heading font-black text-funky-dark mb-12 flex items-center gap-4 tracking-tight">
          SECURE CHECKOUT <ShieldCheck className="text-funky-blue" size={32} />
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 space-y-12">

            {/* Shipping Info */}
            <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-white">
              <div className="flex items-center gap-4 mb-8 border-b-2 border-gray-100 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-funky-blue/10 flex items-center justify-center text-funky-blue">
                  <Truck size={24} />
                </div>
                <h2 className="text-2xl font-heading font-black text-funky-dark tracking-wide">
                  SHIPPING DETAILS
                </h2>
              </div>

              <form id="checkout-form" onSubmit={handlePayment} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest ml-1">Email Address</label>
                  <input name="email" value={customer.email} onChange={handleInputChange} required type="email" placeholder="you@example.com" className="w-full bg-white border border-gray-100 focus:border-funky-dark focus:ring-4 focus:ring-funky-dark/5 rounded-2xl px-6 py-4 md:py-5 font-bold outline-none transition-all placeholder:text-gray-200 text-lg shadow-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest ml-1">Phone Number</label>
                  <input name="phone" value={customer.phone} onChange={handleInputChange} required type="tel" placeholder="+91 98765 43210" className="w-full bg-white border border-gray-100 focus:border-funky-dark focus:ring-4 focus:ring-funky-dark/5 rounded-2xl px-6 py-4 md:py-5 font-bold outline-none transition-all placeholder:text-gray-200 text-lg shadow-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest ml-1">First Name</label>
                  <input name="firstName" value={customer.firstName} onChange={handleInputChange} required type="text" placeholder="Funky" className="w-full bg-white border border-gray-100 focus:border-funky-dark focus:ring-4 focus:ring-funky-dark/5 rounded-2xl px-6 py-4 md:py-5 font-bold outline-none transition-all placeholder:text-gray-200 text-lg shadow-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest ml-1">Last Name</label>
                  <input name="lastName" value={customer.lastName} onChange={handleInputChange} required type="text" placeholder="Person" className="w-full bg-white border border-gray-100 focus:border-funky-dark focus:ring-4 focus:ring-funky-dark/5 rounded-2xl px-6 py-4 md:py-5 font-bold outline-none transition-all placeholder:text-gray-200 text-lg shadow-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest ml-1">Address</label>
                  <input name="address" value={customer.address} onChange={handleInputChange} required type="text" placeholder="123 Happy Feet St" className="w-full bg-white border border-gray-100 focus:border-funky-dark focus:ring-4 focus:ring-funky-dark/5 rounded-2xl px-6 py-4 md:py-5 font-bold outline-none transition-all placeholder:text-gray-200 text-lg shadow-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest ml-1">City</label>
                  <input name="city" value={customer.city} onChange={handleInputChange} required type="text" placeholder="Sockville" className="w-full bg-white border border-gray-100 focus:border-funky-dark focus:ring-4 focus:ring-funky-dark/5 rounded-2xl px-6 py-4 md:py-5 font-bold outline-none transition-all placeholder:text-gray-200 text-lg shadow-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest ml-1">State</label>
                  <input name="state" value={customer.state} onChange={handleInputChange} required type="text" placeholder="State" className="w-full bg-white border border-gray-100 focus:border-funky-dark focus:ring-4 focus:ring-funky-dark/5 rounded-2xl px-6 py-4 md:py-5 font-bold outline-none transition-all placeholder:text-gray-200 text-lg shadow-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest ml-1">PIN Code</label>
                  <input name="pincode" value={customer.pincode} onChange={handleInputChange} required type="text" placeholder="100001" className="w-full bg-white border border-gray-100 focus:border-funky-dark focus:ring-4 focus:ring-funky-dark/5 rounded-2xl px-6 py-4 md:py-5 font-bold outline-none transition-all placeholder:text-gray-200 text-lg shadow-sm" />
                </div>
              </form>
            </section>


            {/* Payment Info */}
            <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-white relative overflow-hidden">
              <div className="flex items-center gap-4 mb-8 border-b-2 border-gray-100 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-funky-blue/10 flex items-center justify-center text-funky-blue">
                  <CreditCard size={24} />
                </div>
                <h2 className="text-2xl font-heading font-black text-funky-dark tracking-wide">
                  SECURE PAYMENT
                </h2>
              </div>

              <div className="flex flex-col gap-6">
                <div className="p-6 bg-funky-blue/[0.03] rounded-3xl border border-funky-blue/10 flex flex-col items-center text-center gap-4 group hover:bg-funky-blue/[0.05] transition-all">
                  <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center text-funky-blue group-hover:scale-110 transition-transform">
                    <ShieldCheck size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-funky-dark mb-1">Guaranteed Safe Checkout</h3>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">Payments are processed securely via Razorpay. We support all major UPI apps, Cards, and NetBanking.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border border-gray-100 opacity-60 hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Secure</span>
                    <div className="text-xs font-bold text-funky-dark">UPI</div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border border-gray-100 opacity-60 hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Instant</span>
                    <div className="text-xs font-bold text-funky-dark">Cards</div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border border-gray-100 opacity-60 hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Fast</span>
                    <div className="text-xs font-bold text-funky-dark">NetBanking</div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border border-gray-100 opacity-60 hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Trusted</span>
                    <div className="text-xs font-bold text-funky-dark">Wallets</div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-funky-dark text-white rounded-[2.5rem] p-8 md:p-10 sticky top-24 shadow-2xl shadow-funky-dark/20 ring-1 ring-white/10">
              <h2 className="text-2xl font-heading font-black mb-8 border-b border-white/10 pb-6 flex items-center justify-between">
                <span>ORDER SUMMARY</span>
                <span className="text-sm font-body font-normal opacity-60 normal-case">{items.length} items</span>
              </h2>

              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar-dark">
                {items.map(item => (
                  <div key={item.cartId} className="flex gap-4 group">
                    <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden flex-shrink-0 border-2 border-transparent group-hover:border-funky-yellow transition-all p-1">
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <div className="flex-1 py-1">
                      <h3 className="font-bold font-heading text-lg leading-tight mb-1">{item.name}</h3>
                      <p className="text-sm opacity-60 mb-2">{item.category} • <span className="text-funky-yellow">{item.selectedSize}</span></p>
                      <div className="flex justify-between items-center bg-white/5 rounded-lg px-3 py-1.5">
                        <span className="text-xs font-bold text-gray-400">Qty: {item.quantity}</span>
                        <span className="font-mono font-bold">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-white/10">
                <div className="flex justify-between items-center text-gray-400 text-sm">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">₹{subtotal}</span>
                </div>
                <div className="flex justify-between items-center text-gray-400 text-sm">
                  <span>Shipping</span>
                  <span className="font-mono text-white">{shippingCost === 0 ? <span className="text-green-400">FREE</span> : `₹${shippingCost}`}</span>
                </div>
                <div className="flex justify-between items-end pt-4 mt-2 border-t border-dashed border-white/10">
                  <span className="text-3xl font-heading font-black text-white">TOTAL</span>
                  <div className="text-right">
                    <span className="block text-4xl font-heading font-black text-funky-yellow leading-none">₹{cartTotal}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 block">Including Taxes</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isProcessing}
                className="w-full mt-10 bg-white text-funky-dark py-6 rounded-[2rem] font-heading font-black text-2xl hover:bg-funky-blue hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-2xl uppercase tracking-widest flex items-center justify-center gap-4 group ring-4 ring-white/10"
              >
                {isProcessing ? (
                  <span className="animate-pulse">SECURELY PROCESSING...</span>
                ) : (
                  <>
                    PAY ₹{cartTotal}
                    <ArrowLeft size={24} className="rotate-180 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>

              <div className="mt-8 pt-8 border-t border-white/10 flex flex-col items-center gap-4">
                <div className="flex items-center gap-6 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default scale-90">
                  <ShieldCheck size={20} />
                  <Truck size={20} />
                  <CreditCard size={20} />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 opacity-60">
                  <ShieldCheck size={12} className="text-funky-yellow" /> Secure 256-bit SSL Encryption
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-100 p-4 z-50 flex items-center justify-between shadow-[0_-5px_30px_rgba(0,0,0,0.1)] pb-safe">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total to Pay</span>
          <span className="text-2xl font-heading font-black text-funky-dark leading-none">₹{cartTotal}</span>
        </div>
        <button
          onClick={() => (document.getElementById('checkout-form') as HTMLFormElement)?.requestSubmit()}
          disabled={isProcessing}
          className="bg-funky-dark text-white px-10 py-4 rounded-2xl font-heading font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all text-sm flex items-center gap-2"
        >
          {isProcessing ? '...' : 'PAY NOW'}
          {!isProcessing && <ArrowLeft size={16} className="rotate-180" />}
        </button>
      </div>
    </div>
  );
};

export default Checkout;