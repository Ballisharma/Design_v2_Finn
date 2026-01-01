import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Star, Heart, Share2, Box, AlertTriangle, Minus, Plus, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';

interface ProductDetailsProps {
  isModal?: boolean;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ isModal = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // Swipe State
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Cross-sell logic: Find other products in same category or just random
  const relatedProducts = product
    ? products
      .filter(p => p.id !== product.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
    : [];

  // Determine current stock based on selection
  const currentVariant = product?.variants.find(v => v.size === selectedSize);
  const maxStockForSelection = currentVariant ? currentVariant.stock : 0;
  const isSizeOutOfStock = !!selectedSize && maxStockForSelection === 0;

  // Set default size (prefer one that has stock)
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      // Try to find first in-stock variant
      const inStockVariant = product.variants.find(v => v.stock > 0);
      if (inStockVariant) {
        setSelectedSize(inStockVariant.size);
      } else {
        setSelectedSize(product.variants[0].size);
      }
    }
    setQuantity(1);
    setActiveImage(0);
  }, [product, id]);

  useEffect(() => {
    // Only scroll to top if not in a modal
    if (!isModal) {
      window.scrollTo(0, 0);
    }
  }, [id, isModal]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && product && activeImage < product.images.length - 1) {
      setActiveImage(prev => prev + 1);
    }
    if (isRightSwipe && product && activeImage > 0) {
      setActiveImage(prev => prev - 1);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center flex-col gap-4">
        <h2 className="text-3xl font-heading font-bold">Product not found</h2>
        <Link to="/" className="text-funky-blue underline font-bold">Back to Shop</Link>
      </div>
    );
  }

  // General product stock status (sum of all variants)
  const isTotallyOutOfStock = product.stock === 0;
  const isLowStock = maxStockForSelection > 0 && maxStockForSelection <= 5;

  const handleAddToCart = () => {
    if (selectedSize && maxStockForSelection > 0) {
      addToCart(product, quantity, selectedSize);

      // If we are in a modal, close it automatically after adding to cart
      if (isModal) {
        navigate(-1);
      }
    }
  };

  const incrementQuantity = () => {
    if (quantity < maxStockForSelection) {
      setQuantity(prev => prev + 1);
    } else {
      alert(`Only ${maxStockForSelection} units available for ${selectedSize}.`);
    }
  };

  // -------------------------
  // MOBILE LAYOUT (Updated)
  // -------------------------
  const MobileLayout = () => (
    <div className="bg-funky-light min-h-screen md:hidden flex flex-col relative pb-32">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 w-full z-30 p-4 flex justify-between items-start pointer-events-none">
        {!isModal && (
          <Link to="/" className="pointer-events-auto p-3 bg-white/90 backdrop-blur-md rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] text-funky-dark border border-gray-100 active:scale-95 transition-transform">
            <ArrowLeft size={20} strokeWidth={3} />
          </Link>
        )}
        {/* Price Tag Pill */}
        <div className="bg-funky-yellow text-funky-dark font-black px-5 py-2.5 rounded-2xl shadow-[4px_4px_0px_0px_rgba(7,59,76,1)] border-2 border-funky-dark ml-auto font-mono text-lg pointer-events-auto transform rotate-2">
          ₹{product.price}
        </div>
      </div>

      {/* Full Screen Image Slider Area */}
      <div
        className="h-[60vh] w-full relative bg-gray-200"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={product.images[activeImage]}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-all duration-300"
        />

        {/* Gradient Overlay for text readability at the curve */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-funky-dark/10 pointer-events-none" />

        {/* Mobile Navigation Arrows */}
        {product.images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); if (activeImage > 0) setActiveImage(activeImage - 1); }}
              className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-md text-funky-dark hover:bg-white transition-all z-20 ${activeImage === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); if (activeImage < product.images.length - 1) setActiveImage(activeImage + 1); }}
              className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-md text-funky-dark hover:bg-white transition-all z-20 ${activeImage === product.images.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {product.images.length > 1 && (
          <div className="absolute bottom-12 left-0 w-full flex justify-center gap-2 z-20">
            {product.images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setActiveImage(idx); }}
                className={`h-1.5 rounded-full transition-all shadow-sm ${activeImage === idx ? 'w-6 bg-funky-yellow border border-funky-dark' : 'w-2 bg-white/80'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Rounded Card Overlay */}
      <div className="flex-1 bg-white rounded-t-[2.5rem] -mt-8 relative z-10 px-6 pt-10 pb-24 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] border-t border-white/50">

        {/* Pull Handle Visual */}
        <div className="w-16 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>

        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-funky-light text-funky-dark text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border border-funky-dark/10 tracking-wide">{product.category}</span>
              {isLowStock && <span className="text-[10px] bg-red-50 text-red-500 font-bold px-2 py-1 rounded-full animate-pulse">Low Stock</span>}
            </div>
            <h1 className="font-heading font-black text-3xl text-funky-dark leading-none">{product.name}</h1>
          </div>
          <button className="p-3 bg-gray-50 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors border border-gray-100 shadow-sm active:scale-95">
            <Heart size={24} />
          </button>
        </div>

        <p className="text-gray-600 text-sm mb-8 leading-relaxed font-medium">{product.description}</p>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="font-heading font-bold text-funky-dark uppercase text-sm">Select Size</span>
            <span className="text-xs text-funky-blue font-bold underline">Size Guide</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {product.variants.map((v) => (
              <button
                key={v.size}
                onClick={() => { setSelectedSize(v.size); setQuantity(1); }}
                disabled={v.stock === 0}
                className={`min-w-[4.5rem] py-3.5 px-4 rounded-2xl font-bold text-sm transition-all border-2 relative ${selectedSize === v.size
                  ? 'bg-funky-dark text-white border-funky-dark shadow-[4px_4px_0px_0px_rgba(7,59,76,0.3)] transform -translate-y-1'
                  : v.stock === 0
                    ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed opacity-60'
                    : 'bg-white text-gray-500 border-gray-100'
                  }`}
              >
                {v.size}
                {v.stock === 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full shadow-sm">
                    SOLD
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Info Pills */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-green-50 p-3 rounded-xl border border-green-100 flex items-center gap-2">
            <span className="text-lg">🌿</span>
            <span className="text-xs font-bold text-green-700">Organic Cotton</span>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-center gap-2">
            <span className="text-lg">🇮🇳</span>
            <span className="text-xs font-bold text-blue-700">Made in India</span>
          </div>
        </div>

        {/* Mobile Cross-sell */}
        {!isModal && (
          <div className="mt-8 pt-8 border-t border-dashed border-gray-200">
            <h3 className="font-heading font-black text-lg mb-4 text-funky-dark uppercase">Complete the Vibe</h3>
            <div className="grid grid-cols-2 gap-4">
              {relatedProducts.slice(0, 2).map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-200 p-4 z-40 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <div className="flex gap-3 max-w-lg mx-auto">
          {/* Quantity Selector */}
          <div className="flex items-center bg-gray-100 rounded-2xl border border-transparent px-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 flex items-center justify-center text-funky-dark active:scale-90 transition-transform"
            >
              <Minus size={18} />
            </button>
            <span className="w-6 text-center font-bold font-mono text-lg">{quantity}</span>
            <button
              onClick={incrementQuantity}
              className={`w-12 h-12 flex items-center justify-center text-funky-dark active:scale-90 transition-transform ${quantity >= maxStockForSelection ? 'opacity-30' : ''}`}
              disabled={quantity >= maxStockForSelection}
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isSizeOutOfStock}
            className={`flex-1 py-4 rounded-2xl font-heading font-black text-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${isSizeOutOfStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-funky-dark text-white shadow-funky-dark/20'
              }`}
          >
            {isSizeOutOfStock ? 'Sold Out' : 'ADD TO CART'}
          </button>
        </div>
      </div>
    </div>
  );

  // -------------------------
  // DESKTOP LAYOUT (Existing)
  // -------------------------
  const DesktopLayout = () => (
    <div className={`hidden md:block max-w-7xl mx-auto animate-fade-in`}>

      {/* Main Details Section */}
      <div className={`${isModal ? 'p-6 md:p-8' : 'px-6 py-12'}`}>
        {!isModal && (
          <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-funky-dark mb-8 transition-colors">
            <ArrowLeft size={20} className="mr-2" /> BACK TO SOCKS
          </Link>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square w-full bg-funky-light rounded-3xl overflow-hidden border-4 border-transparent hover:border-funky-yellow transition-all relative">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className={`w-full h-full object-cover transition-opacity ${isTotallyOutOfStock ? 'opacity-50 grayscale' : ''}`}
              />
              {isTotallyOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/80 text-white px-8 py-4 rounded-xl font-heading font-black text-3xl transform -rotate-12 border-4 border-white">
                    SOLD OUT
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-funky-dark ring-2 ring-funky-dark/20' : 'border-gray-200 hover:border-funky-blue'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className={`flex flex-col justify-center ${!isModal ? 'sticky top-24' : ''} h-fit`}>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between items-start">
                <span className="bg-funky-blue/10 text-funky-blue text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{product.category}</span>
                <div className="flex gap-4">
                  <button className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"><Heart size={20} /></button>
                  <button className="p-2 hover:bg-blue-50 hover:text-blue-500 rounded-full transition-colors"><Share2 size={20} /></button>
                </div>
              </div>
              <h1 className={`${isModal ? 'text-4xl md:text-5xl' : 'text-5xl md:text-6xl'} font-heading font-black text-funky-dark leading-tight`}>{product.name}</h1>
              <p className="text-xl font-medium text-gray-500">{product.subtitle}</p>
            </div>

            <div className="flex items-center gap-4 mb-8 p-4 bg-funky-light rounded-xl w-fit">
              <span className="text-3xl font-mono font-bold text-funky-dark">₹{product.price}</span>
              <div className="h-8 w-px bg-gray-300 mx-2"></div>
              <div className="flex items-center gap-1 text-funky-yellow">
                <Star size={20} fill="currentColor" />
                <span className="text-funky-dark font-bold">4.9</span>
                <span className="text-xs text-gray-400 font-medium ml-1">(128 reviews)</span>
              </div>
            </div>

            {/* Desktop Size Selector */}
            <div className="mb-8">
              <p className="font-bold text-sm uppercase text-gray-500 mb-3">Select Size</p>
              <div className="flex gap-3 flex-wrap">
                {product.variants.map((v) => (
                  <button
                    key={v.size}
                    onClick={() => { setSelectedSize(v.size); setQuantity(1); }}
                    disabled={v.stock === 0}
                    className={`px-6 py-3 rounded-lg font-bold border-2 transition-all relative ${selectedSize === v.size
                      ? 'border-funky-dark bg-funky-dark text-white'
                      : v.stock === 0
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                        : 'border-gray-200 text-gray-600 hover:border-funky-dark'
                      }`}
                  >
                    {v.size}
                    {v.stock === 0 && (
                      <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3">
                        <div className="bg-red-500 text-white text-[9px] px-1.5 rounded-full shadow-sm">SOLD</div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="prose prose-lg text-gray-600 font-body mb-8">
              <p>{product.description}</p>
            </div>

            <div className="space-y-4 mb-12">
              <div className="flex gap-4">
                {/* Quantity Desktop */}
                <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 px-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-gray-600 hover:text-funky-dark"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-8 text-center font-bold font-mono">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className={`p-3 text-gray-600 transition-colors ${quantity >= maxStockForSelection ? 'opacity-50 cursor-not-allowed' : 'hover:text-funky-dark'}`}
                    disabled={quantity >= maxStockForSelection}
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isSizeOutOfStock}
                  className={`flex-1 py-4 rounded-xl font-heading font-black text-lg shadow-xl uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2
                    ${isSizeOutOfStock
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                      : 'bg-funky-dark text-white hover:bg-funky-pink hover:scale-[1.02] active:scale-[0.98] shadow-funky-pink/20'
                    }`}
                >
                  {isSizeOutOfStock ? 'Sold Out' : <>Add to Cart <ShoppingBag size={20} /></>}
                </button>
              </div>

              {isSizeOutOfStock ? (
                <p className="text-center text-sm font-bold text-red-500 flex items-center justify-center gap-2">
                  <Box size={16} /> Selected size is currently out of stock.
                </p>
              ) : isLowStock ? (
                <p className="text-center text-sm font-bold text-funky-yellow flex items-center justify-center gap-2 animate-pulse">
                  <AlertTriangle size={16} /> Hurry! Only {maxStockForSelection} pairs left in this size!
                </p>
              ) : (
                <p className="text-center text-xs font-bold text-funky-green uppercase tracking-wide">
                  In Stock & Ready to Ship
                </p>
              )}
            </div>

            <div className="border-t-2 border-dashed border-gray-200 pt-8 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl mb-2">🧵</div>
                <p className="text-xs font-bold uppercase text-gray-500">Premium<br />Cotton</p>
              </div>
              <div>
                <div className="text-2xl mb-2">🇮🇳</div>
                <p className="text-xs font-bold uppercase text-gray-500">Made in<br />India</p>
              </div>
              <div>
                <div className="text-2xl mb-2">✨</div>
                <p className="text-xs font-bold uppercase text-gray-500">Super<br />Funky</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Desktop Cross Sell Section */}
      {!isModal && (
        <div className="px-6 py-20 border-t-4 border-gray-100 bg-funky-light">
          <h2 className="text-3xl font-heading font-black text-center mb-12 text-funky-dark">WE THINK YOU'LL DIG THESE</h2>
          <div className="grid grid-cols-3 gap-8">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <MobileLayout />
      <DesktopLayout />
    </>
  );
};

export default ProductDetails;