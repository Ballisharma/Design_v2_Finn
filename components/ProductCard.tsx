import React, { useState } from 'react';
import { Product } from '../types';
import { Plus, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const location = useLocation();
  const [showSizeSelect, setShowSizeSelect] = useState(false);
  const isOutOfStock = product.stock === 0;

  const handleQuickAddClick = (e: React.MouseEvent) => {
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

  return (
    <div className={`group relative ${isOutOfStock ? 'opacity-80' : ''}`} onMouseLeave={() => setShowSizeSelect(false)}>
      <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] bg-gray-50 group-hover:shadow-xl transition-all duration-500">

        {/* Background color blob based on product color - subtly visible */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
          style={{ backgroundColor: product.colorHex || '#f0f0f0' }}
        />

        <Link to={`/product/${product.id}`} state={{ background: location }}>
          {/* Main Image with Zoom Effect */}
          <div className="w-full h-full overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              className={`h-full w-full object-cover object-center transition-transform duration-700 ease-out ${!isOutOfStock && 'group-hover:scale-110'} ${isOutOfStock ? 'grayscale' : ''}`}
            />
          </div>
        </Link>

        {/* Sold Out Overlay - Clean & Minimal */}
        {isOutOfStock && (
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-black text-white px-3 py-1 font-heading font-bold text-xs tracking-wider rounded-full">
              SOLD OUT
            </span>
          </div>
        )}

        {/* Size Selector Overlay */}
        {showSizeSelect && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-4 animate-fade-in">
            <button
              onClick={closeSizeSelect}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black bg-gray-100 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
            <h4 className="font-heading font-bold text-black mb-4 uppercase text-xs tracking-widest">Select Size</h4>
            <div className="grid grid-cols-2 gap-2 w-full max-w-[200px]">
              {product.variants.map(v => (
                <button
                  key={v.size}
                  onClick={(e) => handleSizeClick(e, v.size)}
                  disabled={v.stock === 0}
                  className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all ${v.stock === 0
                    ? 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50'
                    : 'border-gray-200 text-black hover:bg-black hover:text-white hover:border-black'
                    }`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Add Button - Premium Floating Action */}
        {!isOutOfStock && !showSizeSelect && (
          <button
            onClick={handleQuickAddClick}
            className="absolute bottom-4 right-4 w-10 h-10 md:w-12 md:h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:bg-black hover:text-white transition-all duration-300 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 z-20"
            title="Add to Cart"
          >
            <Plus size={20} className="md:w-6 md:h-6" strokeWidth={2} />
          </button>
        )}

        {/* Category Tag - Hidden on hover for cleaner look */}
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-black text-[10px] font-bold px-3 py-1 rounded-full border border-gray-100 shadow-sm z-10 pointer-events-none transition-opacity duration-300 group-hover:opacity-0">
          {product.category}
        </span>
      </div>

      {/* Product Details - Clean Layout */}
      <div className="mt-4 space-y-1">
        <div className="flex justify-between items-start gap-2">
          <Link to={`/product/${product.id}`} state={{ background: location }} className="block flex-1 group/link">
            <h3 className="text-base md:text-lg font-heading font-bold text-funky-dark group-hover/link:text-gray-600 transition-colors leading-tight">
              {product.name}
            </h3>
          </Link>
          <p className="text-base md:text-lg font-bold font-mono text-funky-dark shrink-0">₹{product.price}</p>
        </div>

        <p className="text-xs md:text-sm text-gray-500 font-medium truncate">{product.subtitle}</p>

        {product.stock > 0 && product.stock <= 5 && (
          <p className="text-[10px] md:text-xs font-bold text-[#FF8800] pt-1">
            Low stock: {product.stock} left
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;