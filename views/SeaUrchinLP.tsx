import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, ShieldCheck, Sun, Leaf, Gift, Truck, ChevronDown, Plus, Minus, CheckCircle2, Flame, Trophy, Package, Heart, Instagram } from 'lucide-react';
import SEO from '../components/SEO';
import { generateProductSchema, generateBreadcrumbSchema } from '../utils/structuredData';

const SeaUrchinLP: React.FC = () => {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [timeLeft, setTimeLeft] = useState(15 * 60);
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [selectedColor, setSelectedColor] = useState<'Pink' | 'Green'>('Pink');
    const [activeImage, setActiveImage] = useState(0);

    // Images 
    // Images 
    const images = {
        Pink: [
            '/images/sea_urchin_pink_ugc_hand_holding_1767531291802.webp',
            '/images/sea_urchin_pink_cozy_lifestyle_1767531244368.webp',
            '/images/sea_urchin_pink_macro_corrected_1767532237235.webp',
            '/images/sea_urchin_pink_glow_physics_corrected_1767532268682.webp',
            '/images/sea_urchin_pink_mirror_selfie_ugc_1767532909153.webp'
        ],
        Green: [
            '/images/sea_urchin_green_hand_holding_daylight_1767532714940.webp',
            '/images/sea_urchin_green_base_detail_corrected_1767532251788.webp',
            '/images/sea_urchin_green_ugc_bedroom_messy_1767531310351.webp',
            '/images/sea_urchin_green_minimalist_desk_1767531261509.webp'
        ]
    };

    const currentImages = images[selectedColor];

    // Reset image index on color change
    useEffect(() => {
        setActiveImage(0);
    }, [selectedColor]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const scrollToOffer = () => {
        document.getElementById('buy-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleAddToCart = () => {
        const product = {
            id: `sea-urchin-lamp-${selectedColor.toLowerCase()}`,
            slug: 'sea-urchin-lamp',
            name: `Sea Urchin Lamp - ${selectedColor}`,
            subtitle: 'Artisan Ambient Light',
            description: 'Handcrafted from natural materials with a warm amber glow.',
            price: 1299,
            currency: 'INR',
            category: 'Home Decor',
            categories: ['Home Decor', 'Lamps'],
            images: currentImages,
            tags: ['Home Decor', 'Lamp'],
            stock: 50,
            variants: [{ size: 'Standard', stock: 50 }]
        };

        addToCart(product, quantity, 'Standard', 'landing-page', 'Sea Urchin Lamp');

        const banner = document.createElement('div');
        banner.innerText = `✅ Added ${selectedColor} Lamp to Cart!`;
        banner.className = "fixed top-24 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full font-bold shadow-xl z-50 animate-bounce";
        document.body.appendChild(banner);
        setTimeout(() => banner.remove(), 2500);
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans pb-24 md:pb-0">
            <SEO
                title="Sea Urchin Lamp - Coral Pink & Ocean Green | Jumplings"
                description="The viral Sea Urchin Lamp, now available in Coral Pink and Ocean Green. Handcrafted sustainable shell lamp for the perfect ambient glow."
                keywords="sea urchin lamp, pink lamp, green lamp, aesthetic bedroom decor, dopamine decor, jumplings lamp"
                image={currentImages[0]}
                type="product"
                structuredData={[
                    generateProductSchema({
                        id: `sea-urchin-lamp-${selectedColor.toLowerCase()}`,
                        name: `Sea Urchin Lamp - ${selectedColor}`,
                        description: 'Handcrafted from natural materials with a warm amber glow. Available in Coral Pink and Ocean Green.',
                        price: 1299,
                        currency: 'INR',
                        image: currentImages[0],
                        category: 'Lamps',
                        brand: 'Jumplings',
                        sku: `sea-urchin-lamp-${selectedColor.toLowerCase()}`,
                        stock: 50,
                        rating: 4.8,
                        reviewCount: 3241
                    }),
                    generateBreadcrumbSchema([
                        { name: 'Home', url: 'https://jumplings.in/' },
                        { name: 'Sea Urchin Lamp', url: 'https://jumplings.in/sea-urchin-lamp' }
                    ])
                ]}
            />

            {/* Urgency Bar */}
            <div className="sticky top-0 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-2 px-4 text-xs font-bold flex justify-center items-center gap-2 shadow-lg">
                <Flame size={14} className="animate-pulse" />
                <span>Only <span className="underline">12 Left</span> | Ends: <span className="bg-white/20 px-1.5 py-0.5 rounded font-mono">{formatTime(timeLeft)}</span></span>
            </div>

            {/* Hero Section */}
            <section className="relative pt-6 pb-10 px-4 overflow-hidden bg-gradient-to-b from-amber-50/50 to-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200 rounded-full blur-[80px] opacity-30"></div>

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center relative z-10">

                    {/* Hero Image Slider (Mobile: First) */}
                    <div className="order-1 lg:order-2 relative group mx-auto w-full max-w-[90%] md:max-w-md lg:max-w-none">
                        <div className="relative aspect-[4/5] md:aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-white ring-1 ring-gray-100 bg-gray-100 transition-transform duration-700 ease-out hover:scale-[1.01]">
                            <img
                                src={currentImages[activeImage]}
                                alt="Sea Urchin Lamp"
                                className="w-full h-full object-cover"
                            />

                            {/* Color Toggles - Justified Segmented Control */}
                            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white backdrop-blur-xl p-1.5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/60 flex z-20">
                                <button
                                    onClick={() => setSelectedColor('Pink')}
                                    className={`w-36 py-3 rounded-full text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${selectedColor === 'Pink' ? 'bg-gray-900 text-white shadow-lg transform -translate-y-0.5' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${selectedColor === 'Pink' ? 'bg-pink-400' : 'bg-pink-400/50'}`} />
                                    Coral Pink
                                </button>
                                <button
                                    onClick={() => setSelectedColor('Green')}
                                    className={`w-36 py-3 rounded-full text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${selectedColor === 'Green' ? 'bg-gray-900 text-white shadow-lg transform -translate-y-0.5' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${selectedColor === 'Green' ? 'bg-green-400' : 'bg-green-400/50'}`} />
                                    Ocean Green
                                </button>
                            </div>

                            {/* Premium Price Badge */}
                            <div className="absolute top-6 right-6 flex flex-col items-center">
                                <div className="bg-gray-900/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl shadow-xl flex flex-col items-center border border-white/10">
                                    <span className="text-[10px] font-medium tracking-wider uppercase text-white/70 line-through decoration-white/50">₹2,499</span>
                                    <span className="text-lg font-bold leading-none tracking-tight">₹1,299</span>
                                </div>
                                <div className="w-1.5 h-1.5 bg-gray-900/90 rounded-full mt-1"></div>
                                <div className="w-1 h-30 bg-gray-900/20"></div> {/* String effect visual trick if needed, or just let it float */}
                            </div>
                        </div>
                    </div>

                    {/* Text (Mobile: Second) */}
                    <div className="space-y-5 text-center lg:text-left order-2 lg:order-1 pt-2 lg:pt-0">
                        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
                            <CheckCircle2 size={12} /> New Colors Available
                        </div>

                        <h1 className="font-heading font-black text-4xl md:text-5xl lg:text-7xl leading-[1.1] text-gray-900 tracking-tight">
                            The Glow That <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Steals The Show.</span>
                        </h1>

                        <p className="text-gray-600 font-medium max-w-md mx-auto lg:mx-0 leading-relaxed text-sm md:text-lg">
                            Viral Sea Urchin Lamp. Now in <span className="text-pink-500 font-bold">Coral Pink</span> & <span className="text-green-600 font-bold">Ocean Green</span>.
                        </p>

                        <div className="flex flex-col gap-4 justify-center lg:justify-start items-center pt-2">
                            <button
                                onClick={scrollToOffer}
                                className="w-full md:w-auto px-10 py-4 bg-gray-900 text-white font-bold text-lg rounded-full shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 group"
                            >
                                Pick Your Color <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </button>

                            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 scale-90 origin-center md:scale-100">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="User" />
                                        </div>
                                    ))}
                                </div>
                                <div className="text-left">
                                    <div className="flex text-amber-500 text-[10px]">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} fill="currentColor" />)}
                                    </div>
                                    <span className="text-xs font-bold text-gray-600">Loved by 1,200+</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof - Horizontal Scroll on Mobile */}
            <section className="bg-white py-10 border-b border-gray-100">
                <div className="max-w-7xl mx-auto pl-4 md:px-6">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 text-center md:text-left">Trending on Home Decor Feeds</p>

                    {/* Horizontal Scroll Container */}
                    <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mr-4 pr-8 md:grid md:grid-cols-4 md:mr-0 md:pr-0 md:pb-0 scrollbar-hide">
                        <div className="snap-center shrink-0 w-64 md:w-auto aspect-square rounded-2xl overflow-hidden relative group">
                            <img src="/images/sea_urchin_pink_real_v2_1767520483897.webp" className="w-full h-full object-cover" alt="Customer Photo" />
                            <div className="absolute bottom-3 left-3 text-white text-xs font-bold flex items-center gap-1 drop-shadow-md"><Heart size={10} fill="white" /> 2.4k</div>
                        </div>
                        <div className="snap-center shrink-0 w-64 md:w-auto aspect-square rounded-2xl overflow-hidden relative group">
                            <img src="/images/sea_urchin_green_real_v2_1767520501537.webp" className="w-full h-full object-cover" alt="Customer Photo" />
                            <div className="absolute bottom-3 left-3 text-white text-xs font-bold flex items-center gap-1 drop-shadow-md"><Heart size={10} fill="white" /> 1.8k</div>
                        </div>
                        <div className="snap-center shrink-0 w-64 md:w-auto aspect-square rounded-2xl overflow-hidden relative group">
                            <img src="/images/uploaded_image_2_1767520309296.jpg" className="w-full h-full object-cover" alt="Customer Photo" />
                            <div className="absolute bottom-3 left-3 text-white text-xs font-bold flex items-center gap-1 drop-shadow-md"><Heart size={10} fill="white" /> 4.1k</div>
                        </div>
                        <div className="snap-center shrink-0 w-64 md:w-auto aspect-square rounded-2xl overflow-hidden relative group">
                            <img src="/images/sea_urchin_lifestyle_real_v2_1767520552575.webp" className="w-full h-full object-cover" alt="Customer Photo" />
                            <div className="absolute bottom-3 left-3 text-white text-xs font-bold flex items-center gap-1 drop-shadow-md"><Heart size={10} fill="white" /> 3.2k</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Deep Dive - Compact Mobile */}
            <section className="py-12 px-6 bg-[#fcfbf9]">
                <div className="max-w-6xl mx-auto space-y-16">

                    {/* Feature 1 */}
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="order-2 md:order-1">
                            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-500 mb-4">
                                <Sun size={24} />
                            </div>
                            <h3 className="font-heading font-black text-3xl mb-3 text-gray-900">Magical Ambient Light</h3>
                            <p className="text-gray-600 leading-relaxed mb-4 text-sm md:text-base">
                                Unlike harsh LED strips, this lamp emits a diffused, amber glow. It filters through the natural pores of the sea urchin shell, creating a mesmerizing pattern on your walls.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 font-bold text-gray-700 text-sm"><CheckCircle2 size={16} className="text-green-500" /> Perfect for reading nooks</li>
                                <li className="flex items-center gap-2 font-bold text-gray-700 text-sm"><CheckCircle2 size={16} className="text-green-500" /> Calming night light</li>
                                <li className="flex items-center gap-2 font-bold text-gray-700 text-sm"><CheckCircle2 size={16} className="text-green-500" /> Romantic dinner setting</li>
                            </ul>
                        </div>
                        <div className="order-1 md:order-2 relative grid grid-cols-2 gap-3">
                            {/* Main Glow Shot */}
                            <div className="col-span-2 relative group overflow-hidden rounded-2xl shadow-xl">
                                <img
                                    src="/images/sea_urchin_pink_glow_physics_corrected_1767532268682.webp"
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    alt="Ambient Glow Pattern"
                                />
                                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur px-3 py-1 rounded-lg text-white text-xs font-bold">
                                    ✨ Light Pattern
                                </div>
                            </div>

                            {/* Macro Texture */}
                            <div className="relative group overflow-hidden rounded-2xl shadow-lg aspect-square">
                                <img
                                    src="/images/sea_urchin_pink_macro_corrected_1767532237235.webp"
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    alt="Natural Shell Texture"
                                />
                                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur px-3 py-1 rounded-lg text-white text-xs font-bold">
                                    🐚 Shell Detail
                                </div>
                            </div>

                            {/* Base Detail */}
                            <div className="relative group overflow-hidden rounded-2xl shadow-lg aspect-square">
                                <img
                                    src="/images/sea_urchin_green_base_detail_corrected_1767532251788.webp"
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    alt="Wooden Base Construction"
                                />
                                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur px-3 py-1 rounded-lg text-white text-xs font-bold">
                                    🪵 Solid Wood
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2: Interactive Vibe Selector */}
                    {/* Feature 2: Interactive Vibe Selector */}
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                        {/* Text & Selector (Mobile: First) */}
                        <div className="space-y-6 md:space-y-8 order-1 md:order-2">
                            <div>
                                <h3 className="font-heading font-black text-3xl md:text-5xl text-gray-900 leading-tight mb-4">
                                    Choose Your <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Atmosphere.</span>
                                </h3>
                                <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                                    Each color tells a different story. Select a variant below to see the transformation.
                                </p>
                            </div>

                            {/* Premium Tab Selector */}
                            <div className="space-y-3 md:space-y-4">
                                {/* Pink Option */}
                                <div
                                    onClick={() => setSelectedColor('Pink')}
                                    className={`group cursor-pointer p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between ${selectedColor === 'Pink' ? 'border-pink-500 bg-pink-50/50 shadow-md ring-1 ring-pink-200' : 'border-gray-100 bg-white hover:border-pink-200'}`}
                                >
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors ${selectedColor === 'Pink' ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-400 group-hover:bg-pink-50'}`}>
                                            <Heart size={20} fill={selectedColor === 'Pink' ? "currentColor" : "none"} />
                                        </div>
                                        <div>
                                            <h4 className={`font-bold text-base md:text-lg ${selectedColor === 'Pink' ? 'text-pink-900' : 'text-gray-900'}`}>Coral Pink</h4>
                                            <p className="text-xs md:text-sm text-gray-500">Soft, romantic amber glow.</p>
                                        </div>
                                    </div>
                                    <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center ${selectedColor === 'Pink' ? 'border-pink-500 bg-pink-500' : 'border-gray-300'}`}>
                                        {selectedColor === 'Pink' && <div className="w-2 md:w-2.5 h-2 md:h-2.5 bg-white rounded-full" />}
                                    </div>
                                </div>

                                {/* Green Option */}
                                <div
                                    onClick={() => setSelectedColor('Green')}
                                    className={`group cursor-pointer p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between ${selectedColor === 'Green' ? 'border-green-500 bg-green-50/50 shadow-md ring-1 ring-green-200' : 'border-gray-100 bg-white hover:border-green-200'}`}
                                >
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors ${selectedColor === 'Green' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400 group-hover:bg-green-50'}`}>
                                            <Leaf size={20} fill={selectedColor === 'Green' ? "currentColor" : "none"} />
                                        </div>
                                        <div>
                                            <h4 className={`font-bold text-base md:text-lg ${selectedColor === 'Green' ? 'text-green-900' : 'text-gray-900'}`}>Ocean Green</h4>
                                            <p className="text-xs md:text-sm text-gray-500">Fresh, calming nature tones.</p>
                                        </div>
                                    </div>
                                    <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center ${selectedColor === 'Green' ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
                                        {selectedColor === 'Green' && <div className="w-2 md:w-2.5 h-2 md:h-2.5 bg-white rounded-full" />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Image Display (Mobile: Second) */}
                        <div className="relative group perspective-1000 order-2 md:order-1">
                            {/* Dynamic Image Display */}
                            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500">
                                <img
                                    src={images[selectedColor][0]}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    alt={`${selectedColor} Vibe`}
                                    key={selectedColor} // Force re-render for animation
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 text-white">
                                    <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">Currently Viewing</p>
                                    <h4 className="text-2xl font-black">{selectedColor} Mood</h4>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* SOCIAL PROOF MEGA SECTION */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-6">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <span className="text-pink-500 font-bold tracking-widest text-xs uppercase mb-2 block">As Seen On Social</span>
                        <h2 className="font-black text-3xl md:text-5xl text-gray-900 mb-4">Going Viral</h2>
                        <p className="text-gray-500 max-w-md mx-auto">See why thousands are obsessed with this glow.</p>
                    </div>

                    {/* 1. VIDEO THUMBNAILS (Reels/TikToks) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {/* Video 1: Pink Reel */}
                        <div className="md:col-start-2 aspect-[9/16] rounded-2xl overflow-hidden relative group shadow-lg cursor-pointer">
                            <img src="/images/sea_urchin_pink_reel_thumbnail_1767531576991.webp" className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="Instagram Reel" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50">
                                    <div className="ml-1 w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent"></div>
                                </div>
                            </div>
                            <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur px-2 py-1 rounded text-white text-[10px] font-bold flex items-center gap-1">
                                <Instagram size={10} /> 142k views
                            </div>
                        </div>

                        {/* Video 2: Green TikTok */}
                        <div className="aspect-[9/16] rounded-2xl overflow-hidden relative group shadow-lg cursor-pointer">
                            <img src="/images/sea_urchin_green_tiktok_thumbnail_1767531596501.webp" className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="TikTok Trend" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50">
                                    <div className="ml-1 w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent"></div>
                                </div>
                            </div>
                            <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur px-2 py-1 rounded text-white text-[10px] font-bold flex items-center gap-1">
                                <span className="font-black">TikTok</span> 84k views
                            </div>
                        </div>
                    </div>

                    {/* 2. AUTHENTIC UGC GRID */}
                    <div className="flex items-center gap-4 mb-8 mt-12">
                        <div className="h-px bg-gray-100 flex-1"></div>
                        <h2 className="text-xl font-bold text-gray-400 uppercase tracking-widest text-xs">Community Snaps</h2>
                        <div className="h-px bg-gray-100 flex-1"></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {/* UGC 1: Hand Holding */}
                        <div className="aspect-[4/5] rounded-xl overflow-hidden relative group">
                            <img src="/images/sea_urchin_pink_ugc_hand_holding_1767531291802.webp" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Customer Photo" />
                            <div className="absolute bottom-2 left-2 text-white text-[10px] font-bold flex items-center gap-1 opacity-80">@sarah_reads</div>
                        </div>
                        {/* UGC 2: Messy Bed */}
                        <div className="aspect-[4/5] rounded-xl overflow-hidden relative group">
                            <img src="/images/sea_urchin_green_ugc_bedroom_messy_1767531310351.webp" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Customer Photo" />
                            <div className="absolute bottom-2 left-2 text-white text-[10px] font-bold flex items-center gap-1 opacity-80">@morning_mood</div>
                        </div>
                        {/* UGC 3: Bookshelf */}
                        <div className="aspect-[4/5] rounded-xl overflow-hidden relative group">
                            <img src="/images/sea_urchin_pink_ugc_bookshelf_1767531439585.webp" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Customer Photo" />
                            <div className="absolute bottom-2 left-2 text-white text-[10px] font-bold flex items-center gap-1 opacity-80">@plant_mom</div>
                        </div>
                        {/* UGC 4: Green Hand Glow (Night) */}
                        <div className="aspect-[4/5] rounded-xl overflow-hidden relative group">
                            <img src="/images/sea_urchin_green_hand_holding_glow_1767532697411.webp" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Green Lamp Night Glow" />
                            <div className="absolute bottom-2 left-2 text-white text-[10px] font-bold flex items-center gap-1 opacity-80">@night_vibes</div>
                        </div>
                        {/* UGC 5: Nightstand (New! The 5th element) */}
                        <div className="aspect-[4/5] rounded-xl overflow-hidden relative group md:col-span-1 col-span-2">
                            <img src="/images/sea_urchin_pink_ugc_nightstand_real_1767531471526.webp" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Customer Photo" />
                            <div className="absolute bottom-2 left-2 text-white text-[10px] font-bold flex items-center gap-1 opacity-80">@nightowl_vibes</div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Main Offer Section - High Conversion Redesign */}
            <section id="buy-section" className="py-12 px-4 bg-gradient-to-b from-orange-50/50 to-white relative overflow-hidden">
                <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-orange-100/50 relative">
                    {/* Floating Badge */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-full font-bold shadow-lg text-sm md:text-base flex items-center gap-2 animate-pulse">
                        <Flame size={16} fill="white" /> Selling Fast! 7 Lamps remaining
                    </div>

                    <div className="grid lg:grid-cols-12 gap-10 mt-6">

                        {/* Left Column: Gallery (5 cols) */}
                        <div className="lg:col-span-5 space-y-4">
                            <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden border-2 border-gray-100 relative group">
                                <img
                                    src={currentImages[activeImage]}
                                    alt="Sea Urchin Lamp"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm border border-gray-100 flex items-center gap-1">
                                    <Star size={10} fill="#f59e0b" className="text-amber-500" /> 4.9/5 Rated
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                                {currentImages.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? `border-${selectedColor === 'Pink' ? 'pink' : 'green'}-500 ring-2 ring-${selectedColor === 'Pink' ? 'pink' : 'green'}-100` : 'border-transparent bg-gray-50 hover:border-gray-200'}`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>

                            {/* Trust Signals Mobile (Hidden on Desktop usually, but good here) */}
                            <div className="flex items-center justify-center gap-6 text-gray-400 grayscale opacity-70 py-4 border-t border-gray-50">
                                <div className="flex flex-col items-center gap-1">
                                    <ShieldCheck size={20} />
                                    <span className="text-[10px] font-bold">1 Year Warranty</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <Truck size={20} />
                                    <span className="text-[10px] font-bold">Free Shipping</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <Package size={20} />
                                    <span className="text-[10px] font-bold">Secure Pack</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: The Offer Engine (7 cols) */}
                        <div className="lg:col-span-7 flex flex-col justify-center">

                            {/* Header & Social Proof */}
                            <div className="mb-6 border-b border-gray-100 pb-6">
                                <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-wider mb-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                    </span>
                                    14 people are viewing this offer
                                </div>
                                <h2 className="font-heading font-black text-3xl md:text-4xl text-gray-900 mb-2">
                                    Handcrafted Sea Urchin Lamp
                                </h2>
                                <p className="text-gray-500 text-sm md:text-base mb-4">
                                    Artisan-made from real natural shells. Creates a warm, soothing ambiance perfect for relaxation.
                                </p>

                                {/* Price Block */}
                                <div className="flex items-baseline gap-3">
                                    <span className="text-5xl font-black text-gray-900">₹1,299</span>
                                    <div className="flex flex-col items-start">
                                        <span className="text-lg text-gray-400 line-through decoration-2">₹2,499</span>
                                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-md">
                                            SAVE ₹1,200 (48%)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Selection Logic */}
                            <div className="space-y-6 mb-8">
                                {/* Variant Selector */}
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="font-bold text-gray-900 text-sm">Select Edition</span>
                                        <Link to="/contact" className="text-xs text-orange-500 font-bold underline">Need help deciding?</Link>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Pink Tile */}
                                        <button
                                            onClick={() => setSelectedColor('Pink')}
                                            className={`relative p-3 rounded-xl border-2 transition-all duration-200 text-left flex items-center gap-3 ${selectedColor === 'Pink' ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                                        >
                                            <div className="w-14 h-14 rounded-lg bg-gray-100 shrink-0 overflow-hidden relative">
                                                <img src="/images/sea_urchin_pink_cozy_lifestyle_1767531244368.webp" className="w-full h-full object-cover" />
                                                {selectedColor === 'Pink' && <div className="absolute inset-0 bg-black/10" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-gray-900 text-sm">Coral Pink</span>
                                                    {selectedColor === 'Pink' && <CheckCircle2 size={16} fill="black" className="text-white" />}
                                                </div>
                                                <span className="text-xs text-gray-500">Warm & Romantic</span>
                                            </div>
                                            <div className="absolute -top-2.5 left-4 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                                BEST SELLER
                                            </div>
                                        </button>

                                        {/* Green Tile */}
                                        <button
                                            onClick={() => setSelectedColor('Green')}
                                            className={`relative p-3 rounded-xl border-2 transition-all duration-200 text-left flex items-center gap-3 ${selectedColor === 'Green' ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                                        >
                                            <div className="w-14 h-14 rounded-lg bg-gray-100 shrink-0 overflow-hidden relative">
                                                <img src="/images/sea_urchin_green_minimalist_desk_1767531261509.webp" className="w-full h-full object-cover" />
                                                {selectedColor === 'Green' && <div className="absolute inset-0 bg-black/10" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-gray-900 text-sm">Ocean Green</span>
                                                    {selectedColor === 'Green' && <CheckCircle2 size={16} fill="black" className="text-white" />}
                                                </div>
                                                <span className="text-xs text-gray-500">Fresh & Calming</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* Scarcity Progress */}
                                <div className="bg-orange-50 rounded-lg p-3 border border-orange-100 flex items-center gap-3">
                                    <div className="flex-1">
                                        <div className="flex justify-between text-xs font-bold text-orange-800 mb-1.5">
                                            <span>Low Stock: Order Soon</span>
                                            <span>85% Sold</span>
                                        </div>
                                        <div className="w-full h-2 bg-orange-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-orange-500 rounded-full w-[85%] animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CTA & Trust */}
                            <div className="space-y-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full py-5 bg-gray-900 text-white font-bold text-xl rounded-xl shadow-xl hover:bg-black hover:shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
                                >
                                    <span className="relative z-10 transition-transform group-hover:-translate-y-0.5">Add to Cart - ₹{1299}</span>
                                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform relative z-10" />
                                </button>

                                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                    <ShieldCheck size={14} className="text-green-600" />
                                    <span>30-Day Money Back Guarantee</span>
                                    <span className="h-4 w-px bg-gray-300 mx-2"></span>
                                    <span>Secure SSL Checkout</span>
                                </div>

                                {/* Payment Icons Placeholder (CSS or Emoji for now if no image) */}
                                <div className="pt-2 flex justify-center gap-2 opacity-50 grayscale">
                                    {/* Using lucide icons as placeholders for payment logos */}
                                    <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-[8px] font-bold">VISA</div>
                                    <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-[8px] font-bold">UPI</div>
                                    <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-[8px] font-bold">RuPay</div>
                                    <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-[8px] font-bold">Master</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* Sticky Mobile CTA Bottom Bar */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 z-50 flex items-center gap-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] safe-area-pb">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="font-black text-xl text-orange-500">₹1,299</span>
                        <span className="text-xs text-gray-400 line-through">₹2499</span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium">{selectedColor} Variant • Free Shipping</p>
                </div>
                <button
                    onClick={scrollToOffer}
                    className="bg-gray-900 text-white px-6 py-3 rounded-lg font-bold text-base shadow-lg active:scale-95 transition-all w-32"
                >
                    Buy Now
                </button>
            </div>

        </div>
    );
};

export default SeaUrchinLP;
