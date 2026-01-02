import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SustainabilitySection: React.FC = () => {
    return (
        <section className="w-full bg-white overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left Side - Text Content */}
                <div className="px-8 md:px-16 lg:px-24 py-20 md:py-28 lg:py-32 flex flex-col justify-center">
                    <h2 className="font-heading font-medium text-[#1a2b4a] text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-8">
                        We're Certified<br />
                        Eco-Friendly
                    </h2>

                    <div className="flex items-center gap-3 mb-8">
                        <span className="text-base md:text-lg text-gray-700">in partnership with</span>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#1a2b4a] flex items-center justify-center">
                                <span className="text-white text-sm">♻</span>
                            </div>
                            <span className="font-semibold text-[#1a2b4a] text-base md:text-lg">EcoThread</span>
                        </div>
                    </div>

                    <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
                        Discover how we're striving to make the world a better place through our sustainability initiatives and eco-friendly sock production.
                    </p>

                    <div>
                        <Link
                            to="/sustainability"
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 border-gray-300 text-[#1a2b4a] font-heading font-semibold text-base md:text-lg hover:border-[#1a2b4a] hover:bg-gray-50 transition-all group"
                        >
                            Learn more
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Right Side - Full Width Image */}
                <div className="relative h-[400px] md:h-full min-h-[400px]">
                    {/* Placeholder with gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-green-100 to-green-200">
                        {/* Centered content */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 mx-auto rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                    <span className="text-4xl">🌱</span>
                                </div>
                                <p className="text-green-800 font-heading font-semibold text-lg px-4">
                                    Eco-Friendly Socks
                                </p>
                            </div>
                        </div>

                        {/* Subtle texture overlay */}
                        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SustainabilitySection;
