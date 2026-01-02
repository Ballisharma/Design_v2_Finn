import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ShopHeader: React.FC = () => {
    return (
        <div className="w-full bg-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <h2 className="font-heading font-medium text-funky-dark text-5xl md:text-7xl tracking-tight">
                    Shop Socks
                </h2>
                <Link
                    to="/shop"
                    className="group flex items-center gap-2 px-6 py-3 rounded-full border border-gray-300 text-funky-dark font-heading font-bold text-sm md:text-base hover:border-funky-dark transition-all"
                >
                    {/* The reference uses a simple 'Shop Now ->' style */}
                    Shop Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
};

export default ShopHeader;
