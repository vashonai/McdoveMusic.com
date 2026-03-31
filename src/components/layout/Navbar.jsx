import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Music, Info, Mail, Home } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

const Navbar = () => {
  const items = useCartStore((state) => state.items);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Store', path: '/store', icon: Music },
    { name: 'Licenses', path: '/licenses', icon: Info },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-brand-blue/10">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-green rounded-xl flex items-center justify-center shadow-glow-blue group-hover:rotate-12 transition-transform">
            <Music className="text-brand-dark" size={24} />
          </div>
          <span className="font-black text-2xl tracking-tighter text-brand-dark">McDove<span className="text-brand-blue">Music</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`text-sm font-bold transition-colors hover:text-brand-blue ${location.pathname === link.path ? 'text-brand-blue' : 'text-gray-600'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link to="/checkout" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group">
            <ShoppingCart size={24} className="text-gray-600 group-hover:text-brand-green transition-colors" />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-blue text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-glow-blue animate-bounce">
                {items.length}
              </span>
            )}
          </Link>
          <Link to="/store" className="hidden sm:block bg-brand-blue hover:bg-brand-blueLight text-white px-6 py-2 rounded-full font-bold text-sm shadow-glow-blue transition-all">
            Browse Beats
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
