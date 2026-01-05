import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { Star, ShieldCheck, Zap, Anchor, ChevronDown, Check, ArrowRight, Flame, Trophy, Sparkles, X, Package, Leaf, Footprints, Microscope, Dumbbell, Activity, Gem, Droplets, Layers, Shirt, Maximize, Wind, Feather, CheckCircle2, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getOptimizedImageProps } from '../utils/imageOptimization';
import SEO from '../components/SEO';
import { generateProductSchema, generateBreadcrumbSchema } from '../utils/structuredData';

const GripSocksLP: React.FC = () => {
   const { products } = useProducts();
   const { addToCart } = useCart();

   // Get specific products dynamically from context
   const blackSock = products.find(p => p.id === 'grip-black');
   const greySock = products.find(p => p.id === 'grip-grey');

   // Fallback images if not loaded yet
   const blackImg = blackSock?.images[0] || 'https://images.unsplash.com/photo-1596707328151-61472554d32e?q=80&w=1000&auto=format&fit=crop';
   const greyImg = greySock?.images[0] || 'https://images.unsplash.com/photo-1621213233215-0b043b23c21c?q=80&w=1000&auto=format&fit=crop';

   const [openFaq, setOpenFaq] = useState<number | null>(0);
   const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minute countdown
   const [activeTab, setActiveTab] = useState<'black' | 'grey'>('black'); // For the 1-pack selector

   // Countdown timer for urgency
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

   const scrollToOffers = () => {
      const element = document.getElementById('offer-section');
      element?.scrollIntoView({ behavior: 'smooth' });
   };

   // --- BUNDLE LOGIC ---
   const handleBuySingle = () => {
      const product = activeTab === 'black' ? blackSock : greySock;
      if (product) {
         addToCart(product, 1, 'Free Size', 'landing-page', 'Grip Socks');
         showToast();
      }
   };

   const handleBuyDuo = () => {
      // 1 Black + 1 Grey
      if (blackSock) addToCart(blackSock, 1, 'Free Size');
      if (greySock) addToCart(greySock, 1, 'Free Size');
      showToast();
   };

   const handleBuySquad = () => {
      // 2 Black + 2 Grey
      if (blackSock) addToCart(blackSock, 2, 'Free Size');
      if (greySock) addToCart(greySock, 2, 'Free Size');
      showToast();
   };

   const showToast = () => {
      const banner = document.createElement('div');
      banner.innerText = "ADDED TO CART! 🛒";
      banner.className = "fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-funky-dark text-white px-6 py-3 rounded-full font-heading font-bold shadow-xl z-50 animate-bounce";
      document.body.appendChild(banner);
      setTimeout(() => banner.remove(), 2500);
   };

   // Structured data for grip socks landing page
   const structuredData = blackSock ? [
      generateProductSchema({
         id: blackSock.id,
         name: 'Premium Grip Socks for Yoga & Pilates',
         description: 'Ultra-cushioned grip socks with Terry Loop Tech to absorb sweat and prevent slips. Perfect for yoga, pilates, barre, and dance.',
         price: 299,
         currency: 'INR',
         image: blackImg,
         category: 'Grip Socks',
         brand: 'Jumplings',
         sku: blackSock.id,
         stock: blackSock.stock,
         rating: 4.9,
         reviewCount: 200,
      }),
      generateBreadcrumbSchema([
         { name: 'Home', url: 'https://jumplings.in/' },
         { name: 'Grip Socks', url: 'https://jumplings.in/grip-socks' }
      ])
   ] : [];

   return (
      <div className="animate-fade-in bg-white min-h-screen font-body text-funky-dark overflow-x-hidden">
         <SEO
            title="Premium Grip Socks for Yoga & Pilates | Jumplings - Anti-Slip, Terry Cushioned"
            description="Shop India's best grip socks with Nano-Grip™ technology. Terry loop cushioning, anti-slip silicone nodes. Perfect for yoga, pilates, barre. Free shipping. 30-day guarantee."
            keywords="grip socks, yoga socks, pilates socks, anti-slip socks, non-slip socks, barre socks, grip socks india, best grip socks, yoga grip socks"
            image={blackImg}
            type="product"
            structuredData={structuredData}
         />

         {/* 1. URGENCY BAR */}
         <div className="relative z-30 bg-funky-pink text-white text-center py-2.5 px-4 text-xs font-bold font-mono tracking-widest uppercase shadow-sm flex justify-center items-center gap-3">
            <Flame size={14} className="animate-pulse text-white" />
            <span>High Demand: <span className="underline decoration-2 underline-offset-2">Low Stock</span> | Offer Expires: <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded ml-1 font-black tabular-nums">{formatTime(timeLeft)}</span></span>
         </div>

         {/* 2. HERO SECTION */}
         <section className="relative pt-12 pb-20 px-6 bg-funky-light overflow-hidden">
            {/* Decorative Background Blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-funky-yellow/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-funky-blue/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
               <div className="space-y-10 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-default group">
                     <div className="flex gap-0.5 text-funky-yellow">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                     </div>
                     <span className="text-xs font-bold uppercase tracking-wide text-gray-500 group-hover:text-funky-dark transition-colors">Rated #1 by Yoga Instructors</span>
                  </div>

                  <h1 className="font-heading font-black text-6xl md:text-7xl lg:text-8xl tracking-tight text-funky-dark leading-[0.95] drop-shadow-sm">
                     STICK TO <br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-funky-blue to-funky-pink">THE MAT.</span>
                  </h1>

                  <p className="text-lg md:text-xl text-gray-600 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
                     Super Cool, Super Comfy. The ultra-cushioned grip sock with <strong className="text-funky-dark">Terry Loop Tech</strong> to absorb sweat and prevent slips.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start items-center">
                     <button onClick={scrollToOffers} className="px-10 py-5 bg-funky-dark text-white font-heading font-black text-xl rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group relative overflow-hidden">
                        <span className="relative z-10 flex items-center gap-2">GET THE DEAL <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" /></span>
                        <div className="absolute inset-0 bg-funky-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></div>
                     </button>
                     <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wide">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> 200+ purchased last hour
                     </div>
                  </div>
               </div>

               {/* Hero Image Composition */}
               <div className="relative mt-8 lg:mt-0">
                  <div className="absolute inset-0 bg-funky-blue/5 rounded-[3rem] transform rotate-6 scale-95"></div>
                  <div className="relative bg-white p-2 rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden group hover:shadow-funky-blue/20 transition-all duration-500">
                     {/* Split Image Effect */}
                     <div className="grid grid-cols-2 h-[400px] md:h-[550px] gap-1 rounded-[2rem] overflow-hidden">
                        <div className="relative bg-gray-100 overflow-hidden group-hover:flex-[1.1] transition-all duration-700 ease-out">
                           <img
                              {...getOptimizedImageProps(blackImg, 'Black Grip Sock', {
                                 priority: true,
                                 sizes: '(max-width: 768px) 50vw, 25vw'
                              })}
                              className="w-full h-full object-cover scale-[1.01] hover:scale-110 transition-transform duration-700"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                           <span className="absolute bottom-6 left-6 z-20 text-white font-heading font-black text-2xl uppercase tracking-widest drop-shadow-md">Midnight</span>
                        </div>
                        <div className="relative bg-gray-100 overflow-hidden group-hover:flex-[1.1] transition-all duration-700 ease-out">
                           <img
                              {...getOptimizedImageProps(greyImg, 'Grey Grip Sock', {
                                 priority: true,
                                 sizes: '(max-width: 768px) 50vw, 25vw'
                              })}
                              className="w-full h-full object-cover scale-[1.01] hover:scale-110 transition-transform duration-700"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                           <span className="absolute bottom-6 right-6 z-20 text-white font-heading font-black text-2xl uppercase tracking-widest drop-shadow-md">Slate</span>
                        </div>
                     </div>

                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md border border-gray-100 px-8 py-4 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.1)] whitespace-nowrap z-30 transform group-hover:scale-110 transition-all duration-500">
                        <p className="font-heading font-black text-funky-dark flex items-center gap-2 text-xl tracking-tight">
                           <Anchor size={24} className="text-funky-blue fill-funky-blue/20" /> NANO-GRIP™
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* 2.2 KEY BENEFITS GRID */}
         <section className="py-24 bg-white border-b border-gray-100 relative z-20">
            <div className="max-w-7xl mx-auto px-6">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  {/* One Size */}
                  <div className="flex flex-col items-center gap-4 p-6 rounded-3xl hover:bg-funky-light/30 transition-colors group cursor-default border border-transparent hover:border-funky-blue/20">
                     <div className="w-16 h-16 bg-white border border-gray-100 text-funky-blue rounded-2xl flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all">
                        <Maximize size={32} />
                     </div>
                     <div>
                        <h3 className="font-heading font-black text-lg md:text-xl text-funky-dark uppercase mb-1">ONE SIZE FITS ALL</h3>
                        <p className="text-sm text-gray-500 font-bold">Stretches to fit UK 4-9</p>
                     </div>
                  </div>
                  {/* Odor Free */}
                  <div className="flex flex-col items-center gap-4 p-6 rounded-3xl hover:bg-green-50/50 transition-colors group cursor-default border border-transparent hover:border-green-200/50">
                     <div className="w-16 h-16 bg-white border border-gray-100 text-green-600 rounded-2xl flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-all">
                        <Wind size={32} />
                     </div>
                     <div>
                        <h3 className="font-heading font-black text-lg md:text-xl text-funky-dark uppercase mb-1">ODOR FREE</h3>
                        <p className="text-sm text-gray-500 font-bold">Moisture wicking bamboo</p>
                     </div>
                  </div>
                  {/* Super Soft */}
                  <div className="flex flex-col items-center gap-4 p-6 rounded-3xl hover:bg-funky-pink/5 transition-colors group cursor-default border border-transparent hover:border-funky-pink/20">
                     <div className="w-16 h-16 bg-white border border-gray-100 text-funky-pink rounded-2xl flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all">
                        <Feather size={32} />
                     </div>
                     <div>
                        <h3 className="font-heading font-black text-lg md:text-xl text-funky-dark uppercase mb-1">SUPER SOFT</h3>
                        <p className="text-sm text-gray-500 font-bold">Cloud-like cushioning</p>
                     </div>
                  </div>
                  {/* Easy Care */}
                  <div className="flex flex-col items-center gap-4 p-6 rounded-3xl hover:bg-funky-yellow/10 transition-colors group cursor-default border border-transparent hover:border-funky-yellow/30">
                     <div className="w-16 h-16 bg-white border border-gray-100 text-funky-yellow rounded-2xl flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-all">
                        <Sparkles size={32} />
                     </div>
                     <div>
                        <h3 className="font-heading font-black text-lg md:text-xl text-funky-dark uppercase mb-1">MACHINE WASH</h3>
                        <p className="text-sm text-gray-500 font-bold">Durable through cycles</p>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* 2.5. ANATOMY OF STABILITY (Updated vibrancy) */}
         <section className="py-24 px-6 bg-funky-light overflow-hidden relative">
            <div className="max-w-6xl mx-auto relative z-10">
               <div className="text-center mb-20">
                  <span className="text-funky-blue font-bold tracking-widest uppercase text-sm mb-2 block">Technology</span>
                  <h2 className="font-heading font-black text-4xl md:text-5xl text-funky-dark mb-6 drop-shadow-sm">ENGINEERED FOR <span className="text-funky-blue">BALANCE</span></h2>
                  <p className="text-gray-600 font-medium text-lg max-w-2xl mx-auto leading-relaxed">More than just socks. This is sports equipment for your feet, designed with biomechanics in mind.</p>
               </div>

               <div className="relative flex flex-col md:flex-row items-center justify-center gap-16">
                  {/* Left Specs */}
                  <div className="space-y-12 flex-1 md:text-right">
                     <div className="relative group bg-white p-6 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                        <h3 className="font-heading font-black text-xl mb-3 flex items-center md:justify-end gap-3 text-funky-pink"><Layers size={22} /> Terry Loop Cushioning</h3>
                        <p className="text-sm text-gray-600 font-medium leading-relaxed">Thick, towel-like interior absorbs shock during jumps and wicks away sweat instantly, keeping you dry.</p>
                     </div>
                     <div className="relative group bg-white p-6 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                        <h3 className="font-heading font-black text-xl mb-3 flex items-center md:justify-end gap-3 text-funky-blue"><Activity size={22} /> 360° Arch Band</h3>
                        <p className="text-sm text-gray-600 font-medium leading-relaxed">High-retention elastane band hugs your mid-foot. No bunching, no twisting—just pure focus.</p>
                     </div>
                  </div>

                  {/* Center Image */}
                  <div className="relative w-full max-w-sm aspect-[3/4] rounded-full border border-gray-200 p-3 bg-white shadow-2xl">
                     <div className="w-full h-full bg-funky-light rounded-full overflow-hidden relative shadow-inner">
                        <img
                           {...getOptimizedImageProps(blackImg, 'Anatomy', {
                              sizes: '(max-width: 768px) 100vw, 33vw'
                           })}
                           className="w-full h-full object-cover transform scale-110"
                        />
                        {/* Overlay pointers */}
                        <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-funky-yellow border-4 border-white rounded-full animate-ping opacity-75"></div>
                        <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-funky-yellow border-4 border-white rounded-full flex items-center justify-center z-10 shadow-lg"><span className="text-xs font-black text-funky-dark">1</span></div>

                        <div className="absolute bottom-1/4 right-1/4 w-8 h-8 bg-funky-pink border-4 border-white rounded-full animate-ping delay-75 opacity-75"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-8 h-8 bg-funky-pink border-4 border-white rounded-full flex items-center justify-center z-10 shadow-lg"><span className="text-xs font-black text-white">2</span></div>
                     </div>
                  </div>

                  {/* Right Specs */}
                  <div className="space-y-12 flex-1">
                     <div className="relative group bg-white p-6 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                        <h3 className="font-heading font-black text-xl mb-3 flex items-center gap-3 text-funky-yellow"><Gem size={22} /> Anti-Skid Technology</h3>
                        <p className="text-sm text-gray-600 font-medium leading-relaxed">Heat-fused silicone nodes provide grip, stability, and balance on any floor surface.</p>
                     </div>
                     <div className="relative group bg-white p-6 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                        <h3 className="font-heading font-black text-xl mb-3 flex items-center gap-3 text-funky-dark"><Wind size={22} /> Breathable Cotton</h3>
                        <p className="text-sm text-gray-600 font-medium leading-relaxed">Premium combed cotton allows top airflow to keep feet cool during intense workouts.</p>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* 2.6 MATERIAL & CARE (Updated vibrancy) */}
         <section className="py-24 px-6 bg-white border-t border-gray-100">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
               <div>
                  <div className="flex items-center gap-3 mb-8">
                     <span className="bg-green-100 p-2.5 rounded-xl text-green-600"><Shirt size={24} /></span>
                     <h3 className="font-heading font-black text-3xl text-funky-dark">FABRIC LAB</h3>
                  </div>

                  <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-green-900/5 border border-gray-100 relative overflow-hidden group hover:shadow-green-900/10 transition-all">
                     <div className="absolute -right-10 -top-10 w-40 h-40 bg-green-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                     <div className="flex items-center gap-8 mb-10 relative z-10">
                        <div className="w-28 h-28 bg-funky-dark rounded-full flex items-center justify-center border-4 border-green-400 shadow-xl relative">
                           <span className="text-white font-black text-4xl">80%</span>
                           <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                        </div>
                        <div>
                           <h4 className="font-heading font-black text-3xl text-funky-dark mb-1">COMBED COTTON</h4>
                           <p className="text-base font-bold text-gray-500">Soft, breathable, natural.</p>
                        </div>
                     </div>

                     <div className="w-full h-3 bg-gray-100 rounded-full mb-8 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-400 to-funky-green w-[80%] relative">
                           <div className="absolute right-0 top-0 h-full w-1 bg-white/50"></div>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4 text-sm font-bold text-gray-600">
                        <span className="flex items-center gap-2 bg-blue-50 p-3 rounded-xl border border-blue-100">
                           <span className="w-3 h-3 bg-blue-500 rounded-full"></span> 15% Spandex
                        </span>
                        <span className="flex items-center gap-2 bg-pink-50 p-3 rounded-xl border border-pink-100">
                           <span className="w-3 h-3 bg-funky-pink rounded-full"></span> 5% Elastane
                        </span>
                     </div>
                  </div>
               </div>

               <div>
                  <div className="flex items-center gap-3 mb-8">
                     <span className="bg-blue-100 p-2.5 rounded-xl text-funky-blue"><Droplets size={24} /></span>
                     <h3 className="font-heading font-black text-3xl text-funky-dark">CARE GUIDE</h3>
                  </div>

                  <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-gray-100 grid grid-cols-2 gap-6 relative">
                     {[
                        { icon: "🧺", title: "Machine Wash Cold", sub: "Gentle cycle" },
                        { icon: "🔄", title: "Wash Inside Out", sub: "Protect the grips" },
                        { icon: "❌", title: "Do Not Bleach", sub: "Keep colors pop" },
                        { icon: "🌬️", title: "Air Dry Only", sub: "No tumble dry" }
                     ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-lg hover:scale-105 transition-all group cursor-default border border-transparent hover:border-gray-100">
                           <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">{item.icon}</span>
                           <span className="text-xs font-black uppercase text-funky-dark tracking-wide">{item.title}</span>
                           <span className="text-[10px] font-bold text-gray-400 mt-1">{item.sub}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </section>

         {/* 2.7. USAGE SCENARIOS (Enhanced Vibrancy) */}
         <section className="py-24 px-6 bg-funky-dark relative overflow-hidden" id="usage-scenarios">
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed"></div>
            <div className="max-w-7xl mx-auto relative z-10">
               <h2 className="font-heading font-black text-4xl md:text-5xl text-white mb-16 text-center">PERFECT FOR...</h2>

               <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  {[
                     { title: "Pilates", icon: <Activity />, desc: "Reformer & Mat", color: "text-funky-pink", bg: "group-hover:bg-funky-pink" },
                     { title: "Yoga", icon: <Flame />, desc: "Hot & Hatha", color: "text-funky-yellow", bg: "group-hover:bg-funky-yellow" },
                     { title: "Barre", icon: <Dumbbell />, desc: "Stability & Pliés", color: "text-funky-blue", bg: "group-hover:bg-funky-blue" },
                     { title: "Aerial", icon: <Wind />, desc: "Silks & Hoops", color: "text-funky-green", bg: "group-hover:bg-funky-green" },
                     { title: "Dance", icon: <Anchor />, desc: "Studio Safety", color: "text-purple-400", bg: "group-hover:bg-purple-400" }
                  ].map((use, i) => (
                     <div key={i} className={`bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10 hover:border-white/30 hover:-translate-y-2 hover:bg-white/10 transition-all group flex flex-col items-center text-center cursor-default`}>
                        <div className={`w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center ${use.color} mb-4 border border-white/10 group-hover:scale-110 group-hover:bg-white group-hover:text-funky-dark transition-all duration-300`}>
                           {use.icon}
                        </div>
                        <h3 className="font-heading font-black text-xl mb-1 text-white group-hover:text-funky-yellow transition-colors">{use.title}</h3>
                        <p className="text-xs text-white/50 font-bold uppercase tracking-wide group-hover:text-white/80">{use.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* 3. HYGIENE & PROTECTION */}
         <section className="py-24 px-6 bg-white border-b border-gray-100" id="hygiene-protection">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
               <div className="relative">
                  <div className="absolute top-0 -left-6 w-24 h-24 bg-funky-green rounded-full opacity-10 animate-bounce-slow"></div>
                  <div className="bg-funky-light/50 backdrop-blur-sm rounded-[2.5rem] p-10 border border-gray-100 relative z-10 shadow-xl">
                     <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-md text-funky-green">
                        <Microscope size={32} />
                     </div>
                     <h2 className="font-heading font-black text-3xl md:text-4xl text-funky-dark mb-4">STUDIO FLOORS ARE... GROSS.</h2>
                     <p className="text-lg text-gray-600 font-medium mb-8 leading-relaxed">
                        Hundreds of feet walk on that studio floor every day. Going barefoot? That's a brave choice.
                     </p>
                     <ul className="space-y-5">
                        <li className="flex items-center gap-4 text-funky-dark font-bold">
                           <div className="bg-green-100 p-1 rounded-full"><Check size={14} className="text-green-600" /></div> Protects against fungus & bacteria
                        </li>
                        <li className="flex items-center gap-4 text-funky-dark font-bold">
                           <div className="bg-green-100 p-1 rounded-full"><Check size={14} className="text-green-600" /></div> Keeps your feet clean & warm
                        </li>
                        <li className="flex items-center gap-4 text-funky-dark font-bold">
                           <div className="bg-green-100 p-1 rounded-full"><Check size={14} className="text-green-600" /></div> Respectful to other yogis
                        </li>
                     </ul>
                  </div>
               </div>
               <div className="text-center md:text-left">
                  <span className="bg-funky-green text-white px-4 py-1 rounded-full font-mono font-bold text-xs uppercase mb-4 inline-block">Hygiene First</span>
                  <h3 className="font-heading font-black text-4xl mb-4">THE INVISIBLE SHIELD</h3>
                  <p className="text-gray-500 leading-relaxed mb-8">
                     Jumplings aren't just about grip. They are your personal barrier against the "yuck" factor of shared public spaces. Our organic cotton blend is naturally antibacterial and machine washable.
                  </p>
                  <button onClick={scrollToOffers} className="px-8 py-3 border-2 border-funky-dark text-funky-dark font-heading font-black rounded-xl hover:bg-funky-dark hover:text-white transition-all">
                     PROTECT MY FEET
                  </button>
               </div>
            </div>
         </section>

         {/* 3.5 REVIEWS (Enhanced with Verified Badge) */}
         <section className="py-20 px-6 bg-funky-light">
            <div className="max-w-6xl mx-auto">
               <h2 className="font-heading font-black text-3xl text-center mb-12">REAL YOGIS, REAL GRIP</h2>
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                     {
                        name: "Ananya R.",
                        rating: 5,
                        title: "Better than my ₹900 pair",
                        text: "I used to buy expensive brands, but these have thicker cushioning and the grip actually stays on after washing. The heel tab is a lifesaver for blisters.",
                        tag: "Pilates Instructor"
                     },
                     {
                        name: "Deepak S.",
                        rating: 5,
                        title: "Perfect for sweaty feet",
                        text: "My feet sweat a lot during hot yoga. These absorb everything thanks to the terry lining. No sliding inside the sock either.",
                        tag: "Verified Buyer"
                     },
                     {
                        name: "Meera K.",
                        rating: 5,
                        title: "Finally fits UK 5 correctly",
                        text: "Most one-size socks are too big and bunch up. These have a tight arch band that molds to my foot. Super secure.",
                        tag: "Verified Buyer"
                     },
                     {
                        name: "Arjun V.",
                        rating: 5,
                        title: "Survived the rope climb",
                        text: "I do Crossfit and sometimes Yoga for mobility. These socks are tough. The grip nodes didn't peel off even after rough use.",
                        tag: "Crossfit Athlete"
                     },
                     {
                        name: "Sarah L.",
                        rating: 5,
                        title: "Cute and functional",
                        text: "The ballet strap design is so pretty! I get compliments in every Barre class. Plus they actually work.",
                        tag: "Barre Enthusiast"
                     },
                     {
                        name: "Rohan D.",
                        rating: 5,
                        title: "No more slipping on tiles",
                        text: "I workout at home on marble floors. These are a game changer for lunges and planks. No more slipping risk.",
                        tag: "Home Gym User"
                     }
                  ].map((review, i) => (
                     <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex gap-1 text-funky-yellow mb-3">
                           {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                        </div>
                        <h4 className="font-bold text-lg mb-2">{review.title}</h4>
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">"{review.text}"</p>
                        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                           <span className="font-bold text-sm text-funky-dark">{review.name}</span>
                           <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full uppercase font-bold flex items-center gap-1">
                              <CheckCircle2 size={10} /> {review.tag}
                           </span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* 4. THE FUNNEL - NOW WITH IMAGES */}
         <section id="offer-section" className="py-24 px-6 bg-funky-dark relative overflow-hidden">
            {/* Background Patterns */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed"></div>

            <div className="max-w-7xl mx-auto relative z-10">
               <div className="text-center mb-16 text-white">
                  <span className="bg-funky-green text-funky-dark px-4 py-1.5 rounded-full font-mono font-bold text-xs uppercase tracking-widest border border-white/20 inline-block mb-6 shadow-lg">Limited Stock</span>
                  <h2 className="font-heading font-black text-4xl md:text-6xl mb-6">BUILD YOUR BUNDLE</h2>
                  <p className="opacity-80 text-xl max-w-2xl mx-auto font-medium">More pairs = More savings. It's basically free money.</p>
               </div>

               <div className="grid lg:grid-cols-3 gap-8 items-end">

                  {/* TIER 1: The Tester */}
                  <div className="bg-white p-6 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col hover:-translate-y-1 transition-transform duration-300">
                     {/* Selector */}
                     <div className="flex bg-gray-100 p-1.5 rounded-xl mb-6">
                        <button onClick={() => setActiveTab('black')} className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${activeTab === 'black' ? 'bg-white text-funky-dark shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Black</button>
                        <button onClick={() => setActiveTab('grey')} className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${activeTab === 'grey' ? 'bg-white text-funky-dark shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Grey</button>
                     </div>

                     {/* Dynamic Product Image */}
                     <div className="w-full aspect-square bg-gray-50 rounded-2xl mb-6 overflow-hidden border border-gray-100 relative group">
                        <img
                           {...getOptimizedImageProps(
                              activeTab === 'black' ? blackImg : greyImg,
                              'Selected Sock',
                              { sizes: '(max-width: 768px) 100vw, 33vw' }
                           )}
                           className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                        />
                     </div>

                     <div className="bg-gray-50 rounded-2xl p-4 mb-4 text-center border border-gray-100">
                        <h3 className="font-heading font-black text-2xl text-funky-dark mb-1">THE TESTER</h3>
                        <p className="text-gray-500 text-sm font-bold">1 PAIR</p>
                     </div>

                     <div className="text-center mb-8">
                        <span className="text-5xl font-heading font-black text-funky-dark">₹299</span>
                     </div>

                     <button onClick={handleBuySingle} className="w-full py-4 bg-white border-2 border-funky-dark text-funky-dark font-heading font-black rounded-2xl hover:bg-funky-dark hover:text-white transition-all uppercase tracking-wide group">
                        Add 1 Pair <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                     </button>
                  </div>

                  {/* TIER 2: The Smart Choice (Featured) */}
                  <div className="bg-gradient-to-b from-funky-yellow to-yellow-400 p-1 rounded-[2.5rem] shadow-[0_0_60px_rgba(255,209,102,0.4)] relative transform lg:-translate-y-8 z-10 flex flex-col hover:scale-[1.02] transition-transform duration-300">
                     <div className="bg-white rounded-[2.3rem] p-6 h-full flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-2 bg-funky-yellow/20"></div>
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-funky-dark text-white font-black px-6 py-2 rounded-full uppercase tracking-widest text-xs border-4 border-white shadow-lg flex items-center gap-2 whitespace-nowrap z-20">
                           <Sparkles size={12} className="text-funky-yellow" /> Most Popular
                        </div>

                        {/* Visual Stack of 2 Socks */}
                        <div className="relative w-full aspect-square mb-6 mt-6 group">
                           <div className="absolute top-0 right-0 w-[75%] h-[75%] rounded-[1.5rem] overflow-hidden border border-gray-100 shadow-md z-10 bg-white transform rotate-3 group-hover:rotate-6 transition-transform duration-500">
                              <img
                                 {...getOptimizedImageProps(greyImg, 'Grey', {
                                    sizes: '(max-width: 768px) 75vw, 25vw'
                                 })}
                                 className="w-full h-full object-cover"
                              />
                           </div>
                           <div className="absolute bottom-0 left-0 w-[75%] h-[75%] rounded-[1.5rem] overflow-hidden border border-gray-100 shadow-xl z-20 bg-white transform -rotate-3 group-hover:-rotate-6 transition-transform duration-500">
                              <img
                                 {...getOptimizedImageProps(blackImg, 'Black', {
                                    sizes: '(max-width: 768px) 75vw, 25vw'
                                 })}
                                 className="w-full h-full object-cover"
                              />
                           </div>
                        </div>

                        <div className="bg-funky-yellow/10 rounded-2xl p-4 mb-4 text-center border border-funky-yellow/20">
                           <h3 className="font-heading font-black text-3xl text-funky-dark mb-1">THE SMART PACK</h3>
                           <p className="text-funky-dark/80 text-sm font-bold">2 PAIRS (1 Black + 1 Grey)</p>
                        </div>

                        <div className="text-center mb-2">
                           <span className="text-gray-400 line-through text-lg font-bold mr-3">₹598</span>
                           <span className="text-6xl font-heading font-black text-funky-dark">₹499</span>
                        </div>
                        <div className="text-center mb-8">
                           <span className="bg-funky-green/10 text-green-700 px-3 py-1 rounded-lg text-xs font-bold uppercase border border-green-200">Save ₹100 Instantly</span>
                        </div>

                        <button onClick={handleBuyDuo} className="w-full py-5 bg-funky-dark text-white font-heading font-black text-xl rounded-2xl hover:bg-funky-blue transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 uppercase flex items-center justify-center gap-3 group">
                           Get The Duo <Sparkles size={20} className="text-funky-yellow animate-pulse" />
                        </button>
                     </div>
                  </div>

                  {/* TIER 3: The Stock Up */}
                  <div className="bg-gradient-to-b from-funky-blue to-blue-600 p-6 rounded-[2rem] border border-white/20 shadow-2xl text-white flex flex-col hover:-translate-y-1 transition-transform duration-300">
                     {/* Grid of 4 Socks */}
                     <div className="grid grid-cols-2 gap-3 mb-6">
                        <img
                           {...getOptimizedImageProps(blackImg, 'Black Sock', {
                              sizes: '(max-width: 768px) 45vw, 12vw'
                           })}
                           className="rounded-2xl border-2 border-white/20 aspect-square object-cover"
                        />
                        <img
                           {...getOptimizedImageProps(greyImg, 'Grey Sock', {
                              sizes: '(max-width: 768px) 45vw, 12vw'
                           })}
                           className="rounded-2xl border-2 border-white/20 aspect-square object-cover"
                        />
                        <img
                           {...getOptimizedImageProps(greyImg, 'Grey Sock', {
                              sizes: '(max-width: 768px) 45vw, 12vw'
                           })}
                           className="rounded-2xl border-2 border-white/20 aspect-square object-cover"
                        />
                        <img
                           {...getOptimizedImageProps(blackImg, 'Black Sock', {
                              sizes: '(max-width: 768px) 45vw, 12vw'
                           })}
                           className="rounded-2xl border-2 border-white/20 aspect-square object-cover"
                        />
                     </div>

                     <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4 text-center border border-white/20">
                        <h3 className="font-heading font-black text-2xl text-white mb-1">THE SQUAD</h3>
                        <p className="text-white/80 text-sm font-bold">4 PAIRS (2 Black + 2 Grey)</p>
                     </div>

                     <div className="text-center mb-2">
                        <span className="text-white/40 line-through text-lg font-bold mr-3">₹1196</span>
                        <span className="text-5xl font-heading font-black text-white">₹799</span>
                     </div>
                     <div className="text-center mb-8">
                        <span className="bg-white/20 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase border border-white/20">Best Value (Save ₹397)</span>
                     </div>

                     <button onClick={handleBuySquad} className="w-full py-4 bg-white text-funky-blue font-heading font-black rounded-2xl hover:bg-funky-light transition-colors uppercase border-b-4 border-black/10 active:border-b-0 active:translate-y-1 group">
                        Add 4-Pack <span className="inline-block transition-transform group-hover:rotate-12">✨</span>
                     </button>
                  </div>

               </div>
            </div>
         </section>

         {/* 5. THE PROMISE */}
         <section className="bg-funky-yellow py-12 px-6 border-b-4 border-funky-dark relative overflow-hidden pattern-dots">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 relative z-10">
               <div className="bg-white p-6 rounded-full border-4 border-funky-dark shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0 transform rotate-[-6deg] hover:rotate-6 transition-transform">
                  <Trophy size={48} className="text-funky-dark" />
               </div>
               <div className="text-center md:text-left">
                  <h2 className="font-heading font-black text-3xl md:text-4xl text-funky-dark mb-2 uppercase">The "Never Slip" Promise</h2>
                  <p className="font-bold text-funky-dark text-lg md:text-xl leading-relaxed">
                     Try them for 30 days. If you don't feel more stable in your practice, we'll refund you. No questions asked. You don't even have to send the used socks back.
                  </p>
               </div>
            </div>
         </section>

         {/* 6. COMPARISON TABLE - REDESIGNED */}
         <section className="py-24 px-6 bg-funky-dark text-white relative overflow-hidden" id="comparison-table">
            {/* Background flair */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-funky-pink rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-funky-blue rounded-full blur-[100px] opacity-20 translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-6xl mx-auto relative z-10">
               <div className="text-center mb-16">
                  <h2 className="font-heading font-black text-4xl md:text-6xl mb-4 leading-tight">
                     DOMINATING THE MAT <br className="hidden md:block" />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-funky-yellow to-funky-green">WITHOUT DRAINING THE WALLET</span>
                  </h2>
                  <p className="text-xl opacity-80 max-w-2xl mx-auto">
                     We cut out the middlemen, the fancy retail rent, and the corporate fluff. You get pro-grade gear for the price of a latte.
                  </p>
               </div>

               <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* THEM - The Overpriced Competitor */}
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 relative hover:bg-white/10 transition-all duration-500 group">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-700/80 backdrop-blur-sm text-white px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg border border-white/10">The "Big Brands"</div>

                     <div className="text-center mb-10">
                        <h3 className="font-heading font-black text-3xl text-gray-400 mb-2 group-hover:text-gray-300 transition-colors">OVERPRICED HYPE</h3>
                        <div className="text-4xl font-mono font-bold text-gray-500 line-through decoration-red-500/80 decoration-4">₹899</div>
                        <p className="text-xs text-gray-500 font-bold uppercase mt-2 tracking-widest">PER PAIR</p>
                     </div>

                     <ul className="space-y-6 text-gray-400 font-medium text-sm md:text-base">
                        <li className="flex items-center justify-between border-b border-white/10 pb-4">
                           <span>Grip Quality</span>
                           <span className="text-right">Standard PVC Dots<br /><span className="text-xs opacity-60 font-normal">(Falls off after 5 washes)</span></span>
                        </li>
                        <li className="flex items-center justify-between border-b border-white/10 pb-4">
                           <span>Cushioning</span>
                           <span className="text-right">Thin Flat Knit<br /><span className="text-xs opacity-60 font-normal">(Zero shock absorption)</span></span>
                        </li>
                        <li className="flex items-center justify-between border-b border-white/10 pb-4">
                           <span>Fabric</span>
                           <span className="text-right">Synthetic Polyester<br /><span className="text-xs opacity-60 font-normal">(Sweaty feet alert 💧)</span></span>
                        </li>
                     </ul>
                     <div className="mt-8 text-center opacity-30 group-hover:opacity-50 transition-opacity">
                        <X className="w-16 h-16 mx-auto text-red-500" />
                     </div>
                  </div>

                  {/* US - Jumplings */}
                  <div className="bg-white text-funky-dark border-4 border-funky-yellow rounded-[2.5rem] p-8 md:p-12 relative shadow-[0_0_80px_rgba(255,209,102,0.4)] transform md:scale-105 z-20 hover:scale-[1.06] transition-transform duration-500">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-funky-yellow text-funky-dark px-8 py-3 rounded-full font-black text-lg uppercase tracking-widest shadow-xl flex items-center gap-2 border-2 border-white">
                        <Trophy size={20} /> The Champion
                     </div>

                     <div className="text-center mb-10 pt-4">
                        <h3 className="font-heading font-black text-4xl text-funky-dark mb-2">JUMPLINGS</h3>
                        <div className="text-6xl font-heading font-black text-funky-blue drop-shadow-sm">₹199</div>
                        <p className="text-xs text-funky-dark/60 font-bold uppercase mt-2 tracking-widest">PER PAIR (AS LOW AS)</p>
                     </div>

                     <ul className="space-y-6 font-bold text-lg">
                        <li className="flex items-center justify-between border-b-2 border-gray-100 pb-4">
                           <span className="flex items-center gap-2 text-sm md:text-lg"><Anchor size={20} className="text-funky-blue" /> Grip Quality</span>
                           <span className="text-right text-funky-blue text-sm md:text-lg leading-tight">Nano-Grip™ Tech<br /><span className="text-xs text-gray-400 font-medium">(Indestructible heat-fusion)</span></span>
                        </li>
                        <li className="flex items-center justify-between border-b-2 border-gray-100 pb-4">
                           <span className="flex items-center gap-2 text-sm md:text-lg"><Layers size={20} className="text-funky-yellow" /> Cushioning</span>
                           <span className="text-right text-funky-yellow text-sm md:text-lg leading-tight">Terry Loop Padding<br /><span className="text-xs text-gray-400 font-medium">(Like walking on clouds)</span></span>
                        </li>
                        <li className="flex items-center justify-between border-b-2 border-gray-100 pb-4">
                           <span className="flex items-center gap-2 text-sm md:text-lg"><Leaf size={20} className="text-green-600" /> Fabric</span>
                           <span className="text-right text-green-600 text-sm md:text-lg leading-tight">Organic Bamboo<br /><span className="text-xs text-gray-400 font-medium">(Cloud-soft & breathable)</span></span>
                        </li>
                     </ul>

                     <div className="mt-10">
                        <button onClick={scrollToOffers} className="w-full py-4 bg-funky-dark text-white font-heading font-black text-xl rounded-2xl shadow-xl hover:bg-funky-pink transition-all flex items-center justify-center gap-2 hover:scale-[1.02] group/btn">
                           UPGRADE MY PRACTICE <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* 7. FAQ */}
         <section className="py-20 px-6 bg-white">
            <div className="max-w-3xl mx-auto space-y-4">
               <h2 className="font-heading font-black text-3xl text-center mb-10 text-funky-dark">QUESTIONS?</h2>
               {[
                  { q: "Do these fit big feet?", a: "Yes! Our bamboo blend with 5% elastane is super stretchy. Fits UK sizes 4-8 comfortably (Free Size)." },
                  { q: "Will they shrink in the wash?", a: "Our cotton is pre-shrunk! As long as you wash cold and air dry, they will maintain their shape for years." },
                  { q: "Can I wear them inside shoes?", a: "Absolutely! The grips are thin enough to fit inside sneakers if you need extra traction during a run or gym session." },
                  { q: "What is your return policy?", a: "We offer a 30-day 'Never Slip' guarantee. If you don't feel more stable, you get a refund. No questions asked." },
                  { q: "How do I wash them?", a: "Machine wash cold inside out. Do not tumble dry hot as it might affect the grips over time. Air dry is best!" },
                  { q: "Why can't I pick colors in the 4-pack?", a: "To keep the price this low (₹799), we pre-pack them in the factory as 2 Black + 2 Grey. Efficient = Cheaper for you." },
                  { q: "How fast is shipping?", a: "Orders before 12 PM ship same day. Metro cities get them in 2-3 days." }
               ].map((item, i) => (
                  <div key={i} className="border-2 border-funky-dark/10 rounded-2xl overflow-hidden hover:border-funky-blue transition-colors bg-white">
                     <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full flex justify-between items-center p-6 text-left font-bold text-funky-dark"
                     >
                        {item.q}
                        <ChevronDown className={`transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-funky-blue' : ''}`} size={20} />
                     </button>
                     {openFaq === i && (
                        <div className="p-6 pt-0 text-gray-600 leading-relaxed text-sm font-medium border-t border-gray-100">
                           {item.a}
                        </div>
                     )}
                  </div>
               ))}
            </div>
         </section>

         {/* 8. Sticky Mobile Bar (Updated Layout) */}
         <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-100 p-4 z-50 flex items-center justify-between shadow-[0_-5px_30px_rgba(0,0,0,0.1)] pb-safe" id="sticky-footer">
            <div>
               <div className="font-heading font-black text-2xl text-funky-dark leading-none mb-1">₹499 <span className="text-sm font-bold text-gray-400 font-body">/ 2 pairs</span></div>
               <div className="text-[10px] font-bold text-green-600 flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full w-fit"><Truck size={10} /> Free Shipping</div>
            </div>
            <button onClick={scrollToOffers} className="bg-funky-dark text-white px-8 py-3.5 rounded-xl font-heading font-black uppercase tracking-wide shadow-lg active:scale-95 transition-all">
               BUY NOW
            </button>
         </div>

      </div>
   );
};

export default GripSocksLP;