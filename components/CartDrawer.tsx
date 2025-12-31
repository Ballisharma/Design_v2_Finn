import React from 'react';
import { X, Minus, Plus, Trash2, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
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

  // Free Shipping Logic
  const FREE_SHIPPING_THRESHOLD = settings.freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  // Cross-sell recommendations: Get products not in cart, limit to 2
  const recommendations = products
    .filter(p => !items.find(i => i.id === p.id) && p.stock > 0)
    .sort(() => 0.5 - Math.random()) // Simple shuffle
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

  return (
    <div 
      className={`fixed inset-0 z-[100] transition-visibility duration-500 ${isOpen ? 'visible' : 'invisible'}`}
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-funky-dark/40 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Drawer */}
      <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col border-l-4 border-funky-yellow`}>
        
        {/* Header */}
        <div className="flex flex-col p-6 border-b border-gray-100 bg-funky-light">
          <div className="flex items-center justify-between mb-4">
             <h2 className="font-heading font-black text-2xl text-funky-dark">YOUR STASH ({items.length})</h2>
             <button onClick={onClose} className="p-2 hover:bg-white hover:text-funky-pink rounded-full transition-colors">
               <X size={24} />
             </button>
          </div>

          {/* Progress Bar */}
          {items.length > 0 && (
            <div className="space-y-2">
               <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wide">
                 <Truck size={14} className={remainingForFreeShipping === 0 ? "text-funky-green" : "text-gray-400"} />
                 {remainingForFreeShipping > 0 ? (
                    <span>Add <span className="text-funky-pink">₹{remainingForFreeShipping}</span> for free shipping</span>
                 ) : (
                    <span className="text-funky-green">You unlocked Free Shipping! 🎉</span>
                 )}
               </div>
               <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-funky-green transition-all duration-500"
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
              <span className="text-8xl animate-bounce-slow">🧦</span>
              <div>
                <h3 className="text-xl font-heading font-bold text-funky-dark mb-2">No socks here yet!</h3>
                <p className="text-gray-500 max-w-xs mx-auto">Your feet are waiting for some fun. Go fill them up.</p>
              </div>
              <button onClick={onClose} className="px-6 py-3 bg-funky-blue text-white rounded-xl font-bold hover:bg-funky-dark transition-colors">
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.cartId} className="flex gap-4 p-4 bg-funky-light/50 rounded-2xl border border-transparent hover:border-funky-blue/20 transition-all">
                <div className="w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0 shadow-sm relative">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 right-0 bg-gray-100 text-[10px] font-bold px-1 rounded-tl-md">{item.selectedSize || 'Free'}</span>
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-heading font-bold text-base text-funky-dark leading-tight">{item.name}</h3>
                      <button onClick={() => removeFromCart(item.cartId)} className="text-gray-400 hover:text-funky-pink transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">{item.category}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm">
                      <button 
                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                        className="p-1 hover:bg-gray-50 text-gray-600"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-2 text-xs font-mono font-bold w-6 text-center">{item.quantity}</span>
                      <button 
                         onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                         className={`p-1 transition-colors ${item.quantity >= item.stock ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-50 text-gray-600'}`}
                         disabled={item.quantity >= item.stock}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <p className="font-mono font-bold text-sm text-funky-dark">₹{item.price * item.quantity}</p>
                  </div>
                  {item.quantity >= item.stock && (
                     <p className="text-[10px] text-red-500 font-bold mt-1 text-right">Max stock reached</p>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Cross Selling Recommendations */}
          {items.length > 0 && recommendations.length > 0 && (
             <div className="pt-6 border-t border-dashed border-gray-200">
                <h4 className="font-heading font-bold text-sm text-gray-400 uppercase tracking-widest mb-4">Complete the vibe</h4>
                <div className="space-y-3">
                   {recommendations.map(rec => (
                      <div key={rec.id} className="flex items-center gap-3 p-2 bg-white rounded-xl border border-gray-100 hover:border-funky-yellow transition-colors group">
                         <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                            <img src={rec.images[0]} alt={rec.name} className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm truncate">{rec.name}</p>
                            <p className="text-xs text-gray-500 font-mono">₹{rec.price}</p>
                         </div>
                         <button 
                           onClick={() => addToCart(rec, 1, rec.variants?.[0]?.size || 'Free Size')}
                           className="p-2 bg-funky-light rounded-lg text-funky-dark hover:bg-funky-dark hover:text-white transition-colors"
                           title="Add to cart"
                         >
                            <Plus size={16} />
                         </button>
                      </div>
                   ))}
                </div>
             </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-funky-light/30 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] text-sm space-y-2">
            <div className="flex justify-between items-center text-gray-500">
              <span className="font-bold">Subtotal</span>
              <span className="font-mono">₹{subtotal}</span>
            </div>
             <div className="flex justify-between items-center text-gray-500">
              <span className="font-bold">Shipping</span>
              <span className={`font-mono ${shippingCost === 0 ? 'text-funky-green font-bold' : ''}`}>
                  {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-300">
              <span className="font-heading font-bold text-funky-dark text-lg uppercase tracking-wide">Total</span>
              <span className="font-mono text-3xl font-bold text-funky-dark">₹{cartTotal}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full bg-funky-green text-white py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-funky-dark transition-all group font-heading font-black text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 mt-4"
            >
              <span>CHECKOUT</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;