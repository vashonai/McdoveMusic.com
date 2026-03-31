import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-brand-blue/20 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-gray-600">© {new Date().getFullYear()} McDoveMusic. All rights reserved.</p>
        <p className="mt-2 text-sm text-brand-green/70 font-medium tracking-wider uppercase">Playful. Professional. Premium.</p>
      </div>
    </footer>
  );
};

export default Footer;
