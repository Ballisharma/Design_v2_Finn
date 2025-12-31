import React from 'react';
import { ArrowRight, Star } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative w-full pt-12 md:pt-0 min-h-[85vh] flex flex-col items-center justify-center overflow-hidden px-6 bg-funky-light">
      
      {/* Abstract Background Shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-funky-yellow rounded-full blur-2xl opacity-50 animate-bounce-slow" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-funky-pink rounded-full blur-3xl opacity-40 animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-funky-blue/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10">
        
        {/* Text */}
        <div className="text-center md:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-funky-dark/10 shadow-sm mb-4">
             <Star size={16} className="text-funky-yellow fill-funky-yellow" />
             <span className="text-xs font-bold font-mono tracking-wider uppercase text-funky-dark">Fresh Drop: Neon Series</span>
          </div>
          
          <h1 className="font-heading font-black text-5xl sm:text-6xl md:text-8xl leading-[0.9] text-funky-dark">
            HAPPY <br/>
            <span className="text-funky-blue">FEET,</span> <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-funky-pink to-funky-yellow">FUNKY</span> MOVES.
          </h1>
          
          <p className="font-body text-xl text-gray-600 max-w-md mx-auto md:mx-0">
            Life is too short for boring white socks. Step into a world of color, comfort, and unmatched vibes.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start pt-4">
            <button className="w-full sm:w-auto px-8 py-4 bg-funky-dark text-white font-heading font-bold rounded-xl hover:bg-funky-pink hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2">
              Shop All Socks <ArrowRight size={20} />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-funky-dark border-2 border-funky-dark/10 font-heading font-bold rounded-xl hover:border-funky-dark hover:bg-funky-light transition-all">
              View Bundles
            </button>
          </div>
        </div>

        {/* Hero Image / Composition */}
        <div className="relative">
          <div className="relative z-10 transform md:rotate-6 hover:rotate-0 transition-transform duration-500">
            <div className="bg-white p-4 rounded-3xl shadow-2xl border-4 border-funky-yellow">
              <img 
                src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop" 
                alt="Colorful Socks" 
                className="w-full h-auto rounded-2xl aspect-square object-cover"
              />
            </div>
            
            {/* Sticker Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-funky-pink rounded-full flex items-center justify-center text-white font-heading font-black text-center text-sm transform rotate-12 shadow-lg border-4 border-white">
              NEW <br/> ARRIVAL
            </div>
          </div>
          
          {/* Background Card Offset */}
          <div className="absolute top-0 left-0 w-full h-full bg-funky-blue rounded-3xl transform -rotate-6 -z-10 translate-y-4 translate-x-4 opacity-20"></div>
        </div>

      </div>
    </section>
  );
};

export default Hero;