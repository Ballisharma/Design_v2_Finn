import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SectionHeaderProps {
    title: string;
    ctaText?: string;
    ctaLink?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    ctaText = "Shop Now",
    ctaLink = "/shop"
}) => {
    return (
        <div className="w-full bg-white py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-6 flex flex-row items-center justify-between gap-6">
                {/* Large Title - Navy Blue */}
                <h2 className="font-heading font-medium text-[#1a2b4a] text-5xl md:text-7xl lg:text-8xl tracking-tight leading-none">
                    {title}
                </h2>

                {/* Pill Button */}
                <Link
                    to={ctaLink}
                    className="shrink-0 group flex items-center gap-2 px-6 md:px-8 py-3 md:py-3.5 rounded-full border-2 border-gray-300 text-[#1a2b4a] font-heading font-semibold text-sm md:text-base hover:border-[#1a2b4a] hover:bg-gray-50 transition-all whitespace-nowrap"
                >
                    {ctaText}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
};

export default SectionHeader;
