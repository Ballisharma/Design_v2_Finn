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
      {/* Announcement Bar */}
      <div className="bg-funky-dark text-white text-xs font-bold font-mono py-2 text-center tracking-widest uppercase">
        Free Shipping on all orders over ₹399
      </div>

      <nav className="sticky top-0 left-0 w-full z-[60] bg-white transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex justify-between items-center relative">

          {/* Left: Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/shop" className="text-funky-dark font-heading font-bold text-sm bg-funky-dark text-white px-6 py-2 rounded-full hover:bg-funky-blue transition-colors">
              Shop
            </Link>
            {/* Removed Quiz link as requested */}
          </div>

          {/* Mobile Menu Button - Left Aligned on Mobile */}
          <button
            className="md:hidden p-2 text-funky-dark"
            onClick={toggleMenu}
            type="button"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Center: Logo */}
          <Link to="/" className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-heading font-black tracking-tighter text-funky-dark hover:text-funky-pink transition-colors">
            Jumplings<span className="text-funky-pink">.</span>
          </Link>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            {/* Account */}
            <Link to={user ? "/account" : "/login"} className="text-funky-dark hover:text-funky-blue transition-colors">
              <User size={24} strokeWidth={2} />
            </Link>

            {/* Cart */}
            <button onClick={onOpenCart} className="relative text-funky-dark hover:text-funky-pink transition-colors">
              <ShoppingBag size={24} strokeWidth={2} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-funky-dark text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-white z-[50] transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          } flex flex-col pt-32 px-6`}
      >
        <div className="flex flex-col space-y-6">
          <Link to="/shop" onClick={toggleMenu} className="font-heading font-black text-4xl text-funky-dark hover:text-funky-pink transition-colors">
            Shop
          </Link>
          <Link to="/about" onClick={toggleMenu} className="font-heading font-black text-4xl text-funky-dark hover:text-funky-pink transition-colors">
            About
          </Link>
          <Link to={user ? "/account" : "/login"} onClick={toggleMenu} className="font-heading font-black text-4xl text-funky-dark hover:text-funky-pink transition-colors">
            {user ? "My Account" : "Login"}
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;