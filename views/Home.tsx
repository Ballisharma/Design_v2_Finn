import React, { useState } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import { Smile, ShieldCheck, Zap, Star, ArrowDown, Anchor, Activity, Wind, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { products, categories } = useProducts();
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Dynamic filters from context
  const filters = ['All', ...categories];

  const filteredProducts = activeFilter === 'All' 
    ? products 
    : products.filter(p => p.category === activeFilter);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  return (
    <div className="animate-fade-in bg-white">
      <Hero />
      
      {/* Marquee Banner - Updated Threshold */}
      <div className="bg-funky-dark text-white py-3 overflow-hidden whitespace-nowrap border-y-4 border-funky-yellow">
        <div className="inline-block animate-wiggle" style={{ animationDuration: '20s' }}>
          <span className="mx-8 font-mono uppercase font-bold tracking-widest text-sm">Free Shipping on orders over ₹399</span>
          <span className="mx-8 font-mono uppercase font-bold tracking-widest text-sm">★</span>
          <span className="mx-8 font-mono uppercase font-bold tracking-widest text-sm">100% Organic Cotton</span>
          <span className="mx-8 font-mono uppercase font-bold tracking-widest text-sm">★</span>
          <span className="mx-8 font-mono uppercase font-bold tracking-widest text-sm">Made in India</span>
          <span className="mx-8 font-mono uppercase font-bold tracking-widest text-sm">★</span>
          <span className="mx-8 font-mono uppercase font-bold tracking-widest text-sm">Funky Fresh Styles</span>
           <span className="mx-8 font-mono uppercase font-bold tracking-widest text-sm">★</span>
          <span className="mx-8 font-mono uppercase font-bold tracking-widest text-sm">Free Shipping on orders over ₹399</span>
        </div>
      </div>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20" id="shop">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-4">
           <div>
             <h2 className="font-heading font-black text-3xl md:text-4xl text-funky-dark">THE COLLECTION</h2>
             <p className="text-gray-500 mt-2 font-body text-sm md:text-base">Browse our latest drops of happiness.</p>
           </div>
           
           <div className="flex flex-wrap gap-2">
             {filters.map(filter => (
               <button 
                 key={filter}
                 onClick={() => {
                   setActiveFilter(filter);
                   setVisibleCount(6); // Reset on filter change
                 }}
                 className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-bold transition-colors border-2 ${
                   activeFilter === filter 
                     ? 'bg-funky-dark text-white border-funky-dark shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]' 
                     : 'bg-white text-funky-dark border-gray-100 hover:border-funky-dark hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                 }`}
               >
                 {filter}
               </button>
             ))}
           </div>
        </div>

        {visibleProducts.length > 0 ? (
          <>
            {/* Grid Layout: 2 Columns on Mobile, 3 on Large Screens */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-y-12 md:gap-x-8">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {hasMore && (
              <div className="mt-12 md:mt-16 text-center">
                <button 
                  onClick={handleLoadMore}
                  className="px-6 py-3 md:px-8 bg-white border-2 border-funky-dark text-funky-dark font-heading font-bold rounded-xl hover:bg-funky-dark hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(7,59,76,1)] active:shadow-none active:translate-x-1 active:translate-y-1 flex items-center gap-2 mx-auto text-sm md:text-base"
                >
                  LOAD MORE SOCKS <ArrowDown size={18} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-funky-light rounded-3xl">
             <div className="text-6xl mb-4">🌵</div>
             <h3 className="font-heading font-bold text-xl text-funky-dark">No socks found here.</h3>
             <p className="text-gray-500">Try a different category!</p>
          </div>
        )}
      </section>

      {/* SPECIALTY SECTION: GRIP SOCKS - LINKED TO LANDING PAGE */}
      <section className="bg-funky-dark text-white overflow-hidden relative border-y-4 border-white">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
          {/* Content Side */}
          <div className="p-8 md:p-20 md:w-1/2 flex flex-col justify-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-funky-green text-funky-dark font-mono font-bold text-xs uppercase w-fit rounded-full mb-6">
              <Activity size={14} /> Performance Series
            </div>
            
            <h2 className="font-heading font-black text-5xl md:text-7xl leading-none mb-6">
              GET A <br/>
              <span className="text-funky-green text-outline-white">GRIP.</span>
            </h2>
            
            <p className="font-body text-lg md:text-xl opacity-90 mb-8 max-w-md">
              Whether you're mastering Yoga, crushing Pilates, or just trying not to slide into the kitchen wall—our new <strong>Anti-Gravity Grip Socks</strong> have you covered.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-10">
              <div className="text-center">
                <div className="bg-white/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-funky-green">
                  <Anchor size={20} />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider">Anti-Slip</p>
              </div>
              <div className="text-center">
                <div className="bg-white/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-funky-pink">
                  <Activity size={20} />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider">Yoga Ready</p>
              </div>
              <div className="text-center">
                <div className="bg-white/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-funky-yellow">
                  <Wind size={20} />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider">Breathable</p>
              </div>
            </div>

            <Link to="/grip-socks" className="inline-block w-full sm:w-auto text-center px-8 py-4 bg-white text-funky-dark font-heading font-black text-xl rounded-xl shadow-[6px_6px_0px_0px_#EF476F] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#EF476F] transition-all">
              SHOP GRIP COLLECTION
            </Link>
          </div>

          {/* Image Side - UPDATED URL */}
          <div className="md:w-1/2 relative min-h-[400px] md:min-h-auto">
             <div className="absolute inset-0 bg-funky-blue mix-blend-multiply opacity-20 z-10"></div>
             <img 
              src="https://images.unsplash.com/photo-1588286840104-445a8cb72f71?q=80&w=1000&auto=format&fit=crop" 
              alt="Yoga Socks Action Shot" 
              className="absolute inset-0 w-full h-full object-cover"
             />
             
             {/* Floating Elements over image */}
             <div className="absolute bottom-10 right-10 z-20 bg-funky-pink p-4 rounded-xl border-4 border-white transform rotate-3 shadow-xl">
                <p className="font-heading font-black text-white text-center leading-tight">
                  <span className="text-2xl block">2 PAIR</span>
                  PACKS
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Redesigned Funky Version */}
      <section className="relative py-20 px-4 md:px-6 overflow-hidden bg-white">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-funky-yellow/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-funky-pink/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-heading font-black text-4xl md:text-5xl text-funky-dark mb-4 relative inline-block">
              WHY JUMPLINGS?
              <svg className="absolute w-full h-3 bottom-1 left-0 text-funky-yellow -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg md:text-xl font-bold">
              Because your feet deserve better than the 3-pack from the discount bin.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { 
                icon: <Smile size={48} className="text-funky-dark" />, 
                title: "Mood Booster", 
                desc: "Scientifically proven* to improve your mood by 400% (*not actual science, just vibes).",
                bgColor: "bg-funky-yellow",
                borderColor: "border-funky-dark",
                textColor: "text-funky-dark"
              },
              { 
                icon: <ShieldCheck size={48} className="text-white" />, 
                title: "Built to Last", 
                desc: "Reinforced toes and heels mean you won't be playing peek-a-boo with your big toe.",
                bgColor: "bg-funky-blue",
                borderColor: "border-funky-dark",
                textColor: "text-white"
              },
              { 
                icon: <Zap size={48} className="text-white" />, 
                title: "Super Soft", 
                desc: "Made with premium organic cotton that feels like a hug for your feet.",
                bgColor: "bg-funky-pink",
                borderColor: "border-funky-dark",
                textColor: "text-white"
              },
            ].map((feature, i) => (
              <div 
                key={i} 
                className={`${feature.bgColor} ${feature.textColor} p-8 rounded-[2rem] border-4 ${feature.borderColor} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center`}
              >
                <div className="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm border-2 border-current">
                  {feature.icon}
                </div>
                <h3 className="font-heading font-black text-2xl mb-4 uppercase tracking-tight">{feature.title}</h3>
                <p className={`font-medium text-sm md:text-base opacity-90 leading-relaxed`}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - NEW FUNKY DESIGN */}
      <section className="py-24 px-6 bg-funky-light relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/60-lines.png')]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
           <div className="text-center mb-16">
             <div className="inline-block bg-funky-pink text-white px-4 py-1 rounded-full font-mono font-bold text-xs uppercase mb-4 tracking-widest border-2 border-funky-dark">Community</div>
             <h2 className="font-heading font-black text-4xl md:text-6xl text-funky-dark">HAPPY FEET TALK 💬</h2>
           </div>

           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {[
                { 
                  name: "Rahul M.", 
                  role: "Software Engineer", 
                  text: "I wear these to client meetings. They think I'm serious until I cross my legs. Best conversation starter ever.",
                  color: "bg-funky-yellow",
                  rotate: "-rotate-2"
                },
                { 
                  name: "Priya S.", 
                  role: "Artist", 
                  text: "The colors are actually as vibrant as they look on the site. Finally, socks that match my energy!",
                  color: "bg-funky-blue",
                  textColor: "text-white",
                  rotate: "rotate-2"
                },
                { 
                  name: "Amit K.", 
                  role: "Runner", 
                  text: "Surprisingly durable for 'fun' socks. I've logged 50km in the Neon Blast pair and they're holding up great.",
                  color: "bg-white",
                  rotate: "-rotate-1"
                },
                {
                   name: "Sarah J.",
                   role: "Yoga Instructor",
                   text: "The new grip socks are insane! No more sliding during downward dog. Plus they look super cute.",
                   color: "bg-funky-pink",
                   textColor: "text-white",
                   rotate: "rotate-1"
                },
                {
                   name: "David B.",
                   role: "Architect",
                   text: "Neobrutalism on my feet? Yes please. The design detail is immaculate.",
                   color: "bg-funky-dark",
                   textColor: "text-white",
                   rotate: "-rotate-3"
                },
                {
                   name: "Zoya F.",
                   role: "Student",
                   text: "My boyfriend stole my socks. I had to order 3 more pairs. 10/10 would recommend.",
                   color: "bg-funky-green",
                   rotate: "rotate-2"
                }
              ].map((review, i) => (
                <div 
                  key={i} 
                  className={`${review.color} ${review.textColor || 'text-funky-dark'} p-8 rounded-[1.5rem] relative border-4 border-funky-dark shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.02] transition-transform duration-300 ${review.rotate} h-full flex flex-col`}
                >
                   <Quote size={40} className="mb-4 opacity-50" />
                   <p className="font-heading font-bold text-lg md:text-xl leading-snug mb-6 flex-1">"{review.text}"</p>
                   
                   <div className="flex items-center gap-3 border-t-2 border-current pt-4 opacity-80">
                      <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center font-bold text-sm bg-white/20">
                        {review.name[0]}
                      </div>
                      <div>
                        <h4 className="font-black text-sm uppercase tracking-wider">{review.name}</h4>
                        <p className="text-xs font-mono opacity-80">{review.role}</p>
                      </div>
                      <div className="ml-auto flex gap-0.5">
                        {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="currentColor" />)}
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Funky Footer CTA */}
      <section className="bg-funky-pink py-24 px-6 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-3xl mx-auto relative z-10 space-y-8">
          <h2 className="font-heading font-black text-4xl md:text-6xl">JOIN THE SOCK CLUB</h2>
          <p className="font-body text-lg md:text-xl opacity-90">Get 10% off your first order and early access to our wildest designs.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-6 py-4 rounded-xl text-funky-dark font-body focus:outline-none focus:ring-4 focus:ring-funky-yellow"
            />
            <button className="px-8 py-4 bg-funky-yellow text-funky-dark font-heading font-black rounded-xl hover:scale-105 transition-transform">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;