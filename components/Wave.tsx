"use client";

import { useMemo } from "react";
import type { Beat } from "@/lib/catalog";
import { waveHeights } from "@/lib/generative";
import { progressOf, usePlayerStore } from "@/store/usePlayerStore";

interface Props {
  beat: Beat;
  bars?: number;
  height?: number;
  dark?: boolean;
  /** seed override — the dock reuses the beat's own seed so the bars match */
  className?: string;
}

/**
 * A scrubbable waveform. Bars are deterministic per beat, so the same beat
 * looks the same in a card, on its detail page and in the dock.
 */
export default function Wave({ beat, bars = 44, height = 30, dark = false, className = "" }: Props) {
  const current = usePlayerStore((s) => s.current);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const time = usePlayerStore((s) => s.time);
  const duration = usePlayerStore((s) => s.duration);
  const play = usePlayerStore((s) => s.play);
  const seek = usePlayerStore((s) => s.seek);

  const heights = useMemo(() => waveHeights(beat.id, bars), [beat.id, bars]);

  const isCurrent = current?.id === beat.id;
  const p = isCurrent ? progressOf(time, duration) : 0;
  const span = duration || beat.length;

  const jumpTo = (fraction: number) => {
    if (!isCurrent) play(beat);
    seek(Math.max(0, Math.min(1, fraction)) * span);
  };

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    jumpTo((e.clientX - r.left) / r.width);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      jumpTo((time + 5) / span);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      jumpTo((time - 5) / span);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      play(beat);
    }
  };

  const barEls = heights.map((h, i) => <span key={i} style={{ height: `${(h * 100).toFixed(1)}%` }} />);

  return (
    <div
      className={`wave${dark ? " wave--dark" : ""}${isCurrent && isPlaying ? " is-playing" : ""}${className ? ` ${className}` : ""}`}
      style={{ height }}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role="slider"
      tabIndex={0}
      aria-label={`Seek ${beat.title}`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(p * 100)}
      aria-valuetext={`${Math.round(p * 100)}%`}
    >
      <div className="wave__bars wave__base">{barEls}</div>
      <div className="wave__bars wave__fill" style={{ clipPath: `inset(0 ${(100 - p * 100).toFixed(2)}% 0 0)` }}>
        {barEls}
      </div>
    </div>
  );
}
