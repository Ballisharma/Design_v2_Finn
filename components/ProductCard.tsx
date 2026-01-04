import React, { useState } from 'react';
import { Product } from '../types';
import { Heart, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const location = useLocation();
  const [showSizeSelect, setShowSizeSelect] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const isOutOfStock = product.stock === 0;

  const handleBuyNowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const inStockVariants = product.variants.filter(v => v.stock > 0);

    if (inStockVariants.length === 0) {
      return;
    }

    // If only 1 option (e.g. Free Size), add immediately
    if (inStockVariants.length === 1) {
      addVariantToCart(inStockVariants[0].size);
    } else {
      // Show selection overlay if multiple sizes exist
      setShowSizeSelect(true);
    }
  };

  const addVariantToCart = (size: string) => {
    addToCart(product, 1, size);
    setShowSizeSelect(false);

    // Show toast
    const banner = document.createElement('div');
    banner.innerText = `ADDED ${size === 'Free Size' ? '' : size + ' '}TO CART! 🛒`;
    banner.className = "fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-funky-dark text-white px-6 py-3 rounded-full font-heading font-bold shadow-xl z-[100] animate-bounce";
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 2000);
  };

  const handleSizeClick = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    addVariantToCart(size);
  };

  const closeSizeSelect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSizeSelect(false);
  }

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  }

  return (
    <div className={`group relative ${isOutOfStock ? 'opacity-60' : ''}`} onMouseLeave={() => setShowSizeSelect(false)}>
      {/* Card Container - Premium White Border */}
      <div className="relative bg-white p-3 md:p-5 rounded-2xl md:rounded-[3rem] shadow-md hover:shadow-xl transition-all duration-500 border border-gray-200">

        {/* Image Section - Square aspect ratio */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl md:rounded-[2.5rem] bg-gray-50 mb-4 md:mb-5">

          <Link to={`/product/${product.id}`} state={{ background: location }} className="block h-full">
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              className={`h-full w-full object-cover object-center transition-transform duration-700 ease-out ${!isOutOfStock && 'group-hover:scale-105'} ${isOutOfStock ? 'grayscale' : ''}`}
            />
          </Link>

          {/* Sold Out Badge */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
              <span className="bg-white text-funky-dark px-6 py-2 font-heading font-bold text-sm tracking-wider rounded-full">
                SOLD OUT
              </span>
            </div>
          )}

          {/* Carousel Dots - Bottom Center */}
          {product.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {product.images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${idx === 0 ? 'bg-white w-4' : 'bg-white/50'}`}
                />
              ))}
            </div>
          )}

          {/* Size Selector Overlay */}
          {showSizeSelect && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 animate-fade-in rounded-[1.5rem] md:rounded-[2rem]">
              <button
                onClick={closeSizeSelect}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black bg-gray-100 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
              <h4 className="font-heading font-bold text-funky-dark mb-4 uppercase text-xs tracking-widest">Select Size</h4>
              <div className="grid grid-cols-2 gap-3 w-full max-w-[220px]">
                {product.variants.map(v => (
                  <button
                    key={v.size}
                    onClick={(e) => handleSizeClick(e, v.size)}
                    disabled={v.stock === 0}
                    className={`px-4 py-3 text-sm font-bold rounded-xl border-2 transition-all ${v.stock === 0
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                      : 'border-funky-dark text-funky-dark hover:bg-funky-dark hover:text-white'
                      }`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Info Section - Clean Premium Layout */}
        <div className="space-y-3 md:space-y-4">
          {/* Title - Fixed height for grid alignment */}
          <Link to={`/product/${product.id}`} state={{ background: location }}>
            <div className="min-h-[3rem] md:min-h-0">
              <h3 className="text-funky-dark font-heading font-bold text-base md:text-xl leading-tight hover:text-gray-600 transition-colors line-clamp-2">
                {product.name}
              </h3>
            </div>
          </Link>

          {/* Price and Button Row */}
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-funky-blue font-bold text-xl md:text-3xl font-heading">
                ₹{product.price}
              </p>
            </div>

            {/* Buy Now Button */}
            {!isOutOfStock ? (
              <button
                onClick={handleBuyNowClick}
                className="flex-1 bg-funky-dark text-white px-4 md:px-8 py-3 md:py-4 rounded-full font-heading font-bold text-sm md:text-base hover:bg-funky-pink transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                Buy Now
              </button>
            ) : (
              <button
                disabled
                className="flex-1 bg-gray-200 text-gray-400 px-6 py-2.5 md:py-3 rounded-full font-heading font-bold text-xs md:text-sm cursor-not-allowed"
              >
                Sold Out
              </button>
            )}
          </div>

          {/* Low Stock Warning */}
          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-[10px] md:text-xs font-bold text-funky-pink">
              Only {product.stock} left!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;