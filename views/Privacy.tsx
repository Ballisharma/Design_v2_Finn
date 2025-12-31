import React from 'react';
import { Shield, Lock, Eye, Server, UserCheck } from 'lucide-react';

const Privacy: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-fade-in min-h-screen bg-funky-light">
       <div className="bg-funky-dark text-white py-20 px-6 text-center">
         <h1 className="font-heading font-black text-5xl md:text-6xl mb-4">PRIVACY POLICY</h1>
         <p className="font-mono opacity-60">Your secrets are safe with us. Last updated: October 2025.</p>
       </div>

       <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
         
         {/* Sidebar Navigation */}
         <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <h3 className="font-heading font-bold text-lg mb-4 text-funky-dark">CONTENTS</h3>
               <nav className="space-y-2">
                 {['1. Data Collection', '2. Data Usage', '3. Sharing', '4. Cookies', '5. Your Rights', '6. Contact'].map((item, i) => (
                   <button 
                     key={i}
                     onClick={() => scrollToSection(`section-${i+1}`)}
                     className="block w-full text-left text-sm text-gray-500 hover:text-funky-green hover:bg-funky-light px-3 py-2 rounded-lg transition-colors"
                   >
                     {item}
                   </button>
                 ))}
               </nav>
            </div>
         </div>

         {/* Content */}
         <div className="lg:col-span-3">
           <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border-4 border-white relative overflow-hidden">
             
             <div className="bg-green-50 p-6 rounded-2xl border border-green-100 mb-12 flex gap-4 items-start">
                <Lock className="text-green-600 shrink-0 mt-1" />
                <div>
                   <h4 className="font-bold text-green-800 text-sm uppercase tracking-wide mb-1">Privacy Promise</h4>
                   <p className="text-sm text-green-700 leading-relaxed">
                      We collect your info solely to send you socks and improve your experience. We don't sell your data to evil corporations, data brokers, or sock puppets. Your payment info is encrypted and never stored on our servers.
                   </p>
                </div>
             </div>
             
             <div className="prose prose-lg prose-headings:font-heading prose-headings:font-black prose-headings:text-funky-dark text-gray-600 max-w-none space-y-12">
               
               <section id="section-1">
                 <h3>1. What Personal Data We Collect</h3>
                 <div className="grid md:grid-cols-2 gap-4 not-prose mb-6">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                       <h4 className="font-bold text-funky-dark mb-2 flex items-center gap-2"><UserCheck size={16}/> Provided by You</h4>
                       <p className="text-sm">Name, Email, Shipping Address, Billing Address, Payment Details.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                       <h4 className="font-bold text-funky-dark mb-2 flex items-center gap-2"><Server size={16}/> Auto-Collected</h4>
                       <p className="text-sm">IP Address, Browser Type, Time Zone, Device Info.</p>
                    </div>
                 </div>
                 <p>
                   When you make a purchase, we collect certain information from you, including your name, billing address, shipping address, payment information, email address, and phone number.
                 </p>
               </section>

               <section id="section-2">
                 <h3>2. How We Use Your Personal Data</h3>
                 <p>We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).</p>
                 <ul>
                   <li>Communicate with you;</li>
                   <li>Screen our orders for potential risk or fraud; and</li>
                   <li>When in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services.</li>
                 </ul>
               </section>

               <section id="section-3">
                 <h3>3. Sharing Your Personal Data</h3>
                 <p>
                   We share your Personal Information with third parties to help us use your Personal Information, as described above.
                 </p>
                 <ul>
                    <li><strong>Shopify/WooCommerce/Custom:</strong> To power our online store.</li>
                    <li><strong>Google Analytics:</strong> To help us understand how our customers use the Site.</li>
                    <li><strong>Shipping Partners:</strong> To get the package to your door.</li>
                 </ul>
                 <p>
                   We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice.
                 </p>
               </section>

               <section id="section-4">
                 <h3>4. Cookies</h3>
                 <p>
                   We use cookies to maintain your cart session and remember your preferences. You can choose to disable cookies through your browser settings, but then you might not be able to add things to your cart (which would be sad).
                 </p>
               </section>
               
               <section id="section-5">
                 <h3>5. Your Rights</h3>
                 <p>
                   You have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us.
                 </p>
               </section>

               <section id="section-6">
                 <h3>6. Contact Us</h3>
                 <div className="bg-funky-light p-6 rounded-2xl not-prose">
                    <p className="text-sm text-gray-500 mb-2">For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at:</p>
                    <a href="mailto:privacy@jumplings.com" className="font-bold text-funky-blue text-lg hover:underline">privacy@jumplings.com</a>
                 </div>
               </section>
             </div>
           </div>
         </div>
       </div>
    </div>
  );
};

export default Privacy;