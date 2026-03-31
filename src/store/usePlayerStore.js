import { create } from 'zustand';

export const usePlayerStore = create((set) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 0.8,
  setTrack: (track) => set({ currentTrack: track, isPlaying: true }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (val) => set({ volume: val }),
}));
