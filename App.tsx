import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import ProductModal from './components/ProductModal';
import WordPressSyncPanel from './components/WordPressSyncPanel';
import DebugPanel from './components/DebugPanel';
import { Instagram, Facebook, Twitter, Linkedin, Heart, Loader2 } from 'lucide-react';

// Lazy load views for better initial performance
const Home = React.lazy(() => import('./views/Home'));
const AllProducts = React.lazy(() => import('./views/AllProducts'));
const GripSocksLP = React.lazy(() => import('./views/GripSocksLP'));
const SeaUrchinLP = React.lazy(() => import('./views/SeaUrchinLP'));
const SeaUrchinLPHighConvert = React.lazy(() => import('./views/SeaUrchinLP_HighConvert'));
const YogaSocksLP = React.lazy(() => import('./views/YogaSocksLP'));
const ProductDetails = React.lazy(() => import('./views/ProductDetails'));
const Checkout = React.lazy(() => import('./views/Checkout'));
const About = React.lazy(() => import('./views/About'));
const Contact = React.lazy(() => import('./views/Contact'));
const Privacy = React.lazy(() => import('./views/Privacy'));
const Terms = React.lazy(() => import('./views/Terms'));
const Shipping = React.lazy(() => import('./views/Shipping'));
const Returns = React.lazy(() => import('./views/Returns'));
const Login = React.lazy(() => import('./views/Login'));
const Register = React.lazy(() => import('./views/Register'));
const ResetPassword = React.lazy(() => import('./views/ResetPassword'));
const MyAccount = React.lazy(() => import('./views/MyAccount'));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    // We only want to scroll to top if we are NOT opening a modal
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Separated Content to use hooks inside HashRouter
const AppContent: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  // The state type definition for background location
  const state = location.state as { background?: any } | null;
  const background = state?.background;

  return (
    <div className="min-h-screen flex flex-col font-body text-funky-dark bg-white selection:bg-funky-yellow selection:text-funky-dark">
      <Navbar onOpenCart={() => setIsCartOpen(true)} />

      {!background && <ScrollToTop />}

      <main className="flex-grow">
        <React.Suspense fallback={
          <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 text-funky-dark animate-spin opacity-20" />
            <p className="font-heading font-black text-xs uppercase tracking-[0.2em] text-funky-dark/20">Loading...</p>
          </div>
        }>
          <Routes location={background || location}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<AllProducts />} />
            <Route path="/grip-socks" element={<GripSocksLP />} />
            <Route path="/sea-urchin-lamp" element={<SeaUrchinLP />} />
            <Route path="/sea-urchin-lamp-v2" element={<SeaUrchinLPHighConvert />} />
            <Route path="/yoga-grip-socks" element={<YogaSocksLP />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/account" element={<MyAccount />} />
            <Route path="/admin/sync" element={<WordPressSyncPanel />} />
            <Route path="/admin/debug" element={<DebugPanel />} />
          </Routes>
        </React.Suspense>

        {/* Modal Routes */}
        {background && (
          <Routes>
            <Route path="/product/:id" element={<ProductModal />} />
          </Routes>
        )}
      </main>

      {/* Redesigned Footer: 2-Column Layout */}
      <footer className="bg-funky-dark text-white pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 mb-16">

          {/* Column 1: Brand & Socials */}
          <div className="space-y-8">
            <Link to="/" className="text-5xl font-heading font-black tracking-tighter text-white hover:text-funky-pink transition-colors relative group inline-block">
              Jumplings<span className="text-funky-yellow">.</span>
            </Link>

            <p className="max-w-md opacity-80 text-lg leading-relaxed">
              Making your feet the life of the party since 2025.
              Engineered for comfort, designed for the bold.
            </p>

            <div className="flex gap-4 pt-4">
              <a href="#" className="p-3 bg-white/10 rounded-xl hover:bg-funky-yellow hover:text-funky-dark transition-all hover:-translate-y-1"><Facebook size={24} /></a>
              <a href="#" className="p-3 bg-white/10 rounded-xl hover:bg-funky-pink hover:text-white transition-all hover:-translate-y-1"><Instagram size={24} /></a>
              <a href="#" className="p-3 bg-white/10 rounded-xl hover:bg-funky-blue hover:text-white transition-all hover:-translate-y-1"><Linkedin size={24} /></a>
            </div>
          </div>

          {/* Column 2: Navigation Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Shop Links */}
            <div>
              <h3 className="font-heading font-bold text-xl mb-6 text-funky-yellow">SHOP</h3>
              <ul className="space-y-4 opacity-80 font-medium">
                <li><Link to="/shop" className="hover:text-funky-yellow transition-colors hover:translate-x-1 inline-block">All Products</Link></li>
                <li><Link to="/grip-socks" className="hover:text-funky-yellow transition-colors hover:translate-x-1 inline-block text-funky-pink font-bold">★ Grip Series</Link></li>
                <li><Link to="/sea-urchin-lamp" className="hover:text-funky-yellow transition-colors hover:translate-x-1 inline-block text-orange-400 font-bold">★ Sea Urchin Lamp</Link></li>
                <li><Link to="/shop" className="hover:text-funky-yellow transition-colors hover:translate-x-1 inline-block">New Arrivals</Link></li>
                <li><Link to="/shop" className="hover:text-funky-yellow transition-colors hover:translate-x-1 inline-block">Gift Boxes</Link></li>
              </ul>
            </div>

            {/* Service Links */}
            <div>
              <h3 className="font-heading font-bold text-xl mb-6 text-funky-green">SERVICE</h3>
              <ul className="space-y-4 opacity-80 font-medium">
                <li><Link to="/account" className="hover:text-funky-green transition-colors hover:translate-x-1 inline-block">My Orders</Link></li>
                <li><Link to="/shipping" className="hover:text-funky-green transition-colors hover:translate-x-1 inline-block">Track Order</Link></li>
                <li><Link to="/shipping" className="hover:text-funky-green transition-colors hover:translate-x-1 inline-block">Shipping Policy</Link></li>
                <li><Link to="/returns" className="hover:text-funky-green transition-colors hover:translate-x-1 inline-block">Returns</Link></li>
                <li><Link to="/terms" className="hover:text-funky-green transition-colors hover:translate-x-1 inline-block">Terms</Link></li>
                <li><Link to="/privacy" className="hover:text-funky-green transition-colors hover:translate-x-1 inline-block">Privacy</Link></li>
              </ul>
            </div>

            {/* Info Links */}
            <div>
              <h3 className="font-heading font-bold text-xl mb-6 text-funky-pink">INFO</h3>
              <ul className="space-y-4 opacity-80 font-medium">
                <li><Link to="/about" className="hover:text-funky-pink transition-colors hover:translate-x-1 inline-block">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-funky-pink transition-colors hover:translate-x-1 inline-block">Contact</Link></li>
                <li><Link to="/contact" className="hover:text-funky-pink transition-colors hover:translate-x-1 inline-block">FAQ</Link></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm opacity-60 font-mono gap-4">
          <p>&copy; 2025 Jumplings Inc. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Made with</span>
            <Heart size={14} className="text-funky-pink fill-funky-pink animate-pulse" />
            <span>in New Delhi</span>
          </div>
        </div>
      </footer>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

const App: React.FC = () => {
  return (
    <UserProvider>
      <ProductProvider>
        <CartProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </CartProvider>
      </ProductProvider>
    </UserProvider>
  );
};

export default App;