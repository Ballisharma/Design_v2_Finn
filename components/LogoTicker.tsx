import React from 'react';

const logos = [
    { name: "Vogue", style: "font-serif italic font-light text-3xl md:text-4xl tracking-wider" },
    { name: "GQ", style: "font-serif font-black text-3xl md:text-4xl tracking-tighter" },
    { name: "WIRED", style: "font-sans font-bold text-2xl md:text-3xl tracking-tight uppercase" },
    { name: "Esquire", style: "font-serif italic font-medium text-2xl md:text-3xl tracking-wide" },
    { name: "ELLE", style: "font-sans font-black text-3xl md:text-4xl tracking-widest" },
    { name: "Hypebeast", style: "font-sans font-bold text-xl md:text-2xl tracking-tight uppercase" },
];

const LogoTicker: React.FC = () => {
    return (
        <div className="w-full bg-gradient-to-r from-gray-50 via-white to-gray-50 py-12 md:py-16 border-y border-gray-100 overflow-hidden">
            <div className="relative">
                {/* Subtle "As Featured In" text */}
                <div className="text-center mb-6">
                    <p className="text-xs md:text-sm font-mono uppercase tracking-widest text-gray-400 font-semibold">
                        As Featured In
                    </p>
                </div>

                {/* Scrolling logos container */}
                <div className="relative overflow-hidden">
                    {/* Gradient overlays for fade effect */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                    <div className="flex">
                        {/* First set of logos */}
                        <div className="flex shrink-0 gap-12 md:gap-16 lg:gap-20 animate-infinite-scroll items-center px-8">
                            {logos.map((logo, index) => (
                                <div
                                    key={`set1-${index}`}
                                    className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-default select-none text-gray-800 whitespace-nowrap"
                                >
                                    <span className={logo.style}>{logo.name}</span>
                                </div>
                            ))}
                        </div>

                        {/* Duplicate set for seamless loop */}
                        <div className="flex shrink-0 gap-12 md:gap-16 lg:gap-20 animate-infinite-scroll items-center px-8" aria-hidden="true">
                            {logos.map((logo, index) => (
                                <div
                                    key={`set2-${index}`}
                                    className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-default select-none text-gray-800 whitespace-nowrap"
                                >
                                    <span className={logo.style}>{logo.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoTicker;
