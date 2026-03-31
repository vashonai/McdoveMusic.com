import React, { useState } from 'react';
import beatsData from '../data/beats.json';
import BeatCard from '../components/beats/BeatCard';
import { motion } from 'framer-motion';

const Store = () => {
  const [search, setSearch] = useState('');

  const filteredBeats = beatsData.filter(beat => 
    beat.title.toLowerCase().includes(search.toLowerCase()) || 
    beat.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="pt-24 px-4 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Beat Catalog</h1>
        <p className="text-gray-600">Discover your next hit from our premium collection.</p>
        
        <div className="mt-8 max-w-md mx-auto relative group">
          <input 
            type="text" 
            placeholder="Search by title or genre..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/80 border border-brand-blue/20 rounded-full px-6 py-3 text-brand-dark focus:outline-none focus:border-brand-blue transition-all group-hover:shadow-glow-blue focus:shadow-glow-blue"
          />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredBeats.map((beat) => (
          <BeatCard key={beat.id} beat={beat} />
        ))}
      </motion.div>
      
      {filteredBeats.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No beats found matching your search.
        </div>
      )}
    </div>
  );
};

export default Store;
