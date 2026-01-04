import React from 'react';
import { Star } from 'lucide-react';
import { getOptimizedImageProps } from '../utils/imageOptimization';

const HappyFeetSection: React.FC = () => {
    const reviews = [
        {
            name: "Desiree B.",
            text: "I replaced my entire sock drawer with Jumplings. The comfort level is unmatched, and I actually get compliments on my ankles now? Weird but cool.",
        },
        {
            name: "Dev R.",
            text: "I was skeptical about 'premium' socks, but these don't slip down inside my sneakers. That alone is worth double the price. Finally!",
        },
        {
            name: "Lindsey M.",
            text: "Bought the 'Neon Dream' pack for my boyfriend. He refused to wear anything else for a week straight. I had to intervene for hygiene reasons. 10/10.",
        },
        {
            name: "Caleb P.",
            text: "I've been looking for socks that are colorful but not childish. Jumplings nailed it. The quality holds up after 20+ washes too.",
        }
    ];

    return (
        <section className="w-full bg-white relative">
            {/* Heading - Overlapping Section */}
            <div className="w-full text-center pt-20 pb-12 bg-white relative z-10">
                <h2 className="font-heading font-black text-funky-dark text-6xl md:text-7xl lg:text-9xl leading-none tracking-tighter">
                    Worth Walking About
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[800px]">
                {/* Left Side - Image */}
                <div className="relative h-[500px] lg:h-auto">
                    <img
                        {...getOptimizedImageProps(
                            'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop',
                            'Happy customer with stylish socks',
                            { sizes: '(max-width: 1024px) 100vw, 50vw' }
                        )}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Overlay to subtly darken/tint if needed */}
                    <div className="absolute inset-0 bg-funky-dark/5"></div>
                </div>

                {/* Right Side - Reviews */}
                <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 lg:py-0 bg-white">
                    <div className="space-y-12">
                        {reviews.map((review, index) => (
                            <div key={index} className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} size={18} className="fill-[#FF8800] text-[#FF8800]" />
                                        ))}
                                    </div>
                                    <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">{review.name}</span>
                                </div>
                                <p className="font-body text-funky-dark text-lg leading-relaxed opacity-90">
                                    "{review.text}"
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HappyFeetSection;
