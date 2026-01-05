import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Star, ArrowRight, ShieldCheck, Flame, CheckCircle2, Truck, Package, Heart, Instagram, Zap, Wind, Layers, Droplets, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { generateProductSchema, generateBreadcrumbSchema } from '../utils/structuredData';

const YogaSocksLP: React.FC = () => {
    const { addToCart } = useCart();
    const [timeLeft, setTimeLeft] = useState(15 * 60);
    const [selectedBundle, setSelectedBundle] = useState<'single' | 'duo' | 'squad'>('duo');
    const [selectedColor, setSelectedColor] = useState('black');
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    // Countdown timer
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
        document.getElementById('offer-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleAddToCart = () => {
        const product = {
            id: `yoga-socks-${selectedColor}`,
            slug: 'yoga-grip-socks',
            name: `Yoga Grip Socks - ${selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)}`,
            subtitle: 'Non-Slip Grip Socks',
            description: 'Premium yoga grip socks with enhanced traction for better stability during practice.',
            price: selectedBundle === 'single' ? 499 : selectedBundle === 'duo' ? 449 : 399,
            currency: 'INR',
            category: 'Yoga Accessories',
            categories: ['Yoga', 'Fitness', 'Accessories'],
            images: ['https://images.unsplash.com/photo-1596707328151-61472554d32e?w=800'],
            tags: ['Yoga', 'Grip Socks', 'Non-Slip'],
            stock: 50,
            variants: [{ size: 'Free Size', stock: 50 }]
        };

        const quantity = selectedBundle === 'single' ? 1 : selectedBundle === 'duo' ? 2 : 4;
        addToCart(product, quantity, 'Free Size', 'landing-page', 'Yoga Grip Socks');

        const banner = document.createElement('div');
        banner.innerText = `✅ Added ${quantity} pair${quantity > 1 ? 's' : ''} to cart!`;
        banner.className = "fixed top-24 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full font-bold shadow-xl z-50 animate-bounce";
        document.body.appendChild(banner);
        setTimeout(() => banner.remove(), 2500);
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans pb-24 md:pb-0">
            <SEO
                title="Premium Yoga Grip Socks | Anti-Slip & Breathable - Jumplings"
                description="Stop slipping during your practice. Premium cotton yoga grip socks with strategic silicone dots for superior traction. Trusted by 50,000+ yogis."
                keywords="yoga socks, grip socks, pilates socks, non-slip socks, anti-slip yoga socks, best grip socks india, cotton yoga socks"
                image="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=1000&fit=crop"
                type="product"
                structuredData={[
                    generateProductSchema({
                        id: 'yoga-socks-generic',
                        name: 'Premium Yoga Grip Socks',
                        description: 'Premium yoga grip socks with enhanced traction for better stability during practice. Breathable cotton blend with silicone grip dots.',
                        price: 499,
                        currency: 'INR',
                        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=1000&fit=crop',
                        category: 'Yoga Accessories',
                        brand: 'Jumplings',
                        sku: 'yoga-socks-lp',
                        stock: 50,
                        rating: 4.8,
                        reviewCount: 12000
                    }),
                    generateBreadcrumbSchema([
                        { name: 'Home', url: 'https://jumplings.in/' },
                        { name: 'Yoga Grip Socks', url: 'https://jumplings.in/yoga-socks' }
                    ])
                ]}
            />

            {/* Urgency Bar */}
            <div className="sticky top-0 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-2 px-4 text-xs font-bold flex justify-center items-center gap-2 shadow-lg">
                <Flame size={14} className="animate-pulse" />
                <span>🔥 Hot Amazon Seller | <span className="underline">Limited Stock</span> | Offer Ends: <span className="bg-white/20 px-1.5 py-0.5 rounded font-mono">{formatTime(timeLeft)}</span></span>
            </div>

            {/* Hero Section */}
            <section className="relative pt-12 pb-16 px-4 overflow-hidden bg-gradient-to-b from-green-50/30 to-white">
                <div className="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full blur-[100px] opacity-20"></div>

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">

                    {/* Hero Image */}
                    <div className="order-1 lg:order-2 relative">
                        <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white ring-1 ring-gray-200">
                            <img
                                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=1000&fit=crop"
                                alt="Yoga Grip Socks"
                                className="w-full h-full object-cover"
                            />
                            {/* Price Badge */}
                            <div className="absolute top-6 right-6 bg-gray-900/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl shadow-xl border border-white/10">
                                <span className="text-[10px] font-medium tracking-wider uppercase text-white/70 line-through">₹799</span>
                                <span className="block text-xl font-bold leading-none">₹499</span>
                            </div>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="space-y-6 text-center lg:text-left order-2 lg:order-1">
                        {/* Social Proof Badge */}
                        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                            <div className="flex text-amber-500 text-xs">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                            </div>
                            <span className="text-xs font-bold text-gray-600">⭐ Rated #1 by Yoga Instructors</span>
                        </div>

                        <h1 className="font-black text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-gray-900 tracking-tight">
                            Stop Slipping. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Start Flowing.</span>
                        </h1>

                        <p className="text-gray-600 font-medium max-w-md mx-auto lg:mx-0 leading-relaxed text-base md:text-lg">
                            The grip socks trusted by <span className="text-green-600 font-bold">50,000+ yogis</span>. Enhanced traction for deeper poses, better balance, and cleaner practice.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center pt-2">
                            <button
                                onClick={scrollToOffer}
                                className="w-full sm:w-auto px-10 py-4 bg-gray-900 text-white font-bold text-lg rounded-full shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 group"
                            >
                                Get My Grip Socks <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </button>

                            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 30}`} alt="User" />
                                        </div>
                                    ))}
                                </div>
                                <span className="text-xs font-bold text-gray-600">12k+ Reviews</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem-Solution Section */}
            <section className="py-16 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-green-600 font-bold tracking-widest text-xs uppercase mb-2 block">The Problem</span>
                        <h2 className="font-black text-3xl md:text-5xl text-gray-900 mb-4">Your Practice Deserves Better</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-500 mb-4 mx-auto">
                                <span className="text-2xl">😰</span>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Slipping During Poses</h3>
                            <p className="text-sm text-gray-500">Losing stability in warrior or tree pose</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-500 mb-4 mx-auto">
                                <span className="text-2xl">🤢</span>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Shared Mat Hygiene</h3>
                            <p className="text-sm text-gray-500">Concerns about studio mat cleanliness</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-500 mb-4 mx-auto">
                                <span className="text-2xl">🧘‍♀️</span>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Lost Focus</h3>
                            <p className="text-sm text-gray-500">Constantly adjusting position</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-500 mb-4 mx-auto">
                                <span className="text-2xl">🧊</span>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Cold Studio Floors</h3>
                            <p className="text-sm text-gray-500">Uncomfortable barefoot practice</p>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="inline-flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl">
                            <CheckCircle2 size={24} />
                            <span>Solved with Strategic Grip Dots</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-green-600 font-bold tracking-widest text-xs uppercase mb-2 block">The Solution</span>
                        <h2 className="font-black text-3xl md:text-5xl text-gray-900 mb-4">Studio-Quality Performance</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">Every detail designed for better practice</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="space-y-3">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                                <Zap size={24} />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900">Non-Slip Grip Dots</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">Strategically placed silicone grip dots provide superior traction on any surface - yoga mat, hardwood, or tile.</p>
                        </div>

                        <div className="space-y-3">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                                <Wind size={24} />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900">Breathable Cotton Blend</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">Premium cotton-spandex blend keeps feet cool and dry during hot yoga sessions.</p>
                        </div>

                        <div className="space-y-3">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                                <Layers size={24} />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900">Arch Support</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">Extra cushioning in the arch for all-day comfort during extended practice sessions.</p>
                        </div>

                        <div className="space-y-3">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                                <Droplets size={24} />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900">Machine Washable</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">Easy care keeps them fresh. Toss in the wash, air dry, ready for next class.</p>
                        </div>

                        <div className="space-y-3">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                                <Package size={24} />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900">5 Color Options</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">Choose from black, grey, navy, teal, or dusty pink to match your yoga style.</p>
                        </div>

                        <div className="space-y-3">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                                <Award size={24} />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900">Instructor Approved</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">Recommended by certified yoga instructors across 200+ studios.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof / UGC Section */}
            <section className="py-16 bg-gradient-to-b from-green-50/30 to-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <span className="text-green-600 font-bold tracking-widest text-xs uppercase mb-2 block">Join the Movement</span>
                        <h2 className="font-black text-3xl md:text-5xl text-gray-900 mb-4">50,000+ Yogis Trust Us</h2>
                        <p className="text-gray-500">See why they're ditching bare feet</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="aspect-square rounded-xl overflow-hidden relative group">
                                <img
                                    src={`https://images.unsplash.com/photo-${1540206395 - i * 100}-d09e9a5bb3cb?w=600&h=600&fit=crop`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    alt="Customer photo"
                                />
                                <div className="absolute bottom-2 left-2 text-white text-[10px] font-bold opacity-80">@yogi_flow_{i}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Offer Section */}
            <section id="offer-section" className="py-16 px-4 bg-white">
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-50 to-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-200">

                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-bold text-sm mb-4">
                            <Flame size={16} fill="currentColor" />
                            Limited Time Offer
                        </div>
                        <h2 className="font-black text-3xl md:text-4xl text-gray-900 mb-2">Choose Your Bundle</h2>
                        <p className="text-gray-500">Save more with multi-packs</p>
                    </div>

                    {/* Bundle Options */}
                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                        {/* Single */}
                        <button
                            onClick={() => setSelectedBundle('single')}
                            className={`relative p-6 rounded-2xl border-2 transition-all ${selectedBundle === 'single' ? 'border-gray-900 bg-gray-50 ring-2 ring-gray-900' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <div className="text-center">
                                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Single Pair</p>
                                <p className="text-3xl font-black text-gray-900">₹499</p>
                                <p className="text-xs text-gray-400 line-through">₹799</p>
                                <p className="text-xs font-bold text-green-600 mt-2">Try It Out</p>
                            </div>
                        </button>

                        {/* Duo */}
                        <button
                            onClick={() => setSelectedBundle('duo')}
                            className={`relative p-6 rounded-2xl border-2 transition-all ${selectedBundle === 'duo' ? 'border-gray-900 bg-gray-50 ring-2 ring-gray-900' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                                MOST POPULAR
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Duo Pack</p>
                                <p className="text-3xl font-black text-gray-900">₹899</p>
                                <p className="text-xs text-gray-400 line-through">₹1,599</p>
                                <p className="text-xs font-bold text-green-600 mt-2">Save 44%</p>
                            </div>
                        </button>

                        {/* Squad */}
                        <button
                            onClick={() => setSelectedBundle('squad')}
                            className={`relative p-6 rounded-2xl border-2 transition-all ${selectedBundle === 'squad' ? 'border-gray-900 bg-gray-50 ring-2 ring-gray-900' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <div className="text-center">
                                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Squad Pack (4)</p>
                                <p className="text-3xl font-black text-gray-900">₹1,599</p>
                                <p className="text-xs text-gray-400 line-through">₹2,999</p>
                                <p className="text-xs font-bold text-green-600 mt-2">Save 47%</p>
                            </div>
                        </button>
                    </div>

                    {/* What's Included */}
                    <div className="bg-green-50 rounded-xl p-4 mb-6">
                        <p className="font-bold text-sm text-gray-900 mb-3">Every pack includes:</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={14} className="text-green-600" />
                                <span>Free Shipping</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={14} className="text-green-600" />
                                <span>30-Day Guarantee</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={14} className="text-green-600" />
                                <span>1-Year Warranty</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-gray-900 text-white py-5 rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-all group font-black text-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
                    >
                        <span>Add to Cart</span>
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                    </button>

                    <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mt-4">
                        <div className="flex items-center gap-1">
                            <ShieldCheck size={12} className="text-green-600" />
                            <span>Secure Checkout</span>
                        </div>
                        <div className="w-px h-3 bg-gray-300"></div>
                        <div className="flex items-center gap-1">
                            <Truck size={12} className="text-green-600" />
                            <span>Free Shipping</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 px-6 bg-gray-50">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="font-black text-3xl md:text-4xl text-gray-900 mb-2">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            { q: 'Will these work on my yoga mat?', a: 'Yes! Our grip socks work on all mat types - PVC, TPE, natural rubber, and cork. The silicone dots provide traction on any surface.' },
                            { q: 'What size should I get?', a: 'Our socks are "Free Size" (one size fits most) designed to fit women\'s sizes 5-10 and men\'s 6-9 comfortably with stretch.' },
                            { q: 'Can I wear them outside yoga class?', a: 'Absolutely! Many customers wear them for pilates, barre, dance, or just around the house for better grip on smooth floors.' },
                            { q: 'How do I wash them?', a: 'Machine wash cold with like colors, tumble dry low or air dry. The grip dots are durable and won\'t peel off.' },
                            { q: 'Are they suitable for hot yoga?', a: 'Yes! The breathable cotton blend wicks moisture and the grip actually works better when slightly damp.' }
                        ].map((faq, i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full p-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-bold text-gray-900">{faq.q}</span>
                                    <div className={`transform transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>
                                {openFaq === i && (
                                    <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sticky Mobile CTA */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 z-50 flex items-center gap-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="font-black text-xl text-green-600">₹{selectedBundle === 'single' ? 499 : selectedBundle === 'duo' ? 899 : 1599}</span>
                        <span className="text-xs text-gray-400 line-through">₹{selectedBundle === 'single' ? 799 : selectedBundle === 'duo' ? 1599 : 2999}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium">{selectedBundle.charAt(0).toUpperCase() + selectedBundle.slice(1)} Pack • Free Shipping</p>
                </div>
                <button
                    onClick={scrollToOffer}
                    className="bg-gray-900 text-white px-6 py-3 rounded-lg font-bold text-base shadow-lg active:scale-95 transition-all"
                >
                    Buy Now
                </button>
            </div>

        </div>
    );
};

export default YogaSocksLP;
