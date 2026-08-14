import { create } from "zustand";
import type { Beat } from "@/lib/catalog";

interface PlayerState {
  current: Beat | null;
  isPlaying: boolean;
  volume: number;
  /** seconds elapsed — fed by the <audio> element's timeupdate */
  time: number;
  /** real duration once metadata loads, falling back to the catalog length */
  duration: number;
  /** set when the user scrubs; the Dock consumes it and resets it to null */
  seekTo: number | null;

  play: (beat: Beat) => void;
  toggle: () => void;
  setVolume: (v: number) => void;
  setTime: (t: number) => void;
  setDuration: (d: number) => void;
  seek: (t: number) => void;
  clearSeek: () => void;
  close: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  current: null,
  isPlaying: false,
  volume: 0.8,
  time: 0,
  duration: 0,
  seekTo: null,

  play: (beat) => {
    const { current, isPlaying } = get();
    // Same beat: this is a play/pause toggle, not a reload.
    if (current?.id === beat.id) {
      set({ isPlaying: !isPlaying });
      return;
    }
    set({ current: beat, isPlaying: true, time: 0, duration: beat.length, seekTo: null });
  },
  toggle: () => set((s) => (s.current ? { isPlaying: !s.isPlaying } : s)),
  setVolume: (v) => set({ volume: v }),
  setTime: (t) => set({ time: t }),
  setDuration: (d) => set({ duration: d || 0 }),
  seek: (t) => set({ time: t, seekTo: t }),
  clearSeek: () => set({ seekTo: null }),
  close: () => set({ current: null, isPlaying: false, time: 0, duration: 0, seekTo: null }),
}));

/** Progress 0–1, guarding the divide before metadata arrives. */
export const progressOf = (time: number, duration: number) => (duration > 0 ? Math.min(1, time / duration) : 0);
