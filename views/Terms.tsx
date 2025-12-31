import React from 'react';
import { ScrollText, AlertCircle, ArrowRight } from 'lucide-react';

const Terms: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-fade-in min-h-screen bg-funky-light">
       <div className="bg-funky-dark text-white py-20 px-6 text-center">
         <h1 className="font-heading font-black text-5xl md:text-6xl mb-4">TERMS OF SERVICE</h1>
         <p className="font-mono opacity-60">The boring but important legal stuff. Last updated: October 2025.</p>
       </div>

       <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
         
         {/* Sidebar Navigation */}
         <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <h3 className="font-heading font-bold text-lg mb-4 text-funky-dark">CONTENTS</h3>
               <nav className="space-y-2">
                 {['1. Introduction', '2. Products', '3. Orders', '4. Returns', '5. Intellectual Property', '6. Liability', '7. Changes'].map((item, i) => (
                   <button 
                     key={i}
                     onClick={() => scrollToSection(`section-${i+1}`)}
                     className="block w-full text-left text-sm text-gray-500 hover:text-funky-blue hover:bg-funky-light px-3 py-2 rounded-lg transition-colors"
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
             
             <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-12 flex gap-4 items-start">
                <AlertCircle className="text-blue-500 shrink-0 mt-1" />
                <div>
                   <h4 className="font-bold text-blue-800 text-sm uppercase tracking-wide mb-1">TL;DR Summary</h4>
                   <p className="text-sm text-blue-700 leading-relaxed">
                      This website is run by Jumplings. If you buy from us, be nice. Don't steal our images. We try our best to be accurate with prices and colors, but sometimes errors happen. If you break the rules, we can ban you (sadly).
                   </p>
                </div>
             </div>
             
             <div className="prose prose-lg prose-headings:font-heading prose-headings:font-black prose-headings:text-funky-dark text-gray-600 max-w-none space-y-12">
               
               <section id="section-1">
                 <h3>1. Introduction</h3>
                 <p>
                   Welcome to Jumplings. By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions. These Terms apply to all users of the site, including browsers, vendors, customers, merchants, and contributors of content.
                 </p>
               </section>

               <section id="section-2">
                 <h3>2. Products & Pricing</h3>
                 <p>
                   We have made every effort to display as accurately as possible the colors and images of our products. We cannot guarantee that your computer monitor's display of any color will be accurate.
                 </p>
                 <p>
                   Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service without notice. We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.
                 </p>
               </section>

               <section id="section-3">
                 <h3>3. Accuracy of Billing & Orders</h3>
                 <p>
                   We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. These restrictions may include orders placed by or under the same customer account, the same credit card, and/or orders that use the same billing and/or shipping address.
                 </p>
               </section>

               <section id="section-4">
                 <h3>4. Returns & Refunds</h3>
                 <p>
                   Our policy lasts 7 days. If 7 days have gone by since your purchase arrived, unfortunately, we can’t offer you a refund or exchange. To be eligible for a return, your item must be unused and in the same condition that you received it. See our Returns page for full details.
                 </p>
               </section>

               <section id="section-5">
                 <h3>5. Intellectual Property</h3>
                 <p>
                   All content included on this site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of Jumplings or its content suppliers and protected by international copyright laws. You may not reuse our funky designs without permission.
                 </p>
               </section>
               
               <section id="section-6">
                 <h3>6. Limitation of Liability</h3>
                 <p>
                   In no case shall Jumplings, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind.
                 </p>
               </section>

               <section id="section-7">
                 <h3>7. Changes to Terms</h3>
                 <p>
                   You can review the most current version of the Terms of Service at any time at this page. We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of Service by posting updates and changes to our website.
                 </p>
               </section>

               <div className="pt-8 border-t border-gray-100 text-sm text-gray-400 font-mono">
                  Questions about the Terms of Service should be sent to us at <a href="mailto:legal@jumplings.com" className="text-funky-blue underline">legal@jumplings.com</a>.
               </div>
             </div>
           </div>
         </div>
       </div>
    </div>
  );
};

export default Terms;