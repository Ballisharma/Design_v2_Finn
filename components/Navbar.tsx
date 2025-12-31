import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Sparkles, Truck, RefreshCcw, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  onOpenCart: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenCart }) => {
  const { itemCount } = useCart();
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  const toggleMenu = () => {
      setIsMobileMenuOpen(prev => !prev);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[60] bg-white/90 backdrop-blur-md border-b-2 border-funky-dark/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center relative">
          
          {/* Logo */}
          <Link to="/" className="text-3xl font-heading font-black tracking-tighter text-funky-dark hover:text-funky-pink transition-colors relative group z-[70]">
            Jumplings<span className="text-funky-yellow text-4xl">.</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/shop" className="text-base font-bold font-heading uppercase tracking-wide hover:text-funky-blue transition-colors">Shop Socks</Link>
            <Link to="/about" className="text-base font-bold font-heading uppercase tracking-wide hover:text-funky-pink transition-colors">About Us</Link>
            <Link 
                to="/grip-socks" 
                className="text-base font-bold font-heading uppercase tracking-wide text-white bg-funky-dark px-4 py-2 rounded-full hover:bg-funky-green hover:text-funky-dark transition-all flex items-center gap-2"
            >
                <Sparkles size={16} /> Grip Series
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 md:gap-4 z-[70]">
            
            {/* Account Icon (Desktop) */}
            <Link to={user ? "/account" : "/login"} className="hidden md:flex p-2 hover:bg-funky-light rounded-full transition-colors text-funky-dark hover:text-funky-blue" title="My Account">
               <User size={24} />
            </Link>

            <button onClick={onOpenCart} className="relative p-2 bg-funky-light rounded-full hover:bg-funky-yellow transition-colors group border-2 border-transparent hover:border-funky-dark">
              <ShoppingBag size={24} className="text-funky-dark" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-funky-pink text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border border-white">
                  {itemCount}
                </span>
              )}
            </button>
            
             {/* Mobile Menu Button - Ensure Z-Index is highest */}
            <button 
              className="md:hidden p-2 text-funky-dark hover:bg-funky-light rounded-full transition-colors relative z-[80]"
              onClick={toggleMenu}
              type="button"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`md:hidden fixed inset-0 bg-funky-yellow z-[50] transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        } flex flex-col`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black/20 to-transparent bg-[length:20px_20px]"></div>

        <div className="flex flex-col h-full relative z-10 px-6 pt-24 pb-safe-bottom">
          <div className="flex flex-col space-y-2 mt-4">
            <Link to="/shop" onClick={toggleMenu} className="font-heading font-black text-5xl text-funky-dark hover:text-white transition-all transform hover:translate-x-4 active:scale-95 origin-left">
              SHOP ALL
            </Link>
            <Link to="/grip-socks" onClick={toggleMenu} className="font-heading font-black text-5xl text-funky-pink hover:text-white transition-all transform hover:translate-x-4 active:scale-95 origin-left flex items-center gap-3">
               GRIP SOCKS <Sparkles size={32} className="animate-pulse" />
            </Link>
            <Link to={user ? "/account" : "/login"} onClick={toggleMenu} className="font-heading font-black text-5xl text-funky-dark hover:text-white transition-all transform hover:translate-x-4 active:scale-95 origin-left flex items-center gap-2">
               {user ? "MY ACCOUNT" : "LOGIN"}
            </Link>
            <Link to="/about" onClick={toggleMenu} className="font-heading font-black text-5xl text-funky-dark hover:text-white transition-all transform hover:translate-x-4 active:scale-95 origin-left">
               OUR STORY
            </Link>
            <Link to="/contact" onClick={toggleMenu} className="font-heading font-black text-5xl text-funky-dark hover:text-white transition-all transform hover:translate-x-4 active:scale-95 origin-left">
               CONTACT
            </Link>
          </div>
          
          <div className="mt-auto mb-8 grid grid-cols-2 gap-4">
             <div className="bg-white p-4 rounded-2xl text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-funky-dark transform rotate-1 active:scale-95 transition-transform">
                <Truck size={24} className="mx-auto mb-2 text-funky-blue" />
                <span className="text-xs font-bold uppercase text-funky-dark block">Free Shipping</span>
                <span className="text-[10px] font-bold text-gray-400">On orders ₹399+</span>
             </div>
             <div className="bg-white p-4 rounded-2xl text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-funky-dark transform -rotate-1 active:scale-95 transition-transform">
                <RefreshCcw size={24} className="mx-auto mb-2 text-funky-pink" />
                <span className="text-xs font-bold uppercase text-funky-dark block">Easy Returns</span>
                <span className="text-[10px] font-bold text-gray-400">7 Day Policy</span>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;