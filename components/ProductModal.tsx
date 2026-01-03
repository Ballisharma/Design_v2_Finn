import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ProductDetails from '../views/ProductDetails';

const ProductModal: React.FC = () => {
  const navigate = useNavigate();

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleClose = () => {
    navigate(-1);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop with animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
        className="absolute inset-0 bg-funky-dark/70 backdrop-blur-md cursor-pointer"
      />

      {/* Modal Content with animation - Premium v2 Styling */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
        className="relative w-full max-w-5xl max-h-[90vh] md:h-[85vh] bg-white rounded-3xl overflow-y-auto md:overflow-hidden custom-scrollbar-hide z-10 shadow-[0_25px_80px_rgba(0,0,0,0.25),0_0_40px_rgba(239,71,111,0.1)]"
      >
        {/* Premium Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 p-3 md:p-4 bg-funky-dark text-white rounded-full hover:bg-funky-pink hover:rotate-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 border-4 border-white"
        >
          <X size={24} />
        </button>

        <ProductDetails isModal={true} />
      </motion.div>
    </div>
  );
};

export default ProductModal;