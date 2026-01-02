import React from 'react';

const logos = [
    { name: "The Dodo", type: "img", file: "https://logo.clearbit.com/thedodo.com" },
    { name: "Forbes", type: "text", style: "font-serif font-black text-2xl md:text-3xl tracking-tighter" },
    { name: "TRAVEL+LEISURE", type: "text", style: "font-serif font-bold text-lg md:text-xl tracking-widest uppercase" },
    { name: "Great Pet", type: "text", style: "font-heading font-black text-xl md:text-2xl tracking-tight" },
    { name: "The Dodo", type: "text", style: "font-heading font-black text-2xl md:text-3xl tracking-tight text-[#1C1C1E]" }, // Fallback text version
];

// Using a mix of text styles to reliably mimic the logos without broken images
const LogoTicker: React.FC = () => {
    return (
        <div className="w-full bg-[#DDEEFF] py-10 border-y-0 overflow-hidden">
            <div className="max-w-[100vw] mx-auto relative overflow-hidden">
                <div className="flex gap-16 md:gap-24 w-max animate-infinite-scroll hover:[animation-play-state:paused] items-center">
                    {[...logos, ...logos, ...logos, ...logos].map((logo, index) => (
                        <div key={index} className="flex items-center justify-center opacity-80 hover:opacity-100 transition-all cursor-default select-none text-funky-dark mix-blend-multiply">
                            {logo.name === "The Dodo" && index % 5 === 0 ? (
                                // Attempting one reliable icon for variety, else text
                                <div className="flex items-center gap-2 font-heading font-black text-2xl md:text-3xl tracking-tight">
                                    <div className="w-8 h-8 rounded-full bg-[#1C1C1E] flex items-center justify-center text-white text-xs overflow-hidden">
                                        <img src="https://logo.clearbit.com/thedodo.com" alt="" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                    </div>
                                    The Dodo
                                </div>
                            ) : (
                                <span className={logo.style}>{logo.name}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LogoTicker;
