import React, { useState, useMemo, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { Filter, ArrowUpDown, Search } from 'lucide-react';

const AllProducts: React.FC = () => {
  const { products, categories } = useProducts();
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');

  // Ensure 'All' is always first
  const allCategories = ['All', ...categories];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }

    // Filter by Search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
      );
    }

    // Sort logic
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // Sort by isNew flag first
        result.sort((a, b) => (b.isNew === a.isNew ? 0 : b.isNew ? 1 : -1));
        break;
      default: // featured
        // Keep default order (as per array)
        break;
    }

    return result;
  }, [products, activeCategory, sortBy, searchQuery]);

  return (
    <div className="min-h-screen bg-[#fafafa] animate-fade-in pb-20">
      {/* Header */}
      <div className="bg-funky-light pt-32 pb-16 px-6 text-center border-b-4 border-funky-dark/5">
        <h1 className="font-heading font-black text-5xl md:text-7xl text-funky-dark mb-4">THE FULL STASH 🧦</h1>
        <p className="font-mono text-gray-500 max-w-xl mx-auto text-lg">
          Every single pair of funky goodness we have. Dig in.
        </p>
      </div>

      {/* Toolbar - Sticky */}
      <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 py-4 px-6 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-center">

          {/* Filters - Scrollable on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide no-scrollbar">
            <span className="flex items-center gap-1 font-bold text-xs uppercase tracking-wider text-gray-400 mr-2 shrink-0">
              <Filter size={14} /> Filter:
            </span>
            {allCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border-2 ${activeCategory === cat
                  ? 'bg-funky-dark text-white border-funky-dark shadow-md'
                  : 'bg-white text-gray-600 border-gray-100 hover:border-funky-dark hover:text-funky-dark'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search socks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm font-bold focus:outline-none focus:border-funky-blue focus:ring-2 focus:ring-funky-blue/20 transition-all placeholder-gray-400 text-funky-dark"
              />
            </div>

            {/* Sort */}
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-2 text-sm font-bold text-funky-dark cursor-pointer hover:border-funky-dark focus:outline-none focus:border-funky-blue h-full"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="text-6xl mb-4">🌵</div>
            <h3 className="font-heading font-black text-2xl text-funky-dark mb-2">No socks match your vibe.</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
            <button
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              className="mt-6 px-6 py-3 bg-funky-blue text-white rounded-xl font-bold hover:bg-funky-dark transition-colors shadow-lg"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;