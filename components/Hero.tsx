import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    bgColor: "bg-[#FFD6E0]", // Matches the soft pink in the reference
    title: "Hi! We love\n your feet.",
    subtitle: "Find the right\npair for you!",
    buttonText: "Shop Now",
    buttonLink: "/shop",
    image: "https://images.unsplash.com/photo-1552874869-8132604971ca?q=80&w=1000&auto=format&fit=crop",
  }
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full overflow-hidden transition-colors duration-500 bg-white">
      <div
        className="w-full transition-transform duration-700 ease-in-out flex"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className={`w-full flex-shrink-0 min-h-[90vh] md:min-h-[750px] flex items-end md:items-center justify-center relative ${slide.bgColor}`}>
            <div className="max-w-7xl mx-auto px-6 w-full h-full flex flex-col md:flex-row items-center justify-between pb-24 md:pb-0 pt-20 md:pt-0">

              {/* Text Side & Content Wrapper */}
              <div className="w-full md:w-1/2 flex flex-col items-center md:items-start z-20">

                {/* Title - Order 1 on Mobile */}
                <h1 className="order-1 font-heading font-black text-6xl md:text-[7rem] text-funky-dark leading-[0.9] text-center md:text-left mb-6 md:mb-10 whitespace-pre-line tracking-tight">
                  {slide.title}
                </h1>

                {/* Mobile Image - Order 2 - Visible md:hidden */}
                {/* Placed between title and button on mobile */}
                <div className="order-2 md:hidden w-full flex justify-center items-end my-4 h-[40vh]">
                  <img
                    src={slide.image}
                    alt="Hero"
                    className="h-full object-contain object-bottom drop-shadow-2xl"
                  />
                </div>

                {/* Buttons - Order 3 on Mobile */}
                <div className="order-3 relative flex items-center justify-center md:justify-start w-full">
                  <Link to={slide.buttonLink} className="w-[85%] md:w-auto bg-funky-dark text-white font-heading font-bold text-lg md:text-xl px-12 py-5 rounded-full hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-xl">
                    {slide.buttonText} <ArrowRight size={24} />
                  </Link>

                  {/* Handwritten Arrow & Text (Desktop Only) */}
                  <div className="absolute left-[110%] top-1/2 -translate-y-1/2 w-48 hidden md:block group cursor-default">
                    <p className="font-heading font-bold text-funky-dark text-lg leading-tight mb-2 -rotate-6">
                      {slide.subtitle}
                    </p>
                    <svg className="w-12 h-12 text-funky-dark -rotate-12" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M90,10 Q50,60 10,50" />
                      <path d="M10,50 L25,40" />
                      <path d="M10,50 L25,60" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Desktop Image - Hidden on Mobile */}
              <div className="hidden md:flex md:w-1/2 h-full items-end justify-end relative mt-0">
                <img
                  src={slide.image}
                  alt="Hero"
                  className="relative z-10 max-h-[750px] object-contain object-bottom drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-funky-dark w-8' : 'bg-funky-dark/20 w-3 hover:bg-funky-dark/40'
              }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;