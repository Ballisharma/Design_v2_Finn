import React from 'react';
import { X, Minus, Plus, Trash2, ArrowRight, ShoppingBag, Truck, Star, Flame, Shield, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useNavigate } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, removeFromCart, updateQuantity, subtotal, shippingCost, cartTotal, addToCart } = useCart();
  const { products, settings } = useProducts();
  const navigate = useNavigate();

  // Separate items by source
  const landingPageItems = items.filter(item => item.source === 'landing-page');
  const regularItems = items.filter(item => item.source !== 'landing-page');

  // Free Shipping Logic
  const FREE_SHIPPING_THRESHOLD = settings.freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  // Cross-sell recommendations: Get products not in cart, limit to 2
  const recommendations = products
    .filter(p => !items.find(i => i.id === p.id) && p.stock > 0)
    .sort(() => 0.5 - Math.random())
    .slice(0, 2);

  // Handle closing when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  // Render premium item (from landing pages)
  const renderPremiumItem = (item: typeof items[0]) => (
    <div key={item.cartId} className="relative p-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-900 shadow-lg">
      {/* Premium Badge */}
      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
        <Flame size={10} fill="white" />
        VIRAL PICK
      </div>

      <div className="flex gap-4">
        <div className="w-24 h-24 bg-white rounded-xl overflow-hidden flex-shrink-0 shadow-md border border-gray-200 relative">
          <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
          <span className="absolute bottom-1 right-1 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
            {item.selectedSize || 'Standard'}
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-1">
              <div>
                <h3 className="font-bold text-base text-gray-900 leading-tight">{item.name}</h3>
                <p className="text-[10px] text-gray-500 font-medium">{item.category}</p>
              </div>
              <button
                onClick={() => removeFromCart(item.cartId)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-bold text-amber-700">
                <Star size={10} fill="#f59e0b" className="text-amber-500" />
                4.9/5 Rated
              </div>
              <div className="text-[10px] text-gray-500 font-medium">142k+ sold</div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center bg-white rounded-lg border-2 border-gray-900 shadow-sm">
              <button
                onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                className="p-1.5 hover:bg-gray-50 text-gray-900 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="px-3 text-sm font-bold w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                className={`p-1.5 transition-colors ${item.quantity >= item.stock ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-50 text-gray-900'}`}
                disabled={item.quantity >= item.stock}
              >
                <Plus size={14} />
              </button>
            </div>
            <p className="font-bold text-lg text-gray-900">₹{item.price * item.quantity}</p>
          </div>
          {item.quantity >= item.stock && (
            <p className="text-[10px] text-red-500 font-bold mt-1 text-right">Max stock reached</p>
          )}
        </div>
      </div>
    </div>
  );

  // Render regular item (from store)
  const renderRegularItem = (item: typeof items[0]) => (
    <div key={item.cartId} className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-all">
      <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 shadow-sm relative">
        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
        <span className="absolute bottom-0 right-0 bg-gray-100 text-[9px] font-bold px-1 rounded-tl">
          {item.selectedSize || 'Free'}
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-sm text-gray-900 leading-tight">{item.name}</h3>
            <button onClick={() => removeFromCart(item.cartId)} className="text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
          <p className="text-[10px] text-gray-500 font-medium">{item.category}</p>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center bg-white rounded-md border border-gray-200 shadow-sm">
            <button
              onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
              className="p-1 hover:bg-gray-50 text-gray-600"
            >
              <Minus size={12} />
            </button>
            <span className="px-2 text-xs font-bold w-6 text-center">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
              className={`p-1 transition-colors ${item.quantity >= item.stock ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-50 text-gray-600'}`}
              disabled={item.quantity >= item.stock}
            >
              <Plus size={12} />
            </button>
          </div>
          <p className="font-bold text-sm text-gray-900">₹{item.price * item.quantity}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`fixed inset-0 z-[100] transition-visibility duration-500 ${isOpen ? 'visible' : 'invisible'}`}
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Drawer */}
      <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>

        {/* Header */}
        <div className="flex flex-col p-6 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-2xl text-gray-900 tracking-tight">Cart ({items.length})</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Progress Bar */}
          {items.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
                <Truck size={14} className={remainingForFreeShipping === 0 ? "text-green-600" : "text-gray-400"} />
                {remainingForFreeShipping > 0 ? (
                  <span className="text-gray-600">Add <span className="text-orange-500">₹{remainingForFreeShipping}</span> for free shipping</span>
                ) : (
                  <span className="text-green-600">You unlocked Free Shipping! 🎉</span>
                )}
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag size={40} className="text-gray-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 max-w-xs mx-auto">Start adding products to see them here.</p>
              </div>
              <button onClick={onClose} className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors shadow-lg">
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Landing Page Items */}
              {landingPageItems.length > 0 && (
                <div className="space-y-4">
                  {landingPageItems.length > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="h-px bg-gray-200 flex-1"></div>
                      <h4 className="font-bold text-xs text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Star size={12} className="text-orange-500" fill="#f97316" />
                        VERIFIED BESTSELLERS
                      </h4>
                      <div className="h-px bg-gray-200 flex-1"></div>
                    </div>
                  )}
                  {landingPageItems.map(renderPremiumItem)}
                </div>
              )}

              {/* Regular Items */}
              {regularItems.length > 0 && (
                <div className="space-y-3">
                  {landingPageItems.length > 0 && (
                    <div className="flex items-center gap-2 pt-2">
                      <div className="h-px bg-gray-200 flex-1"></div>
                      <h4 className="font-bold text-xs text-gray-400 uppercase tracking-widest">
                        Also in Cart
                      </h4>
                      <div className="h-px bg-gray-200 flex-1"></div>
                    </div>
                  )}
                  {regularItems.map(renderRegularItem)}
                </div>
              )}

              {/* Cross Selling Recommendations */}
              {recommendations.length > 0 && (
                <div className="pt-6 border-t border-dashed border-gray-200">
                  <h4 className="font-bold text-sm text-gray-400 uppercase tracking-widest mb-4">You might also like</h4>
                  <div className="space-y-3">
                    {recommendations.map(rec => (
                      <div key={rec.id} className="flex items-center gap-3 p-2 bg-white rounded-xl border border-gray-100 hover:border-gray-900 transition-colors group">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                          <img src={rec.images[0]} alt={rec.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{rec.name}</p>
                          <p className="text-xs text-gray-500 font-mono">₹{rec.price}</p>
                        </div>
                        <button
                          onClick={() => addToCart(rec, 1, rec.variants?.[0]?.size || 'Free Size')}
                          className="p-2 bg-gray-900 rounded-lg text-white hover:bg-black transition-colors"
                          title="Add to cart"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-[0_-5px_15px_rgba(0,0,0,0.05)] text-sm space-y-3">
            <div className="flex justify-between items-center text-gray-600">
              <span className="font-bold">Subtotal</span>
              <span className="font-mono">₹{subtotal}</span>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <span className="font-bold">Shipping</span>
              <span className={`font-mono ${shippingCost === 0 ? 'text-green-600 font-bold' : ''}`}>
                {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-300">
              <span className="font-black text-gray-900 text-lg uppercase tracking-wide">Total</span>
              <span className="font-mono text-3xl font-black text-gray-900">₹{cartTotal}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-gray-900 text-white py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-all group font-black text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 mt-4"
            >
              <span>CHECKOUT</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Trust Signals */}
            <div className="flex items-center justify-center gap-4 text-[10px] text-gray-500 pt-2">
              <div className="flex items-center gap-1">
                <Shield size={12} className="text-green-600" />
                <span>Secure Checkout</span>
              </div>
              <div className="w-px h-3 bg-gray-300"></div>
              <div className="flex items-center gap-1">
                <CheckCircle2 size={12} className="text-green-600" />
                <span>30-Day Guarantee</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;