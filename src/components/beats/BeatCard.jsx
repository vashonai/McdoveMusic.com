import React from 'react';
import { Play, Pause } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';

const BeatCard = ({ beat }) => {
  const { currentTrack, isPlaying, setTrack, togglePlay } = usePlayerStore();
  
  const isCurrentTrack = currentTrack?.id === beat.id;

  const handlePlayClick = () => {
    if (isCurrentTrack) {
      togglePlay();
    } else {
      setTrack(beat);
    }
  };

  return (
    <div className="bg-white border border-brand-blue/10 rounded-beat p-4 hover:shadow-glow-blue hover:border-brand-blue/30 transition-all duration-300 group">
      <div className="relative overflow-hidden rounded-lg aspect-square mb-4">
        <img src={beat.cover} alt={beat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        
        {/* Play Overlay */}
        <button 
          onClick={handlePlayClick}
          className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300 backdrop-blur-[2px] ${isCurrentTrack && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          {isCurrentTrack && isPlaying ? (
            <Pause size={48} className="fill-brand-green text-brand-green drop-shadow-lg" />
          ) : (
            <Play size={48} className="fill-white text-white drop-shadow-lg" />
          )}
        </button>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-brand-dark group-hover:text-brand-blue transition-colors">{beat.title}</h3>
          <p className="text-gray-600 text-sm mb-2">{beat.bpm} BPM • {beat.key}</p>
        </div>
        <span className="font-bold text-brand-green">${beat.prices.basic}</span>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {beat.tags.map((tag, idx) => (
          <span key={idx} className="text-xs font-semibold bg-brand-blue/10 text-brand-blue px-2 py-1 rounded-full border border-brand-blue/20">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BeatCard;
