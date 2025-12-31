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
  const { user } = useUser();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'razorpay'>('cod');

  // Auto-fill from user context if available
  const [customer, setCustomer] = useState({
    email: user?.email || '',
    phone: '',
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    address: '',
    city: '',
    pincode: '',
    state: ''
  });

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
        const order = await createWooOrder(customer, items, cartTotal, paymentMethod, user?.id);
        console.log("✅ Order created ID:", order.id);

        if (paymentMethod === 'razorpay') {
          const rzpInstance = new (window as any).Razorpay({
            key: RAZORPAY_KEY_ID,
            amount: Math.round(cartTotal * 100),
            currency: 'INR',
            name: 'Jumplings',
            description: `Order #${order.id}`,
            image: 'https://jumplings.in/wp-content/uploads/2023/06/cropped-Jumplings-Logo-Small.png',
            order_id: '',
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
                navigate(user ? '/account' : '/');
                alert("Payment Successful! Your happy feet are on the way. 🎉");
              } catch (err) {
                console.error("Payment sync failed:", err);
                alert("Payment received, but we had trouble updating the order. Please contact support.");
              }
            },
            modal: {
              ondismiss: function () {
                setIsProcessing(false);
              }
            }
          });
          rzpInstance.open();
          return;
        }

        await refreshProducts();
        clearCart();
        setIsProcessing(false);
        navigate(user ? '/account' : '/');
        alert("Order Placed Successfully! (Cash on Delivery) 🚚");
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
      alert(`Oops! ${error.message || "Something went wrong. Please check your details or connection."}`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-fade-in bg-white">
      <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-funky-dark mb-8 transition-colors">
        <ArrowLeft size={20} className="mr-2" /> KEEP SHOPPING
      </Link>

      <h1 className="text-4xl md:text-5xl font-heading font-black text-funky-dark mb-12 flex items-center gap-3">
        SECURE CHECKOUT <span className="text-2xl">🔒</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Forms */}
        <div className="lg:col-span-7 space-y-10">

          {/* Shipping Info */}
          <section className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-funky-blue"></div>
            <h2 className="text-2xl font-heading font-black text-funky-dark mb-6 flex items-center gap-2">
              <Truck className="text-funky-blue" /> SHIPPING DETAILS
            </h2>

            <form id="checkout-form" onSubmit={handlePayment} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email Address</label>
                <input name="email" value={customer.email} onChange={handleInputChange} required type="email" placeholder="you@example.com" className="w-full bg-funky-light border-2 border-transparent focus:border-funky-blue rounded-xl px-4 py-3 font-medium outline-none transition-colors" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Phone Number</label>
                <input name="phone" value={customer.phone} onChange={handleInputChange} required type="tel" placeholder="+91 98765 43210" className="w-full bg-funky-light border-2 border-transparent focus:border-funky-blue rounded-xl px-4 py-3 font-medium outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">First Name</label>
                <input name="firstName" value={customer.firstName} onChange={handleInputChange} required type="text" placeholder="Funky" className="w-full bg-funky-light border-2 border-transparent focus:border-funky-blue rounded-xl px-4 py-3 font-medium outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Last Name</label>
                <input name="lastName" value={customer.lastName} onChange={handleInputChange} required type="text" placeholder="Person" className="w-full bg-funky-light border-2 border-transparent focus:border-funky-blue rounded-xl px-4 py-3 font-medium outline-none transition-colors" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Address</label>
                <input name="address" value={customer.address} onChange={handleInputChange} required type="text" placeholder="123 Happy Feet St" className="w-full bg-funky-light border-2 border-transparent focus:border-funky-blue rounded-xl px-4 py-3 font-medium outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">City</label>
                <input name="city" value={customer.city} onChange={handleInputChange} required type="text" placeholder="Sockville" className="w-full bg-funky-light border-2 border-transparent focus:border-funky-blue rounded-xl px-4 py-3 font-medium outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">State</label>
                <input name="state" value={customer.state} onChange={handleInputChange} required type="text" placeholder="State" className="w-full bg-funky-light border-2 border-transparent focus:border-funky-blue rounded-xl px-4 py-3 font-medium outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">PIN Code</label>
                <input name="pincode" value={customer.pincode} onChange={handleInputChange} required type="text" placeholder="100001" className="w-full bg-funky-light border-2 border-transparent focus:border-funky-blue rounded-xl px-4 py-3 font-medium outline-none transition-colors" />
              </div>
            </form>
          </section>

          {/* Payment Info */}
          <section className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-funky-green"></div>
            <h2 className="text-2xl font-heading font-black text-funky-dark mb-6 flex items-center gap-2">
              <CreditCard className="text-funky-green" /> PAYMENT
            </h2>

            <div className="p-4 bg-funky-light rounded-xl border border-funky-green/20 mb-6 flex items-center gap-3">
              <ShieldCheck className="text-funky-green" />
              <p className="text-sm text-gray-600 font-medium">Transactions are secure and encrypted.</p>
            </div>

            <div className="space-y-4">
              {/* COD Option */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-funky-green bg-green-50/50' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-funky-green' : 'border-gray-300'}`}>
                  {paymentMethod === 'cod' && <div className="w-2 h-2 bg-funky-green rounded-full"></div>}
                </div>
                <span className={`font-bold ${paymentMethod === 'cod' ? 'text-funky-dark' : 'text-gray-500'}`}>Cash on Delivery (COD)</span>
              </div>

              {/* Razorpay Option */}
              <div
                onClick={() => setPaymentMethod('razorpay')}
                className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'razorpay' ? 'border-funky-blue bg-blue-50/50' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'razorpay' ? 'border-funky-blue' : 'border-gray-300'}`}>
                  {paymentMethod === 'razorpay' && <div className="w-2 h-2 bg-funky-blue rounded-full"></div>}
                </div>
                <span className={`font-bold ${paymentMethod === 'razorpay' ? 'text-funky-dark' : 'text-gray-500'}`}>Online Payment (UPI/Card/NetBanking)</span>
                {paymentMethod === 'razorpay' && <span className="ml-auto text-xs font-bold bg-funky-blue text-white px-2 py-1 rounded">Razorpay</span>}
              </div>
            </div>
          </section>

        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-funky-dark text-white rounded-3xl p-8 sticky top-24 shadow-xl shadow-funky-dark/20">
            <h2 className="text-2xl font-heading font-black mb-8 border-b border-white/10 pb-4">ORDER SUMMARY</h2>

            <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar-dark">
              {items.map(item => (
                <div key={item.cartId} className="flex gap-4">
                  <div className="w-16 h-16 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold font-heading">{item.name}</h3>
                    <p className="text-xs opacity-60 mb-1">{item.category}</p>
                    <p className="text-[10px] bg-white/20 inline-block px-1 rounded mb-1">{item.selectedSize}</p>
                    <p className="text-sm font-mono">Qty: {item.quantity} × ₹{item.price}</p>
                  </div>
                  <div className="font-mono font-bold">₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10 text-sm">
              <div className="flex justify-between opacity-80">
                <span>Subtotal</span>
                <span className="font-mono">₹{subtotal}</span>
              </div>
              <div className="flex justify-between opacity-80">
                <span>Shipping</span>
                <span className="font-mono">{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
              </div>
              <div className="flex justify-between text-xl font-bold font-heading pt-4 text-funky-yellow">
                <span>TOTAL</span>
                <span className="font-mono">₹{cartTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={isProcessing}
              className="w-full mt-8 bg-funky-yellow text-funky-dark py-4 rounded-xl font-heading font-black text-lg hover:bg-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'PROCESSING...' : paymentMethod === 'razorpay' ? `PAY SECURELY ₹${cartTotal}` : `PLACE ORDER ₹${cartTotal}`}
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs opacity-50">
              <Gift size={14} />
              <span>Free pair of mystery socks with every order!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;