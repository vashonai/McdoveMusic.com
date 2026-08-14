"use client";

import Wave from "@/components/Wave";
import { Pause, Play } from "@/components/Icons";
import type { Beat } from "@/lib/catalog";
import { clock } from "@/lib/format";
import { usePlayerStore } from "@/store/usePlayerStore";

/** The big transport on a beat's own page. Same store as the dock. */
export default function BeatPlayer({ beat }: { beat: Beat }) {
  const current = usePlayerStore((s) => s.current);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const time = usePlayerStore((s) => s.time);
  const duration = usePlayerStore((s) => s.duration);
  const play = usePlayerStore((s) => s.play);

  const isCurrent = current?.id === beat.id;
  const on = isCurrent && isPlaying;

  return (
    <div className="player">
      <div className="player__row">
        <button className="player__btn" onClick={() => play(beat)} aria-label={`${on ? "Pause" : "Play"} ${beat.title}`}>
          {on ? <Pause width={20} height={20} /> : <Play width={20} height={20} />}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Wave beat={beat} bars={120} height={56} dark />
          <div className="player__time">
            <span>{clock(isCurrent ? time : 0)}</span>
            <span>{clock(isCurrent && duration ? duration : beat.length)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
