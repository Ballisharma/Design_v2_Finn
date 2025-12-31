import React from 'react';
import { Truck, Globe, Clock, Package, CheckCircle, MapPin, Search, Calendar, AlertCircle } from 'lucide-react';

const Shipping: React.FC = () => {
  return (
    <div className="animate-fade-in bg-white">
      {/* Hero */}
      <div className="bg-funky-blue text-white py-20 px-6 text-center relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 left-0 w-48 h-48 bg-funky-yellow opacity-20 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
         
         <div className="relative z-10 max-w-4xl mx-auto">
           <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-full mb-6 animate-bounce-slow">
              <Truck size={40} />
           </div>
           <h1 className="font-heading font-black text-5xl md:text-7xl mb-6">SHIPPING & DELIVERY</h1>
           <p className="font-mono opacity-80 text-lg max-w-2xl mx-auto mb-10">
             We ship fast because we know your feet are getting cold. Here is everything you need to know about getting your goods.
           </p>

           {/* Track Order Widget */}
           <div className="bg-white p-2 rounded-2xl max-w-md mx-auto shadow-2xl flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Order ID (e.g. JUMP-1234)" 
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-50 text-funky-dark font-mono font-bold outline-none focus:ring-2 focus:ring-funky-yellow"
                />
              </div>
              <button className="bg-funky-dark text-white px-6 h-12 rounded-xl font-heading font-black hover:bg-funky-yellow hover:text-funky-dark transition-colors">
                TRACK
              </button>
           </div>
         </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20 space-y-24">
        
        {/* Processing Times */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
           <div>
             <h2 className="font-heading font-black text-3xl text-funky-dark mb-6 flex items-center gap-3">
               <Clock className="text-funky-pink" /> ORDER PROCESSING
             </h2>
             <div className="prose text-gray-600">
               <p className="text-lg mb-4">
                 We pack and ship orders Monday through Friday. We are humans, not robots, so we need weekends to wear socks and watch cartoons.
               </p>
               <ul className="space-y-4 list-none pl-0">
                 <li className="flex items-start gap-3 bg-funky-light p-4 rounded-xl">
                   <div className="bg-white p-2 rounded-full text-funky-dark shadow-sm"><Calendar size={16} /></div>
                   <div>
                     <strong className="block text-funky-dark">Same Day Dispatch</strong>
                     <span className="text-sm">Orders placed before <span className="font-bold text-funky-pink">12:00 PM IST</span> go out same day.</span>
                   </div>
                 </li>
                 <li className="flex items-start gap-3 bg-funky-light p-4 rounded-xl">
                   <div className="bg-white p-2 rounded-full text-funky-dark shadow-sm"><Clock size={16} /></div>
                   <div>
                     <strong className="block text-funky-dark">Next Day Dispatch</strong>
                     <span className="text-sm">Orders placed after 12:00 PM IST ship the next business day.</span>
                   </div>
                 </li>
               </ul>
             </div>
           </div>
           
           <div className="bg-funky-light p-8 rounded-[2rem] border-2 border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-funky-yellow rounded-full blur-3xl opacity-20"></div>
              <h3 className="font-heading font-black text-2xl text-funky-dark mb-6 text-center">THE JOURNEY</h3>
              
              <div className="space-y-8 relative">
                <div className="absolute left-8 top-8 bottom-8 w-1 bg-gray-200 border-l-2 border-dashed border-gray-300"></div>
                
                {[
                  { title: "Order Confirmed", desc: "You get a high-five email.", icon: <CheckCircle size={20} /> },
                  { title: "Packed with Care", desc: "We wrap it in eco-friendly paper.", icon: <Package size={20} /> },
                  { title: "Shipped", desc: "Handed to courier. Tracking link sent.", icon: <Truck size={20} /> },
                  { title: "Delivered", desc: "Happy feet time!", icon: <MapPin size={20} /> }
                ].map((step, idx) => (
                  <div key={idx} className="relative flex items-center gap-4 pl-2">
                    <div className="w-12 h-12 bg-white rounded-full border-4 border-funky-light flex items-center justify-center z-10 shadow-sm text-funky-blue">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-funky-dark leading-none">{step.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* Detailed Rates Table */}
        <div>
           <h2 className="font-heading font-black text-3xl text-funky-dark mb-8 text-center">DELIVERY ESTIMATES</h2>
           <div className="overflow-x-auto rounded-3xl border-2 border-gray-100 shadow-xl">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-funky-dark text-white text-sm uppercase tracking-wider">
                   <th className="p-6 font-bold">Zone</th>
                   <th className="p-6 font-bold">Estimated Time</th>
                   <th className="p-6 font-bold">Standard Shipping</th>
                   <th className="p-6 font-bold">Express Info</th>
                 </tr>
               </thead>
               <tbody className="bg-white text-gray-600 font-medium">
                 <tr className="border-b border-gray-100 hover:bg-funky-light/30 transition-colors">
                   <td className="p-6 text-funky-dark font-bold">Metro Cities<br/><span className="text-xs font-normal opacity-60">Mumbai, Delhi, Bangalore, etc.</span></td>
                   <td className="p-6">2 - 3 Business Days</td>
                   <td className="p-6">
                     <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold mr-2">FREE</span>
                     <span className="text-xs">above ₹999</span>
                   </td>
                   <td className="p-6 text-sm">Usually delivered within 48 hrs</td>
                 </tr>
                 <tr className="border-b border-gray-100 hover:bg-funky-light/30 transition-colors">
                   <td className="p-6 text-funky-dark font-bold">Rest of India<br/><span className="text-xs font-normal opacity-60">Tier 2 & 3 Cities</span></td>
                   <td className="p-6">4 - 6 Business Days</td>
                   <td className="p-6">
                     <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold mr-2">FREE</span>
                     <span className="text-xs">above ₹999</span>
                   </td>
                   <td className="p-6 text-sm">Dependent on local courier speed</td>
                 </tr>
                 <tr className="hover:bg-funky-light/30 transition-colors">
                   <td className="p-6 text-funky-dark font-bold">Remote Areas<br/><span className="text-xs font-normal opacity-60">J&K, North East, Islands</span></td>
                   <td className="p-6">7 - 10 Business Days</td>
                   <td className="p-6">₹100 Flat Rate</td>
                   <td className="p-6 text-sm">Air shipping might not be available</td>
                 </tr>
               </tbody>
             </table>
           </div>
           <p className="text-center text-sm text-gray-400 mt-4 font-mono">* Days refers to Business Days (Mon-Fri)</p>
        </div>

        {/* Policies Grid */}
        <div className="grid md:grid-cols-3 gap-8">
           <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
             <AlertCircle className="text-funky-yellow mb-4" size={32} />
             <h3 className="font-heading font-bold text-xl mb-2">Lost Packages</h3>
             <p className="text-sm text-gray-600 leading-relaxed">
               It's rare, but if your socks disappear into the void, let us know within 7 days of the estimated delivery date. We will send a replacement or refund ASAP.
             </p>
           </div>
           <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
             <AlertCircle className="text-funky-pink mb-4" size={32} />
             <h3 className="font-heading font-bold text-xl mb-2">Damaged Goods</h3>
             <p className="text-sm text-gray-600 leading-relaxed">
               If the box looks like it fought a bear, please take photos before opening. Send them to support@jumplings.com and we'll handle the rest.
             </p>
           </div>
           <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
             <Globe className="text-funky-blue mb-4" size={32} />
             <h3 className="font-heading font-bold text-xl mb-2">International?</h3>
             <p className="text-sm text-gray-600 leading-relaxed">
               Currently serving India only. But we have plans for:
               <span className="block mt-2 font-mono text-xs opacity-60">USA • UK • UAE • SINGAPORE</span>
             </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Shipping;