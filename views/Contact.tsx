import React from 'react';
import { Mail, Phone, MapPin, Send, Instagram, Twitter, Facebook, HelpCircle, Clock, Briefcase, Camera, MessageSquare } from 'lucide-react';

const Contact: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent! We'll holla back soon.");
  };

  return (
    <div className="animate-fade-in min-h-screen bg-funky-light">
      <div className="bg-funky-dark text-white pt-24 pb-48 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
           <h1 className="font-heading font-black text-6xl md:text-8xl mb-6">HOLLA AT US! 👋</h1>
           <p className="font-mono text-lg opacity-80 max-w-xl mx-auto">
             Questions? Collabs? Just want to say hi? We reply faster than you can put on a pair of knee-highs.
           </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-20 pb-20 space-y-12">
        
        {/* Department Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           {[
             { icon: <MessageSquare size={24} />, title: "Customer Support", email: "help@jumplings.com", color: "bg-funky-blue" },
             { icon: <Briefcase size={24} />, title: "Wholesale", email: "sales@jumplings.com", color: "bg-funky-pink" },
             { icon: <Camera size={24} />, title: "Press & Media", email: "pr@jumplings.com", color: "bg-funky-green" },
             { icon: <Briefcase size={24} />, title: "Careers", email: "join@jumplings.com", color: "bg-funky-yellow" }
           ].map((dept, i) => (
             <div key={i} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:-translate-y-1 transition-transform">
                <div className={`${dept.color} text-white w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
                   {dept.icon}
                </div>
                <h3 className="font-bold text-lg text-funky-dark">{dept.title}</h3>
                <a href={`mailto:${dept.email}`} className="text-sm text-gray-500 hover:text-funky-dark transition-colors">{dept.email}</a>
             </div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Contact Info & Hours */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-white">
               <h3 className="font-heading font-black text-2xl text-funky-dark mb-6">VISIT HQ</h3>
               <div className="aspect-video bg-gray-200 rounded-2xl mb-6 relative overflow-hidden group">
                  {/* Updated image to a Delhi-esque or generic vibrant city street */}
                  <img src="https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="New Delhi Office" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="bg-funky-pink text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 transform group-hover:scale-110 transition-transform">
                        <MapPin size={16} /> NEW DELHI
                     </div>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="flex gap-4">
                     <MapPin className="text-gray-400 shrink-0" />
                     <p className="text-sm text-gray-600 font-medium">
                        123 Funky Street, Creative Block,<br/>
                        Hauz Khas Village, New Delhi 110016
                     </p>
                  </div>
                  <div className="flex gap-4">
                     <Clock className="text-gray-400 shrink-0" />
                     <div className="text-sm text-gray-600 font-medium">
                        <p>Mon - Fri: 10:00 AM - 6:00 PM</p>
                        <p>Sat - Sun: Eating Dumplings</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <Phone className="text-gray-400 shrink-0" />
                     <p className="text-sm text-gray-600 font-medium">+91 98765 43210</p>
                  </div>
               </div>

               <div className="mt-8 pt-8 border-t border-gray-100">
                  <p className="font-mono text-xs opacity-60 uppercase tracking-widest mb-4">Socials</p>
                  <div className="flex gap-3">
                     <a href="#" className="p-3 bg-funky-light text-funky-dark rounded-full hover:bg-funky-pink hover:text-white transition-colors"><Instagram size={20} /></a>
                     <a href="#" className="p-3 bg-funky-light text-funky-dark rounded-full hover:bg-funky-blue hover:text-white transition-colors"><Twitter size={20} /></a>
                     <a href="#" className="p-3 bg-funky-light text-funky-dark rounded-full hover:bg-funky-dark hover:text-white transition-colors"><Facebook size={20} /></a>
                  </div>
               </div>
            </div>
          </div>

          {/* Right: Big Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border-4 border-white h-full">
               <div className="mb-8">
                  <h2 className="font-heading font-black text-3xl text-funky-dark">SEND A NOTE 📝</h2>
                  <p className="text-gray-500 mt-2">We usually respond within 24 hours.</p>
               </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                   <div>
                     <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Name</label>
                     <input required className="w-full bg-funky-light border-2 border-transparent focus:border-funky-blue rounded-xl px-4 py-3 outline-none transition-colors font-bold text-funky-dark" placeholder="Funky Person" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Email</label>
                     <input required type="email" className="w-full bg-funky-light border-2 border-transparent focus:border-funky-blue rounded-xl px-4 py-3 outline-none transition-colors font-bold text-funky-dark" placeholder="you@email.com" />
                   </div>
                 </div>
                 
                 <div>
                   <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Topic</label>
                   <select className="w-full bg-funky-light border-2 border-transparent focus:border-funky-blue rounded-xl px-4 py-3 outline-none transition-colors font-bold text-funky-dark appearance-none cursor-pointer">
                     <option>Where are my socks?</option>
                     <option>I want to sell your socks</option>
                     <option>Just saying hello</option>
                     <option>Something else</option>
                   </select>
                 </div>

                 <div>
                   <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Message</label>
                   <textarea required className="w-full bg-funky-light border-2 border-transparent focus:border-funky-blue rounded-xl px-4 py-3 outline-none transition-colors min-h-[200px] font-medium text-funky-dark resize-none" placeholder="Tell us everything..."></textarea>
                 </div>

                 <button className="w-full bg-funky-dark text-white py-5 rounded-xl font-heading font-black flex items-center justify-center gap-3 hover:bg-funky-pink transition-all shadow-lg hover:shadow-funky-pink/25 hover:-translate-y-1 text-lg">
                   SEND IT TO SPACE <Send size={20} />
                 </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Teaser */}
        <div className="text-center pt-12 border-t-2 border-dashed border-gray-200">
           <h3 className="font-heading font-bold text-2xl text-funky-dark mb-8">BEFORE YOU ASK...</h3>
           <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-funky-yellow transition-colors">
                 <h4 className="font-bold mb-2">Order Status?</h4>
                 <p className="text-sm text-gray-500">Check the tracking link in your email. It's magic.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-funky-pink transition-colors">
                 <h4 className="font-bold mb-2">Returns?</h4>
                 <p className="text-sm text-gray-500">Super easy. Visit our Returns page to start.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-funky-green transition-colors">
                 <h4 className="font-bold mb-2">Sizing?</h4>
                 <p className="text-sm text-gray-500">One size fits most humans (Sizes 6-11 UK).</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;