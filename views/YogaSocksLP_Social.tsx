import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Star, ShoppingCart, Instagram, CheckCircle2, TrendingUp, Users, Award, Clock } from 'lucide-react';
import SEO from '../components/SEO';
import { generateProductSchema, generateBreadcrumbSchema } from '../utils/structuredData';

const YogaSocksLP_Social: React.FC = () => {
    const { addToCart } = useCart();
    const [viewerCount] = useState(Math.floor(Math.random() * 20) + 15); // 15-35 viewers
    const [recentPurchases] = useState([
        { name: 'Priya', city: 'Mumbai', time: '2 min ago' },
        { name: 'Anjali', city: 'Delhi', time: '5 min ago' },
        { name: 'Kavya', city: 'Bangalore', time: '8 min ago' }
    ]);
    const [currentPurchaseIndex, setCurrentPurchaseIndex] = useState(0);

    // Rotate recent purchases
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPurchaseIndex((prev) => (prev + 1) % recentPurchases.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [recentPurchases.length]);

    const handleBuyNow = () => {
        const product = {
            id: 'yoga-socks-black-social',
            slug: 'yoga-grip-socks',
            name: 'Yoga Grip Socks - Black',
            subtitle: 'Non-Slip Grip Socks',
            description: 'Premium yoga grip socks trusted by 12,847+ yogis.',
            price: 499,
            currency: 'INR',
            category: 'Yoga Accessories',
            categories: ['Yoga', 'Fitness', 'Accessories'],
            images: ['https://images.unsplash.com/photo-1596707328151-61472554d32e?w=800'],
            tags: ['Yoga', 'Grip Socks', 'Non-Slip'],
            stock: 50,
            variants: [{ size: 'Free Size', stock: 50 }]
        };

        addToCart(product, 1, 'Free Size', 'landing-page', 'Yoga Grip Socks');

        const banner = document.createElement('div');
        banner.innerText = '✅ Added to cart!';
        banner.className = "fixed top-24 left-1/2 transform -translate-x-1/2 bg-teal-600 text-white px-6 py-3 rounded-full font-bold shadow-xl z-50 animate-bounce";
        document.body.appendChild(banner);
        setTimeout(() => banner.remove(), 2500);
    };

    const instagramPosts = [
        { img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop', likes: '2.4k' },
        { img: 'https://images.unsplash.com/photo-1540206395-68808572332f?w=400&h=400&fit=crop', likes: '1.8k' },
        { img: 'https://images.unsplash.com/photo-1599447292023-f544801062c6?w=400&h=400&fit=crop', likes: '3.2k' },
        { img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop', likes: '1.5k' },
        { img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', likes: '2.1k' },
        { img: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=400&h=400&fit=crop', likes: '1.9k' },
        { img: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&h=400&fit=crop', likes: '2.7k' },
        { img: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=400&fit=crop', likes: '1.6k' },
        { img: 'https://images.unsplash.com/photo-1593810450967-f9c42742e326?w=400&h=400&fit=crop', likes: '3.1k' }
    ];

    const testimonials = [
        {
            name: 'Priya M.',
            location: 'Mumbai',
            quote: 'Finally, no more slipping during crow pose! These are a game-changer. I wish I had found them years ago.',
            rating: 5,
            verified: true,
            img: 'https://i.pravatar.cc/100?img=1'
        },
        {
            name: 'Anjali S.',
            location: 'Delhi',
            role: 'Yoga Instructor',
            quote: 'I teach 5 classes a week and these are the ONLY socks I trust. My students always ask where I got them!',
            rating: 5,
            verified: true,
            instructor: true,
            img: 'https://i.pravatar.cc/100?img=5'
        },
        {
            name: 'Kavya R.',
            location: 'Bangalore',
            quote: 'The grip is amazing even during hot yoga. No more towel on my mat. Total game changer.',
            rating: 5,
            verified: true,
            img: 'https://i.pravatar.cc/100?img=9'
        },
        {
            name: 'Meera K.',
            location: 'Pune',
            quote: 'I was skeptical, but these exceeded all expectations. My practice has completely transformed.',
            rating: 5,
            verified: true,
            img: 'https://i.pravatar.cc/100?img=16'
        },
        {
            name: 'Sneha P.',
            location: 'Hyderabad',
            role: 'Certified Instructor',
            quote: 'I recommend these to all my students. Superior grip and comfort. Worth every rupee.',
            rating: 5,
            verified: true,
            instructor: true,
            img: 'https://i.pravatar.cc/100?img=20'
        },
        {
            name: 'Divya N.',
            location: 'Chennai',
            quote: 'Perfect for my morning flow sessions. The arch support is a bonus I didn\'t expect!',
            rating: 5,
            verified: true,
            img: 'https://i.pravatar.cc/100?img=23'
        }
    ];

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <SEO
                title="Yoga Grip Socks | As Seen On Social - Jumplings"
                description="Join 12,000+ yogis using the most viral grip socks on Instagram. Premium non-slip traction for yoga and pilates. Rated 4.9/5."
                keywords="viral yoga socks, instagram yoga socks, best grip socks reviews, jumplings yoga socks, pilates socks india"
                image="https://images.unsplash.com/photo-1596707328151-61472554d32e?w=800"
                type="product"
                structuredData={[
                    generateProductSchema({
                        id: 'yoga-socks-social',
                        name: 'Yoga Grip Socks (Viral Edition)',
                        description: 'Premium yoga grip socks trusted by 12,847+ yogis. Superior traction and comfort.',
                        price: 499,
                        currency: 'INR',
                        image: 'https://images.unsplash.com/photo-1596707328151-61472554d32e?w=800',
                        category: 'Yoga Accessories',
                        brand: 'Jumplings',
                        sku: 'yoga-socks-social',
                        stock: 50,
                        rating: 4.9,
                        reviewCount: 3241
                    }),
                    generateBreadcrumbSchema([
                        { name: 'Home', url: 'https://jumplings.in/' },
                        { name: 'Yoga Socks Viral', url: 'https://jumplings.in/yoga-socks-social' }
                    ])
                ]}
            />

            {/* Sticky Floating CTA */}
            <div className="fixed bottom-6 right-6 z-50 hidden md:block">
                <button
                    onClick={handleBuyNow}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
                >
                    <ShoppingCart size={20} />
                    <span>Get Yours - ₹499</span>
                </button>
            </div>

            {/* Mobile Sticky Bottom CTA */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
                <button
                    onClick={handleBuyNow}
                    className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                    <ShoppingCart size={20} />
                    Get Yours - ₹499
                </button>
            </div>

            {/* Instagram Grid Hero */}
            <section className="pt-8 pb-12 px-4 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                    {/* Social Indicators */}
                    <div className="flex justify-center gap-4 mb-6 text-sm">
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                            <Users size={16} className="text-teal-600" />
                            <span className="font-medium text-gray-700">{viewerCount} people viewing</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                            <TrendingUp size={16} className="text-orange-500" />
                            <span className="font-medium text-gray-700">Trending #1</span>
                        </div>
                    </div>

                    {/* Instagram Grid */}
                    <div className="grid grid-cols-3 gap-2 md:gap-3 mb-8">
                        {instagramPosts.map((post, i) => (
                            <div key={i} className="aspect-square rounded-lg overflow-hidden relative group cursor-pointer">
                                <img src={post.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Customer" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-white text-sm font-bold">
                                        <Instagram size={16} />
                                        {post.likes}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Headline */}
                    <div className="text-center space-y-3">
                        <h1 className="font-black text-4xl md:text-5xl lg:text-6xl text-gray-900">
                            12,847 Yogis Can't Be Wrong
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-amber-500">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={24} fill="currentColor" />)}
                            <span className="text-gray-600 font-bold ml-2">4.9/5.0 from 3,241 reviews</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recent Purchase Ticker */}
            <div className="bg-teal-50 border-y border-teal-200 py-3 overflow-hidden">
                <div className="flex items-center justify-center gap-2 text-sm animate-pulse">
                    <Clock size={14} className="text-teal-600" />
                    <span className="font-medium">
                        <span className="font-bold">{recentPurchases[currentPurchaseIndex].name}</span> from {recentPurchases[currentPurchaseIndex].city} just bought • {recentPurchases[currentPurchaseIndex].time}
                    </span>
                </div>
            </div>

            {/* Testimonial River */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-3xl mx-auto space-y-8">
                    {testimonials.map((testimonial, i) => (
                        <div key={i}>
                            <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-200 hover:shadow-lg transition-shadow">
                                <div className="flex items-start gap-4 mb-4">
                                    <img src={testimonial.img} className="w-16 h-16 rounded-full object-cover ring-2 ring-teal-100" alt={testimonial.name} />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-lg text-gray-900">{testimonial.name}</h3>
                                            {testimonial.verified && (
                                                <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                                    <CheckCircle2 size={12} />
                                                    Verified
                                                </div>
                                            )}
                                            {testimonial.instructor && (
                                                <div className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                                    <Award size={12} />
                                                    Instructor
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500">{testimonial.location}{testimonial.role && ` • ${testimonial.role}`}</p>
                                        <div className="flex gap-0.5 mt-1">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} size={14} fill="#F59E0B" className="text-amber-500" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-700 leading-relaxed text-base md:text-lg italic">
                                    "{testimonial.quote}"
                                </p>
                            </div>

                            {/* CTA after every 2 testimonials */}
                            {(i === 1 || i === 4) && (
                                <div className="text-center py-8">
                                    <button
                                        onClick={handleBuyNow}
                                        className="bg-gray-900 hover:bg-black text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl transition-all inline-flex items-center gap-3"
                                    >
                                        Join 12,847+ Yogis
                                        <ShoppingCart size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats Bar */}
            <section className="py-12 bg-gray-900 text-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <div className="text-3xl md:text-4xl font-black text-teal-400">12,847</div>
                            <div className="text-sm text-gray-400 mt-1">Pairs Sold</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-black text-teal-400">4.9★</div>
                            <div className="text-sm text-gray-400 mt-1">Average Rating</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-black text-teal-400">94%</div>
                            <div className="text-sm text-gray-400 mt-1">Would Buy Again</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-black text-teal-400">200+</div>
                            <div className="text-sm text-gray-400 mt-1">Studios Recommend</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Single FAQ */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="font-black text-3xl md:text-4xl text-gray-900 mb-4">
                            Will these actually work on my mat?
                        </h2>
                        <p className="text-2xl text-teal-600 font-bold mb-6">
                            Yes. 100%.
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                            Our grip socks work on <span className="font-bold">all mat types</span> - PVC, TPE, natural rubber, cork, and even hardwood floors. The silicone grip dots are strategically placed for maximum traction in every pose. Don't just take our word for it - <span className="font-bold">3,241 verified reviews</span> can't be wrong.
                        </p>
                    </div>

                    <div className="bg-teal-50 rounded-2xl p-6 md:p-8 border-2 border-teal-200 text-center">
                        <div className="text-5xl mb-4">💯</div>
                        <h3 className="font-black text-2xl text-gray-900 mb-3">
                            Love Them or Your Money Back
                        </h3>
                        <p className="text-gray-700 mb-6">
                            Try them risk-free for 30 days. If you don't absolutely love them, return for a full refund. No questions asked.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <CheckCircle2 size={16} className="text-teal-600" />
                                Free Shipping
                            </div>
                            <div className="flex items-center gap-1">
                                <CheckCircle2 size={16} className="text-teal-600" />
                                Free Returns
                            </div>
                            <div className="flex items-center gap-1">
                                <CheckCircle2 size={16} className="text-teal-600" />
                                1-Year Warranty
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final Social Push - Visual CTA */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-5xl mx-auto">

                    {/* Customer Photos Grid */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center -space-x-4 mb-4">
                            {[1, 5, 9, 16, 20, 23, 30, 35].map(img => (
                                <img
                                    key={img}
                                    src={`https://i.pravatar.cc/80?img=${img}`}
                                    className="w-12 h-12 rounded-full border-4 border-white object-cover shadow-md"
                                    alt="Customer"
                                />
                            ))}
                        </div>
                        <p className="text-gray-600 font-medium">
                            Join <span className="font-bold text-teal-600">12,847 yogis</span> who upgraded their practice this month
                        </p>
                    </div>

                    {/* Main CTA Card */}
                    <div className="bg-gradient-to-br from-teal-50 to-white rounded-3xl p-8 md:p-12 border-2 border-teal-200 shadow-2xl relative overflow-hidden">

                        {/* Scarcity Badge */}
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                            </span>
                            Only 7 Left
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="font-black text-3xl md:text-5xl text-gray-900 mb-4">
                                Your Turn to Experience It
                            </h2>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                Same socks trusted by thousands of yogis across India. Same unbeatable grip. Same risk-free guarantee.
                            </p>
                        </div>

                        {/* Pricing */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl mb-6">
                            <div className="flex items-center justify-center gap-6 mb-6">
                                <div className="text-center">
                                    <div className="text-gray-400 text-sm line-through mb-1">Regular Price</div>
                                    <div className="text-3xl text-gray-300 line-through font-bold">₹799</div>
                                </div>
                                <div className="text-4xl font-black text-gray-300">→</div>
                                <div className="text-center">
                                    <div className="text-teal-600 text-sm font-bold mb-1 flex items-center gap-2 justify-center">
                                        <CheckCircle2 size={16} />
                                        Today Only
                                    </div>
                                    <div className="text-5xl md:text-6xl text-teal-600 font-black">₹499</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 text-sm">
                                <div className="flex items-center justify-center gap-2 bg-green-50 text-green-700 p-3 rounded-lg font-bold">
                                    <CheckCircle2 size={16} />
                                    Free Shipping
                                </div>
                                <div className="flex items-center justify-center gap-2 bg-blue-50 text-blue-700 p-3 rounded-lg font-bold">
                                    <CheckCircle2 size={16} />
                                    30-Day Returns
                                </div>
                                <div className="flex items-center justify-center gap-2 bg-purple-50 text-purple-700 p-3 rounded-lg font-bold">
                                    <CheckCircle2 size={16} />
                                    1-Year Warranty
                                </div>
                            </div>

                            <button
                                onClick={handleBuyNow}
                                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-6 rounded-xl font-black text-xl md:text-2xl shadow-2xl hover:shadow-3xl transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden group"
                            >
                                <span className="relative z-10">Yes, I Want Better Grip!</span>
                                <ShoppingCart size={28} className="relative z-10" />
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            </button>
                        </div>

                        {/* Trust Footer */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-6 opacity-50" alt="Visa" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-6 opacity-50" alt="Mastercard" />
                                <span className="text-xs font-medium">Secure SSL Checkout</span>
                            </div>
                            <div className="hidden md:block w-px h-4 bg-gray-300"></div>
                            <div className="text-xs font-medium">🔒 Your payment info is safe</div>
                        </div>
                    </div>

                    {/* Final Social Proof */}
                    <div className="mt-8 text-center">
                        <div className="inline-flex items-center gap-3 bg-gray-50 px-6 py-4 rounded-full border border-gray-200">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <Star key={i} size={20} fill="#F59E0B" className="text-amber-500" />
                                ))}
                            </div>
                            <div className="text-sm">
                                <span className="font-bold text-gray-900">4.9/5</span>
                                <span className="text-gray-500"> from </span>
                                <span className="font-bold text-gray-900">3,241 verified reviews</span>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Bottom padding for mobile sticky CTA */}
            <div className="h-24 md:h-0"></div>

        </div>
    );
};

export default YogaSocksLP_Social;
