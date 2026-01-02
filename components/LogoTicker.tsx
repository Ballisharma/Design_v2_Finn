import React from 'react';

// Using the same style logos as reference (The Dodo, Travel+Leisure, Forbes, Great Pet)
const logos = [
    { name: "The Dodo", file: "https://upload.wikimedia.org/wikipedia/commons/6/66/The_Dodo_Logo.png" }, // Trying to find real ones or close match
    { name: "Forbes", file: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Forbes_logo.svg" },
    { name: "Travel + Leisure", file: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Travel_%2B_Leisure_loogo.svg/2560px-Travel_%2B_Leisure_loogo.svg.png" },
    { name: "Great Pet", file: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Petco_logo.svg/2560px-Petco_logo.svg.png" }, // Placeholder for Great Pet
];

const LogoTicker: React.FC = () => {
    return (
        <div className="w-full bg-[#DDEEFF] py-8 border-y-0 overflow-hidden">
            {/* Reference image shows a light blue bar (#DDEEFF likely matches the second slide color) */}

            <div className="max-w-[100vw] mx-auto relative overflow-hidden">
                <div className="flex gap-16 md:gap-24 w-max animate-infinite-scroll hover:[animation-play-state:paused] items-center">
                    {/* Duplicating list multiple times for smooth infinite scroll */}
                    {[...logos, ...logos, ...logos, ...logos].map((logo, index) => (
                        <div key={index} className="flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity grayscale-0">
                            {/* Logos in reference are dark blue / colored, not grayscale */}
                            <img
                                src={logo.file}
                                alt={logo.name}
                                className="h-8 md:h-10 w-auto object-contain mix-blend-multiply"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LogoTicker;
