"use client";

import { useMemo } from "react";
import { waveHeights } from "@/lib/generative";
import { usePlayerStore } from "@/store/usePlayerStore";

/**
 * Ambient waveform under the hero. It is decorative until something is
 * playing, then it goes lime and animates — the hero doubles as a VU meter.
 */
export default function HeroWave() {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const bars = useMemo(() => waveHeights(4, 96), []);

  return (
    <div className={`hero__wave${isPlaying ? " is-live" : ""}`} aria-hidden="true">
      {bars.map((v, i) => (
        <span key={i} style={{ height: `${(v * 100).toFixed(1)}%`, animationDelay: `${(i % 7) * -90}ms` }} />
      ))}
    </div>
  );
}
