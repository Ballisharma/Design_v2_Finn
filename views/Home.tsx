import React, { useState } from 'react';
import Hero from '../components/Hero';
import SectionHeader from '../components/SectionHeader';
import LogoTicker from '../components/LogoTicker';
import ProductHero from '../components/ProductHero';
import ShopHeader from '../components/ShopHeader';
import ProductCard from '../components/ProductCard';
import SustainabilitySection from '../components/SustainabilitySection';
import { useProducts } from '../context/ProductContext';
import { Smile, ShieldCheck, Zap, Star, ArrowDown, Anchor, Activity, Wind, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { products, categories } = useProducts();
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Dynamic filters from context
  const filters = ['All', ...categories];

  const filteredProducts = activeFilter === 'All'
    ? products
    : products.filter(p => p.category === activeFilter);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  return (
    <div className="animate-fade-in bg-white">
      <Hero />

      {/* Enhanced Logo Ticker */}
      <LogoTicker />

      {/* Product Highlight Hero */}
      <ProductHero />

      {/* Shop Socks Section Header */}
      <SectionHeader title="Shop Socks" />

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20" id="shop">
        <div className="flex flex-col md:flex-row justify-end items-end mb-8 md:mb-12 gap-4">
          <div className="flex flex-wrap gap-2">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  setVisibleCount(6); // Reset on filter change
                }}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-bold transition-colors border-2 ${activeFilter === filter
                  ? 'bg-funky-dark text-white border-funky-dark shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]'
                  : 'bg-white text-funky-dark border-gray-100 hover:border-funky-dark hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {visibleProducts.length > 0 ? (
          <>
            {/* Grid Layout: 2 Columns on Mobile, 3 on Large Screens */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-y-12 md:gap-x-8">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-12 md:mt-16 text-center">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-3 md:px-8 bg-white border-2 border-funky-dark text-funky-dark font-heading font-bold rounded-xl hover:bg-funky-dark hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(7,59,76,1)] active:shadow-none active:translate-x-1 active:translate-y-1 flex items-center gap-2 mx-auto text-sm md:text-base"
                >
                  LOAD MORE SOCKS <ArrowDown size={18} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-funky-light rounded-3xl">
            <div className="text-6xl mb-4">🌵</div>
            <h3 className="font-heading font-bold text-xl text-funky-dark">No socks found here.</h3>
            <p className="text-gray-500">Try a different category!</p>
          </div>
        )}
      </section>

      <SustainabilitySection />

      {/* Shop Best Sellers Section */}
      <SectionHeader title="Shop Best Sellers" />
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;