import React, { useRef, useEffect } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useCartStore } from '../../store/useCartStore';
import { Play, Pause, Volume2, SkipForward } from 'lucide-react';

const PersistentPlayer = () => {
  const { currentTrack, isPlaying, togglePlay, volume, setVolume } = usePlayerStore();
  const { items, addItem } = useCartStore();
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(e => console.log('Autoplay blocked', e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-brand-blue/20 p-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <audio ref={audioRef} src={currentTrack.previewUrl} />
      
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Track Info */}
        <div className="flex items-center gap-4 w-1/3">
          <img src={currentTrack.cover} className="w-12 h-12 rounded-lg object-cover" alt={currentTrack.title} />
          <div>
            <h4 className="font-bold text-brand-dark leading-tight">{currentTrack.title}</h4>
            <p className="text-brand-green text-sm">{currentTrack.bpm} BPM • {currentTrack.key}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center w-1/3 gap-2">
          <button 
            onClick={togglePlay}
            className="p-3 bg-brand-blue rounded-full hover:scale-105 transition-transform shadow-glow-blue"
          >
            {isPlaying ? <Pause className="fill-white" /> : <Play className="fill-white" />}
          </button>
        </div>

        {/* Volume/Actions */}
        <div className="flex items-center justify-end gap-4 w-1/3">
          <Volume2 className="text-gray-400" size={20} />
          <input 
            type="range" 
            min="0" max="1" step="0.01" 
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 accent-brand-green" 
          />
          <button 
            onClick={() => {
              if (!items.find(i => i.id === currentTrack.id)) {
                addItem({
                  id: currentTrack.id,
                  title: currentTrack.title,
                  price: currentTrack.prices.basic
                });
              }
            }}
            className="bg-brand-green hover:bg-brand-greenLight text-brand-dark px-4 py-2 rounded-full font-bold text-sm shadow-glow-green transition-colors"
          >
            {items.find(i => i.id === currentTrack.id) ? 'In Cart ✓' : `Add to Cart — $${currentTrack.prices.basic}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersistentPlayer;
