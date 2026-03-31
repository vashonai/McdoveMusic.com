import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Store from './pages/Store';
import PersistentPlayer from './components/beats/PersistentPlayer';
import Checkout from './pages/Checkout';
import Cart from './pages/Cart';

function App() {
  return (
    <div className="bg-white text-brand-dark min-h-screen flex flex-col font-sans relative">
      <Navbar />
      <main className="flex-1 pb-32">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<Store />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/licenses" element={<div className="p-20 text-center font-bold">License Info Page (Coming Soon)</div>} />
          <Route path="/contact" element={<div className="p-20 text-center font-bold">Contact Page (Coming Soon)</div>} />
        </Routes>
      </main>
      <PersistentPlayer />
      
      <footer className="bg-brand-dark text-white border-t border-white/5 py-12 pb-40">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-blue to-brand-green rounded-lg flex items-center justify-center">
                <span className="text-brand-dark font-black">M</span>
              </div>
              <span className="font-black text-xl tracking-tighter">McDove<span className="text-brand-blue">Music</span></span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Premium instrumentals for the modern artist. 
              Elevate your sound with McDove Music.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li><Link to="/store" className="hover:text-brand-blue transition-colors">All Beats</Link></li>
              <li><Link to="/store" className="hover:text-brand-blue transition-colors">New Releases</Link></li>
              <li><Link to="/store" className="hover:text-brand-blue transition-colors">Best Sellers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li><Link to="/licenses" className="hover:text-brand-blue transition-colors">Licensing Info</Link></li>
              <li><Link to="/contact" className="hover:text-brand-blue transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-brand-blue transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Newsletter</h4>
            <p className="text-white/40 text-xs mb-4">Get free sample packs and exclusive discounts.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email address" className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs flex-1 focus:outline-none focus:border-brand-blue text-white" />
              <button className="bg-brand-blue text-white p-2 rounded-full hover:bg-brand-blueLight transition-colors"><ArrowRight size={16} /></button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
