import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Abstract Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl z-0">
          <div className="absolute top-[20%] left-[20%] w-64 h-64 bg-brand-blue/30 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[20%] right-[20%] w-64 h-64 bg-brand-green/30 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight"
          >
            Premium Beats for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-green">
              Next-Gen Artists.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-10"
          >
            Explore our curated catalog of high-quality instrumentals. 
            Instant delivery, clear licensing, and stems available.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center gap-4"
          >
            <Link 
              to="/store"
              className="bg-brand-blue hover:bg-brand-blueLight text-white font-bold py-4 px-8 rounded-full shadow-glow-blue transition-all flex items-center gap-2 group"
            >
              <Play className="fill-white group-hover:scale-110 transition-transform" /> 
              Browse Store
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
