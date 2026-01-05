import React, { useState } from 'react';
import Hero from '../components/Hero';
import SectionHeader from '../components/SectionHeader';
import LogoTicker from '../components/LogoTicker';
import ProductHero from '../components/ProductHero';
import ShopHeader from '../components/ShopHeader';
import ProductCard from '../components/ProductCard';
import SustainabilitySection from '../components/SustainabilitySection';
import HappyFeetSection from '../components/HappyFeetSection';
import QuizSection from '../components/QuizSection';
import SEO from '../components/SEO';
import { generateOrganizationSchema, generateWebsiteSchema, generateBreadcrumbSchema } from '../utils/structuredData';
import { useProducts } from '../context/ProductContext';
import { Smile, ShieldCheck, Zap, Star, Anchor, Activity, Wind, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const Home: React.FC = () => {
  const { products, categories } = useProducts();

  // Structured data for homepage
  const structuredData = [
    generateOrganizationSchema(),
    generateWebsiteSchema(),
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://jumplings.in/' }
    ])
  ];

  return (
    <div className="animate-fade-in bg-white">
      <SEO
        title="Jumplings | Premium Funky Socks & Accessories Made in India"
        description="Discover Jumplings' collection of premium grip socks, yoga socks, and funky accessories. Designed for comfort and style. Made in India with organic materials. Shop now!"
        keywords="premium socks, grip socks, yoga socks, pilates socks, funky socks, made in india, organic cotton socks, non-slip socks, jumplings"
        type="website"
        structuredData={structuredData}
      />
      <Hero />

      {/* Enhanced Logo Ticker */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <LogoTicker />
      </motion.div>

      {/* Product Highlight Hero */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <ProductHero />
      </motion.div>

      {/* Shop Socks Section Header */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <SectionHeader title="Shop Socks" />
      </motion.div>

      {/* Main Grid */}
      <motion.section
        className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20"
        id="shop"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeInUp}
      >
        {products.length > 0 ? (
          <>
            {/* Grid Layout: 2 Columns on Mobile, 3 on Large Screens */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {products.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-funky-light rounded-3xl">
            <div className="text-6xl mb-4">🌵</div>
            <h3 className="font-heading font-bold text-xl text-funky-dark">No socks found here.</h3>
            <p className="text-gray-500">Check back soon!</p>
          </div>
        )}
      </motion.section>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <SustainabilitySection />
      </motion.div>

      {/* Shop Best Sellers Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <SectionHeader title="Shop Best Sellers" />
        <section className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </motion.div>

      {/* Quiz Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <QuizSection />
      </motion.div>

      {/* Happy Feet Section (Reviews) */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <HappyFeetSection />
      </motion.div>
    </div>
  );
};

export default Home;