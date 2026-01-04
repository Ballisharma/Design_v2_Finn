import React, { useMemo, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

const AllProducts: React.FC = () => {
  const { products, categories } = useProducts();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Group products by category
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, typeof products> = {};

    categories.forEach(category => {
      grouped[category] = products.filter(p =>
        p.categories ? p.categories.includes(category) : p.category === category
      );
    });

    return grouped;
  }, [products, categories]);

  return (
    <div className="min-h-screen bg-[#f7f7f7] animate-fade-in">
      {/* Header Section */}
      <div className="bg-white pt-32 pb-16 px-6 text-center">
        <h1 className="font-heading font-black text-5xl md:text-7xl text-[#131B3E] mb-4">
          Our Products
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Browse our complete collection of premium socks designed for comfort and style.
        </p>
      </div>

      {/* Category Sections */}
      <div className="pb-20">
        {categories.map((category, index) => {
          const categoryProducts = productsByCategory[category];

          if (!categoryProducts || categoryProducts.length === 0) {
            return null;
          }

          return (
            <section key={category} className="py-16 md:py-20">
              {/* Category Header - Centered */}
              <div className="text-center mb-12 md:mb-16">
                <h2 className="font-heading font-black text-4xl md:text-5xl text-[#131B3E]">
                  {category}
                </h2>
              </div>

              {/* Product Grid */}
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                  {categoryProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-20 px-6">
            <div className="text-6xl mb-4">🧦</div>
            <h3 className="font-heading font-black text-2xl text-[#131B3E] mb-2">
              No products available
            </h3>
            <p className="text-gray-500">
              Check back soon for new arrivals!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;