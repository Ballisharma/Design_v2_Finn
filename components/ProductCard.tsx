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
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-funky-light border-2 border-transparent group-hover:border-funky-dark/10 transition-all">
        {/* Background color blob based on product color */}
        <div 
          className="absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20"
          style={{ backgroundColor: product.colorHex || '#f0f0f0' }}
        />
        
        <Link to={`/product/${product.id}`} state={{ background: location }}>
          <img
            src={product.images[0]}
            alt={product.name}
            className={`h-full w-full object-cover object-center transition-transform duration-500 ${!isOutOfStock && 'group-hover:scale-110 group-hover:rotate-1'} ${isOutOfStock ? 'grayscale' : ''}`}
          />
        </Link>

        {/* Sold Out Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-10 pointer-events-none">
            <span className="bg-black/90 text-white px-3 py-1 md:px-4 md:py-2 font-heading font-black tracking-wider text-sm md:text-xl transform -rotate-12 border-2 border-white shadow-xl">
              SOLD OUT
            </span>
          </div>
        )}

        {/* Size Selector Overlay */}
        {showSizeSelect && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-4 animate-fade-in">
                <button 
                    onClick={closeSizeSelect}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-funky-dark bg-gray-100 rounded-full"
                >
                    <X size={16} />
                </button>
                <h4 className="font-heading font-bold text-funky-dark mb-3 uppercase text-xs tracking-wider">Select Size</h4>
                <div className="grid grid-cols-2 gap-2 w-full max-w-[200px]">
                    {product.variants.map(v => (
                        <button
                            key={v.size}
                            onClick={(e) => handleSizeClick(e, v.size)}
                            disabled={v.stock === 0}
                            className={`px-2 py-2 text-xs font-bold rounded-lg border-2 transition-all ${
                                v.stock === 0 
                                ? 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50'
                                : 'border-funky-dark text-funky-dark hover:bg-funky-dark hover:text-white'
                            }`}
                        >
                            {v.size}
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* Quick Add Button - Hidden if Out of Stock or if Size Select is showing */}
        {!isOutOfStock && !showSizeSelect && (
          <button 
            onClick={handleQuickAddClick}
            className="absolute bottom-2 right-2 md:bottom-4 md:right-4 w-9 h-9 md:w-12 md:h-12 bg-white text-funky-dark rounded-full flex items-center justify-center shadow-lg hover:bg-funky-pink hover:text-white transition-all transform hover:scale-110 active:scale-90 md:translate-y-16 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 z-20"
            title="Add to Cart"
          >
            <Plus size={18} className="md:w-6 md:h-6" strokeWidth={3} />
          </button>
        )}
        
        {/* Category Tag */}
        <span className="absolute top-2 left-2 md:top-4 md:left-4 bg-white/90 backdrop-blur text-funky-dark text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-gray-100 shadow-sm z-10 pointer-events-none">
          {product.category}
        </span>
      </div>

      <div className="mt-2 md:mt-4 space-y-0.5 md:space-y-1">
        <Link to={`/product/${product.id}`} state={{ background: location }} className="block">
          <h3 className="text-sm md:text-xl font-heading font-bold text-funky-dark group-hover:text-funky-blue transition-colors truncate leading-tight">
            {product.name}
          </h3>
        </Link>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <p className="text-[10px] md:text-sm text-gray-500 font-body truncate">{product.subtitle}</p>
          <p className="text-sm md:text-lg font-bold font-mono text-funky-dark">₹{product.price}</p>
        </div>
        {product.stock > 0 && product.stock <= 5 && (
           <p className="text-[10px] md:text-xs font-bold text-funky-pink animate-pulse">
             Only {product.stock} left!
           </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;