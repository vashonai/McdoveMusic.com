"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Cover from "@/components/Cover";
import Wave from "@/components/Wave";
import { Close, Pause, Play, Volume } from "@/components/Icons";
import type { Beat } from "@/lib/catalog";
import { clock } from "@/lib/format";
import { usePlayerStore } from "@/store/usePlayerStore";

/**
 * The transport. It lives in the root layout, so navigating the site never
 * interrupts playback — start a beat on the home page, filter the catalog,
 * open a detail page, and it keeps going.
 *
 * This is the only <audio> element on the site; every waveform, card play
 * button and the hero read their state from the same store.
 */
export default function Dock() {
  const current = usePlayerStore((s) => s.current);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const volume = usePlayerStore((s) => s.volume);
  const time = usePlayerStore((s) => s.time);
  const duration = usePlayerStore((s) => s.duration);
  const seekTo = usePlayerStore((s) => s.seekTo);
  const toggle = usePlayerStore((s) => s.toggle);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const setTime = usePlayerStore((s) => s.setTime);
  const setDuration = usePlayerStore((s) => s.setDuration);
  const clearSeek = usePlayerStore((s) => s.clearSeek);
  const close = usePlayerStore((s) => s.close);

  const audioRef = useRef<HTMLAudioElement>(null);
  // Kept so the dock can slide out with its content still rendered, rather
  // than blanking the instant the track is cleared.
  const [last, setLast] = useState<Beat | null>(null);
  if (current && current !== last) setLast(current);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) {
      // Browsers block autoplay until the user has interacted; if that
      // happens, say so in the UI instead of showing a lying play state.
      a.play().catch(() => usePlayerStore.setState({ isPlaying: false }));
    } else {
      a.pause();
    }
  }, [isPlaying, current]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (seekTo == null) return;
    if (audioRef.current) audioRef.current.currentTime = seekTo;
    clearSeek();
  }, [seekTo, clearSeek]);

  useEffect(() => {
    document.body.classList.toggle("has-dock", !!current);
    return () => document.body.classList.remove("has-dock");
  }, [current]);

  const beat = current ?? last;

  return (
    <div className={`dock${current ? " is-up" : ""}`} role="region" aria-label="Now playing">
      {current && (
        <audio
          key={current.id}
          ref={audioRef}
          src={current.previewUrl}
          preload="metadata"
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || current.length)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onEnded={() => {
            setTime(0);
            usePlayerStore.setState({ isPlaying: false });
          }}
        />
      )}

      {beat && (
        <div className="dock__in">
          <Link href={`/beats/${beat.slug}`} className="dock__art" aria-label={`Open ${beat.title}`}>
            <Cover id={beat.id} art={beat.art} title={beat.title} />
          </Link>

          <div className="dock__id">
            <Link href={`/beats/${beat.slug}`}>
              <b>{beat.title}</b>
            </Link>
            <span>
              {beat.bpm} BPM · {beat.key}
            </span>
          </div>

          <button className="dock__btn" onClick={toggle} aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? <Pause /> : <Play />}
          </button>

          <div className="dock__wave">
            <span className="dock__t">{clock(time)}</span>
            <Wave beat={beat} bars={88} height={40} dark className="dock__bars" />
            <span className="dock__t">{clock(duration || beat.length)}</span>
          </div>

          <label className="dock__vol">
            <Volume width={16} height={16} />
            <span className="sr-only">Volume</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
            />
          </label>

          <Link href={`/beats/${beat.slug}`} className="btn btn--cta btn--sm">
            Buy beat
          </Link>

          <button className="dock__close" onClick={close} aria-label="Close player">
            <Close />
          </button>
        </div>
      )}
    </div>
  );
}
