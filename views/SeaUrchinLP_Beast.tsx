import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
    Star,
    ShieldCheck,
    Truck,
    Clock,
    Zap,
    CheckCircle2,
    ChevronRight,
    Flame,
    User,
    AlertCircle
} from 'lucide-react';

// Pricing Configuration
const PRICE = 1499;
const ORIGINAL_PRICE = 3999;
const DISCOUNT = 62;

// Generated Asset Paths (Beast Mode)
const IMAGES = {
    hero: '/images/beast/hero.png',
    texture: '/images/beast/texture.png',
    lifestyle: '/images/beast/lifestyle.png',
    tech: '/images/beast/tech.png'
};

const SeaUrchinLP_Beast: React.FC = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [timeLeft, setTimeLeft] = useState(14 * 60 + 59); // 15 mins countdown

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 14 * 60 + 59));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleAddToCart = () => {
        const product = {
            id: 'sea-urchin-lamp-beast',
            name: 'Sea Urchin Lamp (Pro Edition)',
            subtitle: 'Limited Beast Mode Edition',
            slug: 'sea-urchin-lamp-beast',
            price: PRICE,
            currency: 'INR',
            images: [IMAGES.hero],
            description: 'Pro Edition Sea Urchin Lamp',
            category: 'Lamps',
            categories: ['Lamps', 'Premium'],
            tags: ['Beast Mode', 'Limited'],
            stock: 50,
            variants: [{ size: 'Standard', stock: 50 }]
        };

        addToCart(product as any, 1, 'Standard', 'landing-page', 'SeaUrchinLP_Beast');
        navigate('/checkout');
    };

    return (
        <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-amber-500 selection:text-black">

            {/* 1. Urgency Top Bar */}
            <div className="bg-amber-600 text-black font-bold text-xs md:text-sm py-2 px-4 text-center tracking-wide uppercase flex justify-center items-center gap-2">
                <Flame size={14} className="fill-black animate-pulse" />
                <span>High Demand: 95% of orders ship within 24 hours</span>
                <span className="hidden md:inline">| Sale ends in {formatTime(timeLeft)}</span>
            </div>

            <div className="max-w-7xl mx-auto md:grid md:grid-cols-2">

                {/* 2. Left Column: Visuals (Sticky on Desktop) */}
                <div className="relative md:sticky md:top-0 md:h-screen md:overflow-y-auto bg-[#0a0a0a]">
                    {/* Main Hero Image */}
                    <div className="relative aspect-square md:aspect-auto md:h-[80vh] w-full group overflow-hidden">
                        <img
                            src={IMAGES.hero}
                            alt="Sea Urchin Lamp Beast Mode"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60"></div>
                    </div>

                    {/* Gallery Strip (Mobile Only) */}
                    <div className="flex md:hidden overflow-x-auto gap-2 p-4 snap-x bg-[#050505]">
                        {[IMAGES.texture, IMAGES.lifestyle, IMAGES.tech].map((img, i) => (
                            <img key={i} src={img} className="w-24 h-24 object-cover rounded-lg border border-gray-800 snap-center shrink-0" alt="Detail" />
                        ))}
                    </div>

                    {/* Desktop Gallery Detail Row */}
                    <div className="hidden md:grid grid-cols-3 gap-0.5 border-t border-gray-900">
                        <div className="relative aspect-square group overflow-hidden">
                            <img src={IMAGES.texture} className="w-full h-full object-cover hover:opacity-80 transition-opacity" alt="Texture" />
                            <div className="absolute bottom-2 left-2 text-[10px] font-bold uppercase tracking-widest bg-black/50 backdrop-blur-md px-2 py-1 rounded">Laser Cut</div>
                        </div>
                        <div className="relative aspect-square group overflow-hidden">
                            <img src={IMAGES.lifestyle} className="w-full h-full object-cover hover:opacity-80 transition-opacity" alt="Lifestyle" />
                            <div className="absolute bottom-2 left-2 text-[10px] font-bold uppercase tracking-widest bg-black/50 backdrop-blur-md px-2 py-1 rounded">Ambient</div>
                        </div>
                        <div className="relative aspect-square group overflow-hidden">
                            <img src={IMAGES.tech} className="w-full h-full object-cover hover:opacity-80 transition-opacity" alt="Tech" />
                            <div className="absolute bottom-2 left-2 text-[10px] font-bold uppercase tracking-widest bg-black/50 backdrop-blur-md px-2 py-1 rounded">Engineering</div>
                        </div>
                    </div>
                </div>

                {/* 3. Right Column: Sales Copy & Logic */}
                <div className="p-6 md:p-12 lg:p-16 space-y-8 md:min-h-screen flex flex-col justify-center">

                    {/* Header */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-[0.2em]">
                            <Star size={12} className="fill-amber-500" />
                            <span>Premium Home Series</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.9] text-white">
                            THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600">SEA URCHIN</span><br />
                            MASTERPIECE.
                        </h1>
                        <div className="flex items-end gap-3 pt-2">
                            <span className="text-3xl font-bold text-amber-400">₹{PRICE}</span>
                            <span className="text-lg text-gray-600 line-through decoration-red-500/50 mb-1">₹{ORIGINAL_PRICE}</span>
                            <span className="bg-amber-900/30 text-amber-400 border border-amber-800 px-2 py-0.5 rounded text-xs font-bold mb-1.5 animate-pulse">
                                {DISCOUNT}% OFF TODAY
                            </span>
                        </div>
                    </div>

                    {/* Social Proof / Trust Line */}
                    <div className="flex items-center gap-4 py-4 border-y border-gray-800">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} className="w-8 h-8 rounded-full border-2 border-[#050505]" alt="User" />
                            ))}
                        </div>
                        <div className="text-sm text-gray-400">
                            <span className="text-white font-bold block leading-none">4.9/5 Rating</span>
                            based on 1,240+ verified setups
                        </div>
                    </div>

                    {/* Benefits Grid (Science Based) */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Why Pro Architects Choose It</h3>

                        <div className="grid gap-4">
                            {/* Benefit 1 */}
                            <div className="bg-[#111] p-4 rounded-xl border border-gray-800 flex gap-4 hover:border-amber-900/50 transition-colors">
                                <div className="bg-amber-900/20 p-3 rounded-lg h-fit">
                                    <Zap className="text-amber-500" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white mb-1">Zero-Flicker Ambient Glow</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        Precision-engineered LED core mimics sunset spectrum (2700K). No blue light spikes. Instantly reduces cortisol levels for better relaxation.
                                    </p>
                                </div>
                            </div>

                            {/* Benefit 2 */}
                            <div className="bg-[#111] p-4 rounded-xl border border-gray-800 flex gap-4 hover:border-amber-900/50 transition-colors">
                                <div className="bg-amber-900/20 p-3 rounded-lg h-fit">
                                    <ShieldCheck className="text-amber-500" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white mb-1">Laser-Cut Birch Skeleton</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        36 individual fins hand-assembled. Interlocking geometry creates dynamic shadow play that transforms any dull corner into art.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section (Sticky Mobile) */}
                    <div className="fixed bottom-0 left-0 w-full md:static bg-[#050505] p-4 border-t border-gray-800 md:border-0 md:p-0 z-50">
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-white text-black font-black text-lg py-4 rounded-xl hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            <span>ADD TO CART</span>
                            <ChevronRight size={20} />
                        </button>
                        <p className="text-center text-[10px] text-gray-500 mt-2 font-medium">
                            Free Express Shipping India-wide • 7-Day Money Back Guarantee
                        </p>
                    </div>

                    {/* Detailed Specs (Collapsible-ish feel) */}
                    <div className="pt-8 space-y-2 text-sm text-gray-500 font-mono">
                        <div className="flex justify-between border-b border-gray-800 pb-2">
                            <span>Height</span>
                            <span className="text-gray-300">23 cm</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-800 pb-2">
                            <span>Diameter</span>
                            <span className="text-gray-300">35 cm</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-800 pb-2">
                            <span>Material</span>
                            <span className="text-gray-300">Baltic Birch Plywood</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-800 pb-2">
                            <span>Light Source</span>
                            <span className="text-gray-300">E27 Warm LED (Included)</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SeaUrchinLP_Beast;
