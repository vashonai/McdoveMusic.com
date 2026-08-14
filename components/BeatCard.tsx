"use client";

import Link from "next/link";
import Cover from "@/components/Cover";
import Wave from "@/components/Wave";
import { Pause, Play } from "@/components/Icons";
import type { Beat } from "@/lib/catalog";
import { money } from "@/lib/format";
import { usePlayerStore } from "@/store/usePlayerStore";

export default function BeatCard({ beat }: { beat: Beat }) {
  const current = usePlayerStore((s) => s.current);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const play = usePlayerStore((s) => s.play);

  const on = current?.id === beat.id && isPlaying;

  return (
    <article className="card">
      <div className="card__art">
        <Cover id={beat.id} art={beat.art} title={beat.title} />
        <div className="card__badges">
          {beat.kind === "riddim" && <span className="badge badge--riddim">Riddim</span>}
          <span className="badge">{beat.genre}</span>
        </div>
        <button
          className={`card__play${on ? " is-on" : ""}`}
          onClick={() => play(beat)}
          aria-label={`${on ? "Pause" : "Play"} ${beat.title}`}
        >
          {on ? <Pause /> : <Play />}
        </button>
      </div>

      <div className="card__body">
        <Link href={`/beats/${beat.slug}`} className="card__title">
          {beat.title}
        </Link>

        <Wave beat={beat} bars={44} height={30} />

        <div className="meta">
          <span>{beat.bpm} BPM</span>
          <span>{beat.key}</span>
          <span className="soft">{beat.mood}</span>
        </div>

        <div className="card__foot">
          <span className="price">{money(beat.price)}</span>
          <Link href={`/beats/${beat.slug}`} className="btn btn--cta btn--sm">
            Buy beat
          </Link>
        </div>
      </div>
    </article>
  );
}
