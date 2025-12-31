import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { Star, ShieldCheck, Zap, Anchor, ChevronDown, Check, ArrowRight, Flame, Trophy, Sparkles, X, Package, Leaf, Footprints, Microscope, Dumbbell, Activity, Gem, Droplets, Layers, Shirt, Maximize, Wind, Feather, CheckCircle2, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

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
        addToCart(product, 1, 'Free Size');
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

  return (
    <div className="animate-fade-in bg-white min-h-screen font-body text-funky-dark overflow-x-hidden">
      
      {/* 1. URGENCY BAR */}
      <div className="relative z-30 bg-funky-pink text-white text-center py-3 px-4 text-xs md:text-sm font-bold font-mono tracking-widest uppercase shadow-md flex justify-center items-center gap-3 border-b-4 border-funky-dark/20">
        <Flame size={16} className="animate-pulse text-funky-yellow" />
        <span>Stock Level: LOW | Offer Expires: <span className="bg-white text-funky-pink px-2 py-0.5 rounded ml-1 font-black">{formatTime(timeLeft)}</span></span>
      </div>

      {/* 2. HERO SECTION */}
      <section className="relative pt-8 pb-12 px-6 bg-funky-light overflow-hidden">
        {/* Decorative Background Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-funky-yellow rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-funky-blue rounded-full blur-3xl opacity-20 translate-y-1/3 -translate-x-1/4"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-8 text-center lg:text-left">
                 <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border-2 border-funky-dark shadow-[4px_4px_0px_0px_rgba(7,59,76,1)] transform -rotate-2 hover:rotate-0 transition-transform cursor-default">
                    <div className="flex gap-1 text-funky-yellow">
                        {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wide text-funky-dark">Rated #1 by Yoga Instructors</span>
                </div>
                
                <h1 className="font-heading font-black text-6xl md:text-8xl tracking-tight text-funky-dark leading-[0.9]">
                    STICK TO <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-funky-pink to-funky-yellow">THE MAT.</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-600 font-medium max-w-lg mx-auto lg:mx-0">
                    Super Cool, Super Comfy. The ultra-cushioned grip sock with <strong>Terry Loop Tech</strong> to absorb sweat and prevent slips.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <button onClick={scrollToOffers} className="px-8 py-4 bg-funky-dark text-white font-heading font-black text-xl rounded-xl shadow-[6px_6px_0px_0px_#118AB2] hover:shadow-[3px_3px_0px_0px_#118AB2] hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2 group">
                        GET THE DEAL <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform"/>
                    </button>
                    <div className="flex items-center justify-center gap-2 text-sm font-bold text-gray-500">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> 200+ purchased last hour
                    </div>
                </div>
            </div>

            {/* Hero Image Composition */}
            <div className="relative">
                <div className="absolute inset-0 bg-funky-pink rounded-[3rem] transform rotate-6 scale-95 opacity-20"></div>
                <div className="relative bg-white p-4 rounded-[2.5rem] border-4 border-funky-dark shadow-[12px_12px_0px_0px_rgba(7,59,76,1)] overflow-hidden group">
                     {/* Split Image Effect */}
                     <div className="grid grid-cols-2 h-[400px] md:h-[500px] gap-1">
                         <div className="overflow-hidden rounded-l-2xl relative bg-gray-100">
                             <img 
                                src={blackImg} 
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
                                alt="Black Grip Sock"
                             />
                             <span className="absolute bottom-4 left-4 z-20 text-white font-black font-heading text-xl uppercase tracking-widest drop-shadow-md">Midnight</span>
                         </div>
                         <div className="overflow-hidden rounded-r-2xl relative bg-gray-100">
                             <img 
                                src={greyImg} 
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
                                alt="Grey Grip Sock"
                             />
                             <span className="absolute bottom-4 right-4 z-20 text-white font-black font-heading text-xl uppercase tracking-widest drop-shadow-md">Slate</span>
                         </div>
                     </div>
                     
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur border-4 border-funky-yellow px-6 py-3 rounded-full shadow-2xl whitespace-nowrap z-30 transform hover:scale-110 transition-transform cursor-default">
                        <p className="font-heading font-black text-funky-dark flex items-center gap-2 text-xl">
                           <Anchor size={24} className="text-funky-blue" /> NANO-GRIP™
                        </p>
                     </div>
                </div>
            </div>
        </div>
      </section>

      {/* 2.2 KEY BENEFITS GRID */}
      <section className="py-12 bg-white border-b-2 border-gray-100 relative z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
             {/* One Size */}
             <div className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 transition-colors group cursor-default">
                <div className="w-16 h-16 bg-white border-2 border-funky-blue text-funky-blue rounded-full flex items-center justify-center mb-2 shadow-[4px_4px_0px_0px_#118AB2] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
                   <Maximize size={32} />
                </div>
                <h3 className="font-heading font-black text-lg md:text-xl text-funky-dark uppercase">ONE SIZE FITS ALL</h3>
                <p className="text-sm text-gray-500 font-bold">Stretches to fit UK 4-9</p>
             </div>
             {/* Odor Free */}
             <div className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 transition-colors group cursor-default">
                <div className="w-16 h-16 bg-white border-2 border-green-600 text-green-600 rounded-full flex items-center justify-center mb-2 shadow-[4px_4px_0px_0px_#06D6A0] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
                   <Wind size={32} />
                </div>
                <h3 className="font-heading font-black text-lg md:text-xl text-funky-dark uppercase">ODOR FREE</h3>
                <p className="text-sm text-gray-500 font-bold">Moisture wicking bamboo</p>
             </div>
             {/* Super Soft */}
             <div className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 transition-colors group cursor-default">
                <div className="w-16 h-16 bg-white border-2 border-funky-pink text-funky-pink rounded-full flex items-center justify-center mb-2 shadow-[4px_4px_0px_0px_#EF476F] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
                   <Feather size={32} />
                </div>
                <h3 className="font-heading font-black text-lg md:text-xl text-funky-dark uppercase">SUPER SOFT</h3>
                <p className="text-sm text-gray-500 font-bold">Cloud-like cushioning</p>
             </div>
             {/* Easy Care */}
             <div className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 transition-colors group cursor-default">
                <div className="w-16 h-16 bg-white border-2 border-funky-yellow text-funky-yellow rounded-full flex items-center justify-center mb-2 shadow-[4px_4px_0px_0px_#FFD166] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
                   <Sparkles size={32} />
                </div>
                <h3 className="font-heading font-black text-lg md:text-xl text-funky-dark uppercase">MACHINE WASH</h3>
                <p className="text-sm text-gray-500 font-bold">Durable through cycles</p>
             </div>
          </div>
        </div>
      </section>

      {/* 2.5. ANATOMY OF STABILITY (Updated vibrancy) */}
      <section className="py-20 px-6 bg-funky-light overflow-hidden pattern-dots">
         <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
               <h2 className="font-heading font-black text-4xl md:text-5xl text-funky-dark mb-4 drop-shadow-sm">ENGINEERED FOR <span className="text-funky-blue">BALANCE</span></h2>
               <p className="text-funky-dark/70 font-bold text-lg max-w-2xl mx-auto">More than just socks. This is sports equipment for your feet.</p>
            </div>

            <div className="relative flex flex-col md:flex-row items-center justify-center gap-12">
               {/* Left Specs */}
               <div className="space-y-12 flex-1 md:text-right">
                  <div className="relative group bg-white p-4 rounded-2xl border-2 border-funky-dark shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                     <h3 className="font-heading font-black text-xl mb-2 flex items-center md:justify-end gap-2 text-funky-pink"><Layers size={20}/> Terry Loop Cushioning</h3>
                     <p className="text-sm text-gray-600 font-medium">Thick, towel-like interior absorbs shock during jumps and wicks away sweat instantly.</p>
                  </div>
                  <div className="relative group bg-white p-4 rounded-2xl border-2 border-funky-dark shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                     <h3 className="font-heading font-black text-xl mb-2 flex items-center md:justify-end gap-2 text-funky-blue"><Activity size={20}/> 360° Arch Band</h3>
                     <p className="text-sm text-gray-600 font-medium">High-retention elastane band hugs your mid-foot. No bunching, no twisting.</p>
                  </div>
               </div>

               {/* Center Image */}
               <div className="relative w-full max-w-sm aspect-[3/4] rounded-full border-4 border-dashed border-funky-dark p-4 bg-white">
                  <div className="w-full h-full bg-funky-light rounded-full overflow-hidden relative shadow-inner">
                     <img src={blackImg} className="w-full h-full object-cover transform scale-110" alt="Anatomy" />
                     {/* Overlay pointers */}
                     <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-funky-yellow border-2 border-black rounded-full animate-ping"></div>
                     <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-funky-yellow border-2 border-black rounded-full flex items-center justify-center z-10"><span className="text-[10px] font-black">1</span></div>
                     
                     <div className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-funky-pink border-2 border-black rounded-full animate-ping delay-75"></div>
                     <div className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-funky-pink border-2 border-black rounded-full flex items-center justify-center z-10"><span className="text-[10px] font-black text-white">2</span></div>
                  </div>
               </div>

               {/* Right Specs */}
               <div className="space-y-12 flex-1">
                  <div className="relative group bg-white p-4 rounded-2xl border-2 border-funky-dark shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                     <h3 className="font-heading font-black text-xl mb-2 flex items-center gap-2 text-funky-yellow"><Gem size={20}/> Anti-Skid Technology</h3>
                     <p className="text-sm text-gray-600 font-medium">Heat-fused silicone nodes provide grip, stability, and balance on any floor.</p>
                  </div>
                  <div className="relative group bg-white p-4 rounded-2xl border-2 border-funky-dark shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                     <h3 className="font-heading font-black text-xl mb-2 flex items-center gap-2 text-funky-dark"><Wind size={20}/> Breathable Cotton</h3>
                     <p className="text-sm text-gray-600 font-medium">Premium combed cotton allows top airflow to keep feet cool during workouts.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 2.6 MATERIAL & CARE (Updated vibrancy) */}
      <section className="py-20 px-6 bg-white border-y-4 border-funky-light">
         <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            <div>
               <h3 className="font-heading font-black text-3xl text-funky-dark mb-6 flex items-center gap-3">
                  <span className="bg-green-100 p-2 rounded-lg border-2 border-green-600 text-green-600"><Shirt size={28} /></span> 
                  FABRIC LAB
               </h3>
               <div className="bg-white p-8 rounded-3xl shadow-[8px_8px_0px_0px_#06D6A0] border-2 border-funky-dark relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-green-100 rounded-full opacity-50"></div>
                  
                  <div className="flex items-center gap-6 mb-8 relative z-10">
                     <div className="w-24 h-24 bg-funky-dark rounded-full flex items-center justify-center border-4 border-green-400 shadow-lg">
                        <span className="text-white font-black text-3xl">80%</span>
                     </div>
                     <div>
                        <h4 className="font-heading font-black text-2xl text-funky-dark">COMBED COTTON</h4>
                        <p className="text-sm font-bold text-gray-500">Soft, breathable, natural.</p>
                     </div>
                  </div>
                  
                  <div className="w-full h-4 bg-gray-100 rounded-full mb-8 overflow-hidden border-2 border-gray-200">
                     <div className="h-full bg-funky-green w-[80%] border-r-2 border-white"></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm font-bold text-gray-600">
                     <span className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg border border-blue-100">
                        <span className="w-4 h-4 bg-blue-400 rounded-full border border-black"></span> 15% Spandex
                     </span>
                     <span className="flex items-center gap-2 bg-pink-50 p-2 rounded-lg border border-pink-100">
                        <span className="w-4 h-4 bg-funky-pink rounded-full border border-black"></span> 5% Elastane
                     </span>
                  </div>
               </div>
            </div>

            <div>
               <h3 className="font-heading font-black text-3xl text-funky-dark mb-6 flex items-center gap-3">
                  <span className="bg-blue-100 p-2 rounded-lg border-2 border-funky-blue text-funky-blue"><Droplets size={28} /></span> 
                  CARE GUIDE
               </h3>
               <div className="bg-white p-8 rounded-3xl shadow-[8px_8px_0px_0px_#118AB2] border-2 border-funky-dark grid grid-cols-2 gap-6 relative">
                  {[
                     { icon: "🧺", title: "Machine Wash Cold", sub: "Gentle cycle" },
                     { icon: "🔄", title: "Wash Inside Out", sub: "Protect the grips" },
                     { icon: "❌", title: "Do Not Bleach", sub: "Keep colors pop" },
                     { icon: "🌬️", title: "Air Dry Only", sub: "No tumble dry" }
                  ].map((item, i) => (
                     <div key={i} className="flex flex-col items-center text-center p-4 bg-funky-light rounded-2xl border-2 border-transparent hover:border-funky-blue hover:bg-white transition-all group cursor-default">
                        <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</span>
                        <span className="text-xs font-black uppercase text-funky-dark">{item.title}</span>
                        <span className="text-[10px] font-bold text-gray-400 mt-1">{item.sub}</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* 2.7. USAGE SCENARIOS (Enhanced Vibrancy) */}
      <section className="py-24 px-6 bg-funky-dark relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="max-w-7xl mx-auto relative z-10">
             <h2 className="font-heading font-black text-4xl md:text-5xl text-white mb-16 text-center">PERFECT FOR...</h2>
             
             <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {[
                   { title: "Pilates", icon: <Activity />, desc: "Reformer & Mat", color: "text-funky-pink", border: "hover:border-funky-pink" },
                   { title: "Yoga", icon: <Flame />, desc: "Hot & Hatha", color: "text-funky-yellow", border: "hover:border-funky-yellow" },
                   { title: "Barre", icon: <Dumbbell />, desc: "Stability & Pliés", color: "text-funky-blue", border: "hover:border-funky-blue" },
                   { title: "Aerial", icon: <Wind />, desc: "Silks & Hoops", color: "text-funky-green", border: "hover:border-funky-green" },
                   { title: "Dance", icon: <Anchor />, desc: "Studio Safety", color: "text-purple-400", border: "hover:border-purple-400" }
                ].map((use, i) => (
                   <div key={i} className={`bg-white p-6 rounded-3xl border-4 border-transparent ${use.border} shadow-[4px_4px_0px_0px_#000] hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#fff] transition-all group flex flex-col items-center text-center cursor-default`}>
                      <div className={`w-14 h-14 bg-funky-light rounded-2xl flex items-center justify-center ${use.color} mb-4 border-2 border-gray-100 group-hover:scale-110 transition-transform`}>
                         {use.icon}
                      </div>
                      <h3 className="font-heading font-black text-xl mb-1 text-funky-dark">{use.title}</h3>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">{use.desc}</p>
                   </div>
                ))}
             </div>
          </div>
      </section>

      {/* 3. HYGIENE & PROTECTION */}
      <section className="py-20 px-6 bg-white border-b-4 border-gray-100">
         <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
               <div className="absolute top-0 -left-4 w-20 h-20 bg-funky-green rounded-full opacity-20 animate-bounce-slow"></div>
               <div className="bg-funky-light rounded-[2.5rem] p-8 border-2 border-gray-100 relative z-10">
                  <Microscope size={64} className="text-funky-green mb-6" />
                  <h2 className="font-heading font-black text-3xl md:text-4xl text-funky-dark mb-4">STUDIO FLOORS ARE... GROSS.</h2>
                  <p className="text-lg text-gray-600 font-medium mb-6">
                     Hundreds of feet walk on that studio floor every day. Going barefoot? That's a brave choice.
                  </p>
                  <ul className="space-y-4">
                     <li className="flex items-center gap-3 text-funky-dark font-bold">
                        <Check className="text-green-500" /> Protects against fungus & bacteria
                     </li>
                     <li className="flex items-center gap-3 text-funky-dark font-bold">
                        <Check className="text-green-500" /> Keeps your feet clean & warm
                     </li>
                     <li className="flex items-center gap-3 text-funky-dark font-bold">
                        <Check className="text-green-500" /> Respectful to other yogis
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
                        {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
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
         <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16 text-white">
               <span className="bg-funky-green text-funky-dark px-4 py-1 rounded-full font-mono font-bold text-xs uppercase tracking-widest border-2 border-white inline-block mb-4">Limited Stock</span>
               <h2 className="font-heading font-black text-4xl md:text-6xl mb-4">BUILD YOUR BUNDLE</h2>
               <p className="opacity-80 text-xl max-w-2xl mx-auto">More pairs = More savings. It's basically free money.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-end">
               
               {/* TIER 1: The Tester */}
               <div className="bg-white p-6 rounded-3xl border-4 border-white shadow-xl flex flex-col">
                  {/* Selector */}
                  <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
                      <button onClick={() => setActiveTab('black')} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'black' ? 'bg-black text-white shadow' : 'text-gray-500'}`}>Black</button>
                      <button onClick={() => setActiveTab('grey')} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'grey' ? 'bg-gray-400 text-white shadow' : 'text-gray-500'}`}>Grey</button>
                  </div>

                  {/* Dynamic Product Image */}
                  <div className="w-full aspect-square bg-gray-100 rounded-2xl mb-4 overflow-hidden border-2 border-gray-100 relative">
                     <img 
                        src={activeTab === 'black' ? blackImg : greyImg} 
                        alt="Selected Sock" 
                        className="w-full h-full object-cover transition-all duration-300 hover:scale-105" 
                     />
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 mb-4 text-center">
                      <h3 className="font-heading font-black text-2xl text-funky-dark mb-1">THE TESTER</h3>
                      <p className="text-gray-500 text-sm font-bold">1 PAIR</p>
                  </div>

                  <div className="text-center mb-6">
                     <span className="text-5xl font-heading font-black text-funky-dark">₹299</span>
                  </div>
                  
                  <button onClick={handleBuySingle} className="w-full py-4 bg-transparent border-2 border-funky-dark text-funky-dark font-heading font-black rounded-xl hover:bg-funky-dark hover:text-white transition-colors uppercase">
                     Add 1 Pair
                  </button>
               </div>

               {/* TIER 2: The Smart Choice (Featured) */}
               <div className="bg-funky-yellow p-6 rounded-3xl border-4 border-funky-dark shadow-[0px_0px_50px_rgba(255,209,102,0.4)] relative transform lg:-translate-y-8 z-10 flex flex-col">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-funky-pink text-white font-black px-6 py-2 rounded-full uppercase tracking-widest text-xs border-2 border-funky-dark shadow-md rotate-2">Most Popular</div>
                  
                  {/* Visual Stack of 2 Socks */}
                  <div className="relative w-full aspect-square mb-4">
                     <div className="absolute top-0 right-0 w-3/4 h-3/4 rounded-2xl overflow-hidden border-2 border-funky-dark shadow-md z-10 bg-white">
                        <img src={greyImg} className="w-full h-full object-cover" alt="Grey" />
                     </div>
                     <div className="absolute bottom-0 left-0 w-3/4 h-3/4 rounded-2xl overflow-hidden border-2 border-funky-dark shadow-lg z-20 bg-white">
                        <img src={blackImg} className="w-full h-full object-cover" alt="Black" />
                     </div>
                  </div>

                  <div className="bg-white/20 rounded-2xl p-4 mb-4 text-center border-2 border-funky-dark/10">
                      <h3 className="font-heading font-black text-3xl text-funky-dark mb-1">THE SMART PACK</h3>
                      <p className="text-funky-dark/70 text-sm font-bold">2 PAIRS (1 Black + 1 Grey)</p>
                  </div>

                  <div className="text-center mb-2">
                     <span className="text-gray-500 line-through text-lg font-bold mr-2 decoration-2 decoration-funky-pink">₹598</span>
                     <span className="text-6xl font-heading font-black text-funky-dark">₹499</span>
                  </div>
                  <div className="text-center mb-6">
                     <span className="bg-funky-dark text-white px-3 py-1 rounded-lg text-xs font-bold uppercase">Save ₹100 Instantly</span>
                  </div>
                  
                  <button onClick={handleBuyDuo} className="w-full py-5 bg-funky-dark text-white font-heading font-black text-xl rounded-xl hover:bg-white hover:text-funky-dark border-2 border-transparent hover:border-funky-dark transition-all shadow-[4px_4px_0px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1 uppercase flex items-center justify-center gap-2">
                     Get The Duo <Sparkles size={20} />
                  </button>
               </div>

               {/* TIER 3: The Stock Up */}
               <div className="bg-funky-blue p-6 rounded-3xl border-4 border-white shadow-xl text-white flex flex-col">
                  {/* Grid of 4 Socks */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                     <img src={blackImg} className="rounded-xl border border-white/20 aspect-square object-cover" alt="b1"/>
                     <img src={greyImg} className="rounded-xl border border-white/20 aspect-square object-cover" alt="g1"/>
                     <img src={greyImg} className="rounded-xl border border-white/20 aspect-square object-cover" alt="g2"/>
                     <img src={blackImg} className="rounded-xl border border-white/20 aspect-square object-cover" alt="b2"/>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-4 mb-4 text-center border border-white/20">
                      <h3 className="font-heading font-black text-2xl text-white mb-1">THE SQUAD</h3>
                      <p className="text-white/70 text-sm font-bold">4 PAIRS (2 Black + 2 Grey)</p>
                  </div>
                  
                  <div className="text-center mb-2">
                     <span className="text-white/50 line-through text-lg font-bold mr-2">₹1196</span>
                     <span className="text-5xl font-heading font-black text-white">₹799</span>
                  </div>
                  <div className="text-center mb-6">
                     <span className="bg-funky-pink text-white px-3 py-1 rounded-lg text-xs font-bold uppercase border border-white/20">Best Value (Save ₹397)</span>
                  </div>
                  
                  <button onClick={handleBuySquad} className="w-full py-4 bg-white text-funky-blue font-heading font-black rounded-xl hover:bg-funky-light transition-colors uppercase border-b-4 border-black/10 active:border-b-0 active:translate-y-1">
                     Add 4-Pack
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
      <section className="py-24 px-6 bg-funky-dark text-white relative overflow-hidden">
        {/* Background flair */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-funky-pink rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-funky-blue rounded-full blur-[100px] opacity-20 translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
                <h2 className="font-heading font-black text-4xl md:text-6xl mb-4 leading-tight">
                    DOMINATING THE MAT <br className="hidden md:block"/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-funky-yellow to-funky-green">WITHOUT DRAINING THE WALLET</span>
                </h2>
                <p className="text-xl opacity-80 max-w-2xl mx-auto">
                    We cut out the middlemen, the fancy retail rent, and the corporate fluff. You get pro-grade gear for the price of a latte.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* THEM - The Overpriced Competitor */}
                <div className="bg-white/5 border-2 border-white/10 rounded-3xl p-8 md:p-12 relative hover:bg-white/10 transition-all duration-500">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-600 text-white px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg">The "Big Brands"</div>
                    
                    <div className="text-center mb-10">
                        <h3 className="font-heading font-black text-3xl text-gray-400 mb-2">OVERPRICED HYPE</h3>
                        <div className="text-4xl font-mono font-bold text-gray-500 line-through decoration-red-500 decoration-4">₹899</div>
                        <p className="text-xs text-gray-500 font-bold uppercase mt-2 tracking-widest">PER PAIR</p>
                    </div>

                    <ul className="space-y-6 text-gray-400 font-medium">
                        <li className="flex items-center justify-between border-b border-white/10 pb-4">
                            <span>Grip Quality</span>
                            <span className="text-right text-sm">Standard PVC Dots<br/><span className="text-xs opacity-60">(Falls off after 5 washes)</span></span>
                        </li>
                        <li className="flex items-center justify-between border-b border-white/10 pb-4">
                            <span>Cushioning</span>
                            <span className="text-right text-sm">Thin Flat Knit<br/><span className="text-xs opacity-60">(Zero shock absorption)</span></span>
                        </li>
                        <li className="flex items-center justify-between border-b border-white/10 pb-4">
                            <span>Fabric</span>
                            <span className="text-right text-sm">Synthetic Polyester<br/><span className="text-xs opacity-60">(Sweaty feet alert 💧)</span></span>
                        </li>
                    </ul>
                    <div className="mt-8 text-center opacity-30">
                        <X className="w-16 h-16 mx-auto text-red-500" />
                    </div>
                </div>

                {/* US - Jumplings */}
                <div className="bg-white text-funky-dark border-4 border-funky-yellow rounded-[2.5rem] p-8 md:p-12 relative shadow-[0_0_60px_rgba(255,209,102,0.3)] transform md:scale-105 z-20">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-funky-yellow text-funky-dark px-8 py-3 rounded-full font-black text-lg uppercase tracking-widest shadow-lg flex items-center gap-2">
                        <Trophy size={20} /> The Champion
                    </div>
                    
                    <div className="text-center mb-10 pt-4">
                        <h3 className="font-heading font-black text-4xl text-funky-dark mb-2">JUMPLINGS</h3>
                        <div className="text-6xl font-heading font-black text-funky-blue">₹199</div>
                        <p className="text-xs text-funky-dark/60 font-bold uppercase mt-2 tracking-widest">PER PAIR (AS LOW AS)</p>
                    </div>

                    <ul className="space-y-6 font-bold text-lg">
                        <li className="flex items-center justify-between border-b-2 border-gray-100 pb-4">
                            <span className="flex items-center gap-2 text-sm md:text-lg"><Anchor size={20} className="text-funky-blue"/> Grip Quality</span>
                            <span className="text-right text-funky-blue text-sm md:text-lg">Nano-Grip™ Tech<br/><span className="text-xs text-gray-400 font-medium">(Indestructible heat-fusion)</span></span>
                        </li>
                        <li className="flex items-center justify-between border-b-2 border-gray-100 pb-4">
                            <span className="flex items-center gap-2 text-sm md:text-lg"><Layers size={20} className="text-funky-yellow"/> Cushioning</span>
                            <span className="text-right text-funky-yellow text-sm md:text-lg">Terry Loop Padding<br/><span className="text-xs text-gray-400 font-medium">(Like walking on clouds)</span></span>
                        </li>
                        <li className="flex items-center justify-between border-b-2 border-gray-100 pb-4">
                            <span className="flex items-center gap-2 text-sm md:text-lg"><Leaf size={20} className="text-green-600"/> Fabric</span>
                            <span className="text-right text-green-600 text-sm md:text-lg">Organic Bamboo<br/><span className="text-xs text-gray-400 font-medium">(Cloud-soft & breathable)</span></span>
                        </li>
                    </ul>
                    
                    <div className="mt-10">
                        <button onClick={scrollToOffers} className="w-full py-4 bg-funky-dark text-white font-heading font-black text-xl rounded-2xl shadow-xl hover:bg-funky-pink transition-all flex items-center justify-center gap-2 hover:scale-[1.02]">
                            UPGRADE MY PRACTICE <ArrowRight />
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
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t-4 border-funky-dark p-4 z-50 flex items-center justify-between shadow-[0_-5px_20px_rgba(0,0,0,0.1)] pb-safe">
         <div>
            <span className="text-[10px] font-black bg-funky-green text-white px-2 py-0.5 rounded-sm uppercase tracking-wider mb-1 inline-block">BEST VALUE</span>
            <div className="font-heading font-black text-2xl text-funky-dark leading-none">₹499 <span className="text-sm font-bold text-gray-400 font-body">/ 2 pairs</span></div>
            <div className="text-[10px] font-bold text-funky-pink flex items-center gap-1 mt-1"><Truck size={10} /> FREE SHIPPING</div>
         </div>
         <button onClick={scrollToOffers} className="bg-funky-dark text-white px-8 py-3 rounded-xl font-heading font-black uppercase tracking-wide shadow-[4px_4px_0px_0px_#FFD166] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all border-2 border-transparent">
            BUY NOW
         </button>
      </div>

    </div>
  );
};

export default GripSocksLP;