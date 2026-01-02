import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuizSection: React.FC = () => {
    return (
        <section className="w-full bg-[#FF8800] py-16 md:py-24 px-4 overflow-hidden relative">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-black/5 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3"></div>

            <div className="max-w-4xl mx-auto relative">
                {/* Main Card */}
                <div className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-16 text-center relative z-10 mx-4 md:mx-0">

                    {/* Peeking Graphic (Simplified representation of the dogs) */}
                    <div className="absolute -left-12 bottom-0 w-24 h-48 bg-funky-dark overflow-hidden rounded-r-full hidden md:block" style={{ borderRadius: '0 100px 0 0', transform: 'rotate(-5deg)' }}>
                        <div className="w-4 h-4 bg-white rounded-full absolute top-8 right-6"></div> {/* "Eye" */}
                    </div>
                    <div className="absolute -right-12 bottom-0 w-24 h-56 bg-funky-dark overflow-hidden rounded-l-full hidden md:block" style={{ borderRadius: '100px 0 0 0', transform: 'rotate(5deg)' }}>
                        <div className="w-4 h-4 bg-white rounded-full absolute top-10 left-6"></div> {/* "Eye" */}
                    </div>


                    <h2 className="font-heading font-black text-funky-dark text-6xl md:text-7xl lg:text-8xl mb-8 tracking-tighter leading-[0.9]">
                        Find Your <br />
                        Perfect Pair
                    </h2>

                    <p className="font-body text-funky-dark text-xl md:text-2xl font-medium opacity-80 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Tell us a bit about your vibe and get tailor-made sock recommendations.
                    </p>

                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-3 bg-funky-dark text-white px-10 py-5 rounded-full font-heading font-bold text-xl hover:bg-[#2a3b5a] transition-all group"
                    >
                        Take Quiz
                        <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {/* Sparkle Icon */}
                    <div className="absolute top-8 right-8 text-[#FF8800] opacity-50 hidden md:block">
                        <Sparkles size={32} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default QuizSection;
