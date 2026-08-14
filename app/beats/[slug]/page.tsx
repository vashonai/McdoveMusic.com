import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BeatGrid from "@/components/BeatGrid";
import BeatPlayer from "@/components/BeatPlayer";
import BuyBox from "@/components/BuyBox";
import Cover from "@/components/Cover";
import { BEATS, getBeat, PRODUCER } from "@/lib/catalog";
import { clock } from "@/lib/format";

/* Every beat is prerendered — there are only sixteen of them, and a beat
   page that renders instantly is worth more than a shorter build. */
export function generateStaticParams() {
  return BEATS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const beat = getBeat(slug);
  if (!beat) return { title: "Beat not found — McDoveMusic" };
  return {
    title: `${beat.title} — ${beat.genre} ${beat.kind} at ${beat.bpm} BPM`,
    description: beat.note,
  };
}

export default async function BeatPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const beat = getBeat(slug);
  if (!beat) notFound();

  const near = BEATS.filter((b) => b.id !== beat.id && (b.genre === beat.genre || b.tags.some((t) => beat.tags.includes(t))));
  const related = (near.length ? near : BEATS.filter((b) => b.id !== beat.id)).slice(0, 4);

  return (
    <>
      <div className="wrap">
        <div className="crumbs">
          <Link href="/beats">Beats</Link> / <Link href={`/beats?genre=${encodeURIComponent(beat.genre)}`}>{beat.genre}</Link> /{" "}
          {beat.title}
        </div>

        <div className="detail">
          <div>
            <div className="detail__top">
              <div className="detail__art">
                <Cover id={beat.id} art={beat.art} title={beat.title} />
              </div>

              <div>
                <span className="eyebrow">
                  {beat.genre} · {beat.mood}
                </span>
                <h1 style={{ marginTop: 10 }}>{beat.title}</h1>

                <div className="detail__by">
                  <span className="monogram monogram--sm">M</span>
                  <div>
                    <span>Produced by</span>
                    <br />
                    <Link href="/producer">{PRODUCER.name}</Link>
                  </div>
                </div>

                <div className="meta" style={{ marginTop: 18 }}>
                  <span>{beat.bpm} BPM</span>
                  <span>{beat.key}</span>
                  <span>{clock(beat.length)}</span>
                  <span className="soft">{beat.plays.toLocaleString("en-US")} plays</span>
                  {beat.kind === "riddim" && <span className="soft">Riddim · stems separated</span>}
                </div>
              </div>
            </div>

            <BeatPlayer beat={beat} />

            <div className="quote">
              <p>{beat.note}</p>
              <span>{PRODUCER.name}, on this one</span>
            </div>

            <div style={{ marginTop: 26 }}>
              <span className="eyebrow">Tags</span>
              <div className="tags">
                {beat.tags.map((t) => (
                  <Link key={t} className="tag" href={`/beats?q=${encodeURIComponent(t)}`}>
                    #{t}
                  </Link>
                ))}
              </div>
            </div>

            <div className="about">
              <h3>About this {beat.kind}</h3>
              <p>
                A {beat.mood.toLowerCase()} {beat.genre.toLowerCase()} {beat.kind} at {beat.bpm} BPM in {beat.key}. Arranged
                with an intro, two verses, a hook and a bridge, so you can write straight to it. Delivered dry — no master
                limiter on the stems
                {beat.kind === "riddim" ? ", and the melody stems come separated for voicing sessions." : "."}
              </p>
            </div>
          </div>

          <BuyBox beat={beat} />
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          <div className="head-row">
            <div>
              <span className="eyebrow">More like this</span>
              <h2>Related beats</h2>
            </div>
            <Link href="/beats" className="btn btn--ghost btn--sm">
              See the full catalog →
            </Link>
          </div>
          <BeatGrid beats={related} />
        </div>
      </section>
    </>
  );
}
