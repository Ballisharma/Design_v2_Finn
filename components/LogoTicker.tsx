import React from 'react';

const logos = [
    { name: "Vogue", file: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Vogue_logo.svg" },
    { name: "GQ", file: "https://upload.wikimedia.org/wikipedia/commons/9/92/GQ_magazine_logo.svg" },
    { name: "Forbes", file: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Forbes_logo.svg" },
    { name: "Hypebeast", file: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Hypebeast_Logo.svg" },
    { name: "Esquire", file: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Esquire_logo.svg" },
    { name: "Vanity Fair", file: "https://upload.wikimedia.org/wikipedia/commons/7/77/Vanity_Fair_logo.svg" },
];

const LogoTicker: React.FC = () => {
    return (
        <div className="py-8 md:py-12 bg-funky-light border-y border-funky-dark/5 overflow-hidden">
            <div className="bg-transparent relative w-full overflow-hidden">
                {/* Gradient Masks */}
                <div className="absolute top-0 left-0 h-full w-20 md:w-32 bg-gradient-to-r from-funky-light to-transparent z-10"></div>
                <div className="absolute top-0 right-0 h-full w-20 md:w-32 bg-gradient-to-l from-funky-light to-transparent z-10"></div>

                <div className="flex gap-12 md:gap-24 w-max animate-infinite-scroll hover:[animation-play-state:paused]">
                    {[...logos, ...logos, ...logos].map((logo, index) => (
                        <div key={index} className="flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                            <img
                                src={logo.file}
                                alt={logo.name}
                                className="h-6 md:h-8 w-auto object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LogoTicker;
