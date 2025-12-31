import React from 'react';
import { RefreshCcw, Check, X, MessageCircle, ArrowRight, DollarSign, Repeat, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Returns: React.FC = () => {
  return (
    <div className="animate-fade-in bg-white">
       {/* Hero */}
       <div className="bg-funky-pink text-white py-20 px-6 text-center">
         <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-full mb-6">
            <RefreshCcw size={40} className="animate-spin-slow" style={{ animationDuration: '3s' }} />
         </div>
         <h1 className="font-heading font-black text-5xl md:text-6xl mb-4">RETURNS & EXCHANGES</h1>
         <p className="font-mono text-lg opacity-90">Did the dog eat them? Did you order the wrong size? We got you.</p>
       </div>

       <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">
         
         {/* Start Return Mock Portal */}
         <div className="bg-funky-dark rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-funky-blue rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-funky-pink rounded-full blur-3xl opacity-20"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <h2 className="font-heading font-black text-3xl">START A RETURN OR EXCHANGE</h2>
              <p className="opacity-80">Enter your order details below to get started. It takes less than 2 minutes.</p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                 <input 
                   type="text" 
                   placeholder="Order Number (e.g. #1029)" 
                   className="flex-1 bg-white/10 border-2 border-white/20 rounded-xl px-6 py-4 text-white placeholder-white/50 font-mono outline-none focus:border-funky-yellow focus:bg-white/20 transition-all"
                 />
                 <input 
                   type="email" 
                   placeholder="Email Address" 
                   className="flex-1 bg-white/10 border-2 border-white/20 rounded-xl px-6 py-4 text-white placeholder-white/50 font-mono outline-none focus:border-funky-yellow focus:bg-white/20 transition-all"
                 />
              </div>
              <button className="w-full bg-funky-yellow text-funky-dark py-4 rounded-xl font-heading font-black text-lg hover:bg-white transition-colors">
                FIND MY ORDER
              </button>
              <p className="text-xs opacity-50">By continuing, you agree to our Return Policy below.</p>
            </div>
         </div>

         {/* Refund vs Exchange */}
         <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 hover:border-funky-blue transition-colors shadow-sm">
               <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-blue-500">
                  <DollarSign size={32} />
               </div>
               <h3 className="font-heading font-black text-2xl text-funky-dark mb-4">Refund to Source</h3>
               <p className="text-gray-600 mb-6 min-h-[48px]">Get your money back to the original payment method.</p>
               <ul className="space-y-3 text-sm text-gray-500">
                  <li className="flex items-center gap-2"><Clock size={16}/> Takes 5-7 business days</li>
                  <li className="flex items-center gap-2"><Check size={16}/> Full amount refunded</li>
                  <li className="flex items-center gap-2"><X size={16} className="text-red-400"/> Return shipping fee deducted (₹50)</li>
               </ul>
            </div>

            <div className="bg-white border-2 border-funky-green rounded-3xl p-8 relative shadow-lg transform md:-translate-y-4">
               <div className="absolute top-4 right-4 bg-funky-green text-white text-xs font-bold px-3 py-1 rounded-full">RECOMMENDED</div>
               <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-green-600">
                  <Repeat size={32} />
               </div>
               <h3 className="font-heading font-black text-2xl text-funky-dark mb-4">Store Credit / Exchange</h3>
               <p className="text-gray-600 mb-6 min-h-[48px]">Swap for a different size or get credit for later.</p>
               <ul className="space-y-3 text-sm text-gray-500">
                  <li className="flex items-center gap-2"><Clock size={16}/> Instant (once approved)</li>
                  <li className="flex items-center gap-2"><Check size={16}/> <strong>Bonus ₹50</strong> credit added</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-green-500"/> <strong>Free</strong> return shipping</li>
               </ul>
            </div>
         </div>

         {/* Timeline */}
         <div>
            <h2 className="font-heading font-black text-3xl text-funky-dark mb-12 text-center">THE RETURN TIMELINE</h2>
            <div className="flex flex-col md:flex-row justify-between relative gap-8">
               <div className="hidden md:block absolute top-6 left-0 w-full h-1 bg-gray-100 -z-10"></div>
               
               {[
                 { day: "Day 0", title: "Request", desc: "You submit request" },
                 { day: "Day 1-2", title: "Approval", desc: "We approve & schedule pickup" },
                 { day: "Day 3-5", title: "Pickup", desc: "Courier collects package" },
                 { day: "Day 6-7", title: "QC Check", desc: "It reaches our warehouse" },
                 { day: "Day 8", title: "Refund", desc: "Money sent to you" },
               ].map((step, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-funky-light rounded-full border-4 border-white shadow-md flex items-center justify-center font-bold text-xs text-funky-dark mb-4 z-10">
                      {i + 1}
                    </div>
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-1">{step.day}</span>
                    <h4 className="font-bold text-funky-dark">{step.title}</h4>
                    <p className="text-xs text-gray-500 max-w-[120px]">{step.desc}</p>
                 </div>
               ))}
            </div>
         </div>

         {/* The Rules Checklist */}
         <div className="bg-gray-50 rounded-[2rem] p-8 md:p-12">
            <h2 className="font-heading font-black text-2xl text-funky-dark mb-8 text-center">THE FINE PRINT (MADE LARGE)</h2>
            <div className="grid md:grid-cols-2 gap-12">
               <div>
                  <h3 className="font-bold text-green-600 mb-4 flex items-center gap-2"><Check /> WE ACCEPT</h3>
                  <ul className="space-y-3 text-sm font-medium text-gray-600">
                     <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5"></div> Socks in original packaging with tags</li>
                     <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5"></div> Unworn, unwashed items (trying on is okay)</li>
                     <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5"></div> Manufacturing defects (holes, mismatched)</li>
                     <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5"></div> Returns initiated within 7 days of delivery</li>
                  </ul>
               </div>
               <div>
                  <h3 className="font-bold text-red-500 mb-4 flex items-center gap-2"><X /> WE DON'T ACCEPT</h3>
                  <ul className="space-y-3 text-sm font-medium text-gray-600">
                     <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5"></div> Socks that have been worn for a marathon</li>
                     <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5"></div> Missing tags or damaged packaging</li>
                     <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5"></div> "Mystery Box" items or free gifts</li>
                     <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5"></div> Items bought on clearance / final sale</li>
                  </ul>
               </div>
            </div>
         </div>

         <div className="text-center">
            <p className="text-gray-500 mb-4">Still have questions?</p>
            <Link to="/contact" className="inline-flex items-center gap-2 text-funky-blue font-bold hover:underline">
               Talk to a human <ArrowRight size={16} />
            </Link>
         </div>

       </div>
    </div>
  );
};

export default Returns;