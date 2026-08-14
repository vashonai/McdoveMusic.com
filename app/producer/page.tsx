import type { Metadata } from "next";
import Link from "next/link";
import BeatGrid from "@/components/BeatGrid";
import { Check, Instagram, Mail, Spotify, YouTube } from "@/components/Icons";
import { BEATS, PRODUCER } from "@/lib/catalog";

export const metadata: Metadata = {
  title: `${PRODUCER.name} — the producer behind McDoveMusic`,
  description: PRODUCER.tagline,
};

const SOCIAL_ICON: Record<string, React.ComponentType<{ width?: number; height?: number }>> = {
  Instagram,
  YouTube,
  Spotify,
  Email: Mail,
};

export default function ProducerPage() {
  const riddims = BEATS.filter((b) => b.kind === "riddim");
  const latest = [...BEATS].sort((a, b) => +new Date(b.released) - +new Date(a.released));
  const plays = BEATS.reduce((a, b) => a + b.plays, 0);

  return (
    <>
      <section className="banner">
        <div className="wrap">
          <div className="banner__in">
            <div className="monogram">M</div>

            <div style={{ flex: 1, minWidth: 260 }}>
              <span className="eyebrow" style={{ color: "var(--lime)" }}>
                The producer
              </span>
              <h1 style={{ marginTop: 8 }}>{PRODUCER.name}</h1>
              <div className="banner__meta">
                {PRODUCER.location} · producing since {PRODUCER.since} · {(plays / 1000).toFixed(1)}k plays
              </div>
              {PRODUCER.bio.map((p) => (
                <p key={p} className="bio">
                  {p}
                </p>
              ))}

              <div className="socials">
                {PRODUCER.socials.map((s) => {
                  const Icon = SOCIAL_ICON[s.name] ?? Mail;
                  return (
                    <a key={s.name} href={s.href} aria-label={s.name}>
                      <Icon width={17} height={17} />
                    </a>
                  );
                })}
              </div>

              <div className="credits">
                <ul className="ticks">
                  {PRODUCER.credits.map((c) => (
                    <li key={c}>
                      <Check width={15} height={15} />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="banner__acts">
              <Link href="/beats" className="btn btn--onnavy">
                Browse the catalog
              </Link>
              <Link href="#contact" className="btn btn--cta">
                Request custom work
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="head-row">
            <div>
              <span className="eyebrow">Built for voicing</span>
              <h2>Riddims</h2>
              <p className="lede" style={{ marginTop: 14 }}>
                Full versions with the melody stems separated, the way a singer wants them for a session.
              </p>
            </div>
            <Link href="/beats?kind=riddim" className="btn btn--ghost btn--sm">
              All riddims →
            </Link>
          </div>
          <BeatGrid beats={riddims} />
        </div>
      </section>

      <section className="section section--tint">
        <div className="wrap">
          <div className="head-row">
            <div>
              <span className="eyebrow">Everything, newest first</span>
              <h2>The full catalog</h2>
            </div>
            <Link href="/beats" className="btn btn--ghost btn--sm">
              Filter the catalog →
            </Link>
          </div>
          <BeatGrid beats={latest} />
        </div>
      </section>

      <section className="section section--tight" id="contact">
        <div className="wrap">
          <div className="cta-band">
            <h2>Need something built to order?</h2>
            <p>
              Custom riddims, beat packs and reworks of anything in the catalog. Tell me the artist, the tempo and the
              deadline, and you will get a reply the same day.
            </p>
            <a href={`mailto:hello@mcdovemusic.com`} className="btn btn--cta btn--lg">
              Email {PRODUCER.name}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
