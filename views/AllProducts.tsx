import React, { useMemo, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { generateCollectionPageSchema, generateBreadcrumbSchema } from '../utils/structuredData';

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

  // Sort categories by product count (descending)
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      const countA = productsByCategory[a]?.length || 0;
      const countB = productsByCategory[b]?.length || 0;
      return countB - countA;
    });
  }, [categories, productsByCategory]);

  // Structured data
  const structuredData = [
    generateCollectionPageSchema(
      'All Products - Jumplings',
      'Browse our complete collection of premium socks including grip socks, yoga socks, and more.',
      'https://jumplings.in/shop'
    ),
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://jumplings.in/' },
      { name: 'Shop', url: 'https://jumplings.in/shop' }
    ])
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f7] animate-fade-in">
      <SEO
        title="Shop All Products | Jumplings Premium Socks & Accessories"
        description="Browse our complete collection of premium socks. Find grip socks for yoga and pilates, funky everyday socks, and more. Comfortable, stylish, and sustainable. Made in India."
        keywords="buy socks online, shop grip socks, yoga socks, pilates socks, premium socks india"
        type="website"
        structuredData={structuredData}
      />
      {/* Header Section with Background Image */}
      <div className="relative w-full h-[400px] flex flex-col justify-center items-center text-center px-6 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop"
            alt="Jumplings Socks Collection"
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <h1 className="font-heading font-black text-5xl md:text-7xl text-white tracking-tight drop-shadow-lg">
            Our Products
          </h1>
          <p className="text-gray-100 max-w-2xl mx-auto text-lg md:text-xl font-medium drop-shadow-md">
            Browse our complete collection of premium socks designed for comfort and style.
          </p>
        </div>
      </div>

      {/* Category Sections */}
      <div className="pb-20">
        {sortedCategories.map((category, index) => {
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
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
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