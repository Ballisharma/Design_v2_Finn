import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductHero: React.FC = () => {
    return (
        <section className="width-full overflow-hidden bg-[#FFDEE2] relative">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">

                {/* Left: Image Side (50-50 split) */}
                <div className="w-full md:w-1/2 relative h-[400px] md:h-[600px] bg-[#FFDEE2]">
                    {/* Placeholder for the bottle splash image */}
                    <div className="w-full h-full flex items-center justify-center bg-white/10 border-r-0 md:border-r border-[#FF0055]/10">
                        {/* Dashed placeholder box inside */}
                        <div className="w-[80%] h-[80%] border-4 border-dashed border-[#FF0055]/30 flex items-center justify-center rounded-xl">
                            <span className="font-heading font-bold text-[#FF0055]/40 text-2xl md:text-4xl uppercase tracking-widest text-center">Add Image <br /> Here</span>
                        </div>
                    </div>


                </div>

                {/* Right: Content Side */}
                <div className="w-full md:w-1/2 px-8 py-16 md:pl-24 md:pr-10 text-center md:text-left flex flex-col items-center md:items-start z-10">
                    <h2 className="font-heading font-medium text-[#FF0055] text-6xl md:text-[5.5rem] leading-none mb-4 tracking-tighter">
                        Fur Hero
                    </h2>

                    <h3 className="font-heading font-normal text-[#FF0055] text-2xl md:text-[2.5rem] mb-10 leading-[1.1]">
                        Super Soothing <br />
                        Oatmeal Shampoo
                    </h3>

                    <Link to="/shop" className="bg-[#FF0055] text-white font-heading font-bold text-lg px-12 py-4 rounded-full hover:scale-105 transition-transform flex items-center gap-2 shadow-lg hover:bg-[#D90045]">
                        Shop Now <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ProductHero;
