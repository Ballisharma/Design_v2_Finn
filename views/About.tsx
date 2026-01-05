import React from 'react';
import { Star, Heart, Zap, Smile, Leaf, Factory, PenTool, Coffee, Clock } from 'lucide-react';
import SEO from '../components/SEO';
import { generateOrganizationSchema, generateBreadcrumbSchema } from '../utils/structuredData';

const About: React.FC = () => {
   const structuredData = [
      generateOrganizationSchema(),
      generateBreadcrumbSchema([
         { name: 'Home', url: 'https://jumplings.in/' },
         { name: 'About Us', url: 'https://jumplings.in/about' }
      ])
   ];

   return (
      <div className="animate-fade-in bg-white">
         <SEO
            title="About Jumplings | Our Story - Premium Funky Socks Made in India"
            description="Meet the team behind Jumplings. Founded in 2025 in New Delhi, we're on a mission to add color and comfort to your life. GOTS certified organic cotton, ethically made, plastic-free packaging."
            keywords="about jumplings, sock company india, made in india socks, organic cotton socks, ethical fashion india"
            structuredData={structuredData}
         />
         {/* Hero Section */}
         <div className="relative bg-funky-yellow overflow-hidden py-24 px-6">
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-white rounded-full opacity-20 blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-funky-pink rounded-full opacity-20 blur-3xl"></div>

            <div className="max-w-5xl mx-auto text-center relative z-10">
               <span className="inline-block py-2 px-4 rounded-full bg-white text-funky-dark font-bold font-mono text-xs uppercase tracking-widest mb-6 border-2 border-funky-dark shadow-[4px_4px_0px_0px_rgba(7,59,76,1)]">
                  Est. 2025
               </span>
               <h1 className="font-heading font-black text-6xl md:text-8xl text-funky-dark mb-8 leading-tight">
                  WE TAKE FUN <br /><span className="text-white text-outline">SERIOUSLY.</span>
               </h1>
               <p className="font-body text-xl md:text-2xl font-bold text-funky-dark/80 max-w-3xl mx-auto leading-relaxed">
                  Jumplings isn't just a sock company. It's a movement against the beige, the grey, and the boring. We're here to make your ankles the life of the party.
               </p>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-6 py-24 space-y-32">

            {/* Origin Story with Stats */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
               <div className="order-2 md:order-1 space-y-8">
                  <h2 className="font-heading font-black text-4xl md:text-5xl text-funky-dark">THE ORIGIN STORY</h2>
                  <div className="h-2 w-20 bg-funky-yellow rounded-full"></div>
                  <p className="text-gray-600 text-lg leading-relaxed">
                     It started in 2025 in a cramped studio apartment in <strong>New Delhi</strong>. Our founder, <strong>Harish</strong>, looked at his sock drawer and saw a sea of sadness—black, navy, and that weird shade of grey.
                  </p>
                  <p className="text-gray-600 text-lg leading-relaxed">
                     He wanted color. He wanted personality. He wanted socks that made him smile when he looked down during boring meetings. Thus, Jumplings was born. Derived from "Jump" (for energy) and "Dumplings" (because they are soft, comforting, and everyone loves them).
                  </p>

                  <div className="grid grid-cols-2 gap-6 pt-6">
                     <div className="bg-funky-light p-4 rounded-xl">
                        <h4 className="font-black text-2xl text-funky-blue">50,000+</h4>
                        <p className="text-xs uppercase tracking-widest text-gray-500">Pairs Sold</p>
                     </div>
                     <div className="bg-funky-light p-4 rounded-xl">
                        <h4 className="font-black text-2xl text-funky-pink">25+</h4>
                        <p className="text-xs uppercase tracking-widest text-gray-500">Countries Visited</p>
                     </div>
                  </div>
               </div>
               <div className="relative order-1 md:order-2">
                  <div className="absolute inset-0 bg-funky-blue rounded-[3rem] transform rotate-3 translate-x-4 translate-y-4"></div>
                  {/* Updated image to reflect a Delhi vibe or general urban cool */}
                  <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop" alt="The Crew" className="relative z-10 rounded-[3rem] border-4 border-funky-dark bg-white shadow-2xl" />
               </div>
            </div>

            {/* How It's Made Process */}
            <div className="bg-funky-dark text-white rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-[100px]"></div>
               <div className="relative z-10 text-center mb-16">
                  <h2 className="font-heading font-black text-4xl mb-4">FROM SKETCH TO SOCK</h2>
                  <p className="opacity-70 max-w-2xl mx-auto">It takes 45 days and 12 humans to make one pair of Jumplings.</p>
               </div>

               <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8">
                  {[
                     { icon: <PenTool size={32} />, title: "1. Design", desc: "Harish sketches wild ideas on an iPad at 3 AM." },
                     { icon: <Leaf size={32} />, title: "2. Source", desc: "We select GOTS certified organic cotton yarns." },
                     { icon: <Factory size={32} />, title: "3. Knit", desc: "200-needle machines knit them for high definition." },
                     { icon: <Smile size={32} />, title: "4. Joy", desc: "Hand-packed and shipped to your doorstep." }
                  ].map((step, i) => (
                     <div key={i} className="bg-white/10 p-8 rounded-3xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                        <div className="bg-funky-yellow text-funky-dark w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                           {step.icon}
                        </div>
                        <h3 className="font-bold text-xl mb-3 text-center">{step.title}</h3>
                        <p className="text-sm opacity-80 text-center leading-relaxed">{step.desc}</p>
                     </div>
                  ))}
               </div>
            </div>

            {/* Sustainability Deep Dive */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
               <div>
                  <div className="bg-green-100 w-fit px-4 py-2 rounded-full text-green-700 font-bold text-xs uppercase tracking-wider mb-6">
                     Planet Friendly
                  </div>
                  <h2 className="font-heading font-black text-4xl text-funky-dark mb-6">NOT JUST GOOD LOOKING. GOOD FOR EARTH.</h2>
                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <div className="bg-funky-light p-3 rounded-full h-fit text-green-600"><Leaf size={24} /></div>
                        <div>
                           <h4 className="font-bold text-lg">Organic Cotton</h4>
                           <p className="text-gray-600 text-sm">We use GOTS certified organic cotton which uses 91% less water than regular cotton and zero toxic chemicals.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="bg-funky-light p-3 rounded-full h-fit text-green-600"><Factory size={24} /></div>
                        <div>
                           <h4 className="font-bold text-lg">Ethical Manufacturing</h4>
                           <p className="text-gray-600 text-sm">Our factory near New Delhi pays 2x the minimum wage, provides healthcare, and has zero tolerance for child labor.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="bg-funky-light p-3 rounded-full h-fit text-green-600"><Coffee size={24} /></div>
                        <div>
                           <h4 className="font-bold text-lg">Plastic Free</h4>
                           <p className="text-gray-600 text-sm">Your socks arrive in a recycled cornstarch mailer that you can compost in your garden.</p>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="bg-green-50 rounded-[3rem] p-8 h-full flex items-center justify-center border-2 border-green-100">
                  <div className="text-center space-y-6">
                     <div className="text-9xl">🌱</div>
                     <p className="font-heading font-black text-green-800 text-2xl">"We don't inherit the earth from our ancestors, we borrow it from our children."</p>
                  </div>
               </div>
            </div>

            {/* Brand Timeline */}
            <div>
               <h2 className="font-heading font-black text-4xl text-funky-dark text-center mb-16">THE TIMELINE</h2>
               <div className="relative border-l-4 border-gray-100 ml-4 md:ml-1/2 md:-translate-x-[2px]">
                  {[
                     { year: "2024", title: "The Idea", desc: "Harish gets bored of grey socks." },
                     { year: "2025 Jan", title: "Launch", desc: "Jumplings goes live with 5 designs in Delhi." },
                     { year: "2025 Jun", title: "Sold Out", desc: "We run out of stock in 48 hours." },
                     { year: "2025 Oct", title: "The Future", desc: "We are just getting started." },
                  ].map((event, i) => (
                     <div key={i} className={`relative mb-12 md:w-1/2 pl-8 md:pl-0 ${i % 2 === 0 ? 'md:pr-12 md:text-right md:ml-0' : 'md:pl-12 md:ml-auto'}`}>
                        <div className={`absolute top-0 w-6 h-6 bg-funky-dark rounded-full border-4 border-white shadow-md ${i % 2 === 0 ? '-left-[14px] md:-right-[14px] md:left-auto' : '-left-[14px]'}`}></div>
                        <span className="font-mono text-funky-pink font-bold">{event.year}</span>
                        <h3 className="font-heading font-black text-2xl text-funky-dark">{event.title}</h3>
                        <p className="text-gray-500 mt-2">{event.desc}</p>
                     </div>
                  ))}
               </div>
            </div>

            {/* Meet the Team */}
            <div>
               <h2 className="font-heading font-black text-4xl text-funky-dark text-center mb-12">MEET THE MISFITS</h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                     { name: 'Harish', role: 'Chief Sock Officer', color: '#EF476F' },
                     { name: 'Rohan', role: 'Head of Funk', color: '#118AB2' },
                     { name: 'Priya', role: 'Pattern Wizard', color: '#06D6A0' },
                     { name: 'Arjun', role: 'Logistics Ninja', color: '#FFD166' }
                  ].map((member, idx) => (
                     <div key={idx} className="text-center group">
                        <div className="aspect-square rounded-full overflow-hidden border-4 border-white shadow-lg mb-4 bg-gray-100 relative group-hover:scale-105 transition-transform">
                           <div className="absolute inset-0 opacity-20" style={{ backgroundColor: member.color }}></div>
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} alt={member.name} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-heading font-bold text-xl text-funky-dark">{member.name}</h3>
                        <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">{member.role}</p>
                     </div>
                  ))}
               </div>
            </div>

         </div>
      </div>
   );
};

export default About;