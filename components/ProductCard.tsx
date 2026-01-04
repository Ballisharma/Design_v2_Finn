import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Product } from '../types';
import { getOptimizedImageProps } from '../utils/imageOptimization';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const location = useLocation();

  // Calculate if out of stock
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  const isOutOfStock = totalStock === 0;

  return (
    <Link
      to={`/product/${product.id}`}
      state={{ background: location }}
      className="group block"
    >
      <div className="flex flex-col items-center text-center">
        {/* Rounded Image Container - PetFinn Style */}
        <div className="relative w-full aspect-square bg-[#EFEFEF] rounded-[24px] mb-4 overflow-hidden">
          <img
            {...getOptimizedImageProps(product.images[0], product.name, {
              sizes: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
            })}
            className="w-full h-full object-cover p-6 group-hover:scale-105 transition-transform duration-500"
          />

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="bg-white text-funky-dark font-heading font-black text-sm px-4 py-2 rounded-full">
                OUT OF STOCK
              </span>
            </div>
          )}

          {/* New Badge */}
          {product.isNew && !isOutOfStock && (
            <div className="absolute top-4 right-4 bg-[#FD812E] text-white font-heading font-black text-xs px-3 py-1.5 rounded-full">
              NEW
            </div>
          )}
        </div>

        {/* Product Title - Bold Navy */}
        <h3 className="font-heading font-bold text-lg md:text-xl text-[#131B3E] mb-2 px-2">
          {product.name}
        </h3>

        {/* Price - Terracotta Orange */}
        <p className="font-heading font-bold text-2xl text-[#FD812E] mb-3">
          ₹{product.price}
        </p>

        {/* Description - Light Gray */}
        <p className="text-sm text-gray-500 mb-6 px-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Shop Now Button - Navy Pill */}
        <button
          className="inline-flex items-center gap-2 bg-[#131B3E] text-white font-heading font-bold text-sm px-8 py-3 rounded-full hover:bg-[#1a2452] transition-all duration-300 group-hover:gap-3"
          onClick={(e) => {
            // Let Link handle navigation
            e.stopPropagation();
          }}
        >
          Shop Now
          <ArrowRight size={16} className="transition-transform" />
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;