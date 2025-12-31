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
        className="absolute inset-0 bg-funky-dark/60 backdrop-blur-sm cursor-pointer"
      />

      {/* Modal Content with animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
        className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-y-auto overflow-x-hidden border-4 border-funky-yellow custom-scrollbar-hide z-10"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 p-2 bg-white rounded-full text-funky-dark hover:bg-funky-pink hover:text-white transition-colors border-2 border-gray-100 shadow-md"
        >
          <X size={24} />
        </button>
        
        <ProductDetails isModal={true} />
      </motion.div>
    </div>
  );
};

export default ProductModal;