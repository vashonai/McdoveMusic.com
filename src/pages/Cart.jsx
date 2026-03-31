import React from 'react';
import { motion } from 'framer-motion';
import SquarePaymentForm from '../components/checkout/SquarePaymentForm';

const Cart = () => {
  return (
    <div className="pt-24 px-4 max-w-7xl mx-auto flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Checkout</h1>
          <p className="text-gray-400">Complete your purchase to download your tracks.</p>
        </div>

        <SquarePaymentForm totalAmount={2999} />
      </motion.div>
    </div>
  );
};

export default Cart;
