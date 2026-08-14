import Link from "next/link";
import HeroSearch from "@/components/HeroSearch";
import HeroWave from "@/components/HeroWave";
import BeatGrid from "@/components/BeatGrid";
import { Check, Headphones, Lock, Bolt, Shield } from "@/components/Icons";
import { BEATS, GENRES, PRODUCER } from "@/lib/catalog";
import { waveHeights } from "@/lib/generative";

export default function HomePage() {
  const featured = [...BEATS].sort((a, b) => +new Date(b.released) - +new Date(a.released)).slice(0, 8);

  return (
    <>
      {/* ---------------- hero ---------------- */}
      <section className="hero">
        <div className="hero__in">
          <span className="hero__kicker">
            <span className="dot" />
            One producer · {PRODUCER.stats[0].value} beats and riddims
          </span>
          <h1>
            Find your
            <br />
            <em>sound.</em>
          </h1>
          <p className="hero__sub">
            Premium riddims and instrumentals for artists ready to make their next record. Every one built by {PRODUCER.name}.
          </p>
          <HeroSearch />
          <div className="hero__stats">
            <div className="hero__stat">
              <b>3</b>
              <span>License tiers</span>
            </div>
            <div className="hero__stat">
              <b>&lt; 60s</b>
              <span>To delivery</span>
            </div>
            <div className="hero__stat">
              <b>0</b>
              <span>Samples to clear</span>
            </div>
          </div>
        </div>
        <HeroWave />
      </section>

      {/* ---------------- featured ---------------- */}
      <section className="section">
        <div className="wrap">
          <div className="head-row">
            <div>
              <span className="eyebrow">Fresh this week</span>
              <h2>Latest beats</h2>
            </div>
            <Link href="/beats" className="btn btn--ghost btn--sm">
              See the full catalog →
            </Link>
          </div>
          <BeatGrid beats={featured} />
        </div>
      </section>

      {/* ---------------- genres ---------------- */}
      <section className="section section--tint">
        <div className="wrap">
          <div className="head-row">
            <div>
              <span className="eyebrow">Start somewhere</span>
              <h2>Browse by genre</h2>
            </div>
          </div>
          <div className="genres">
            {GENRES.map((g, i) => {
              const count = BEATS.filter((b) => b.genre === g).length;
              const bars = waveHeights(i + 11, 14);
              return (
                <Link key={g} href={`/beats?genre=${encodeURIComponent(g)}`} className="genre">
                  <span>
                    <b>{g}</b>
                    <br />
                    <em>{count * 9 + 12} beats</em>
                  </span>
                  <span className="genre__bars" aria-hidden="true">
                    {bars.map((h, j) => (
                      <span key={j} style={{ height: `${(h * 100).toFixed(0)}%` }} />
                    ))}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- the producer ---------------- */}
      <section className="section">
        <div className="wrap">
          <div className="band">
            <div className="band__in">
              <div className="monogram">M</div>
              <div>
                <span className="eyebrow" style={{ color: "var(--lime)" }}>
                  Who makes this
                </span>
                <h2 style={{ margin: "10px 0 14px" }}>{PRODUCER.tagline}</h2>
                <p>{PRODUCER.bio[0]}</p>
                <div className="band__stats">
                  {PRODUCER.stats.map((s) => (
                    <div key={s.label}>
                      <b>{s.value}</b>
                      <span>{s.label}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
                  <Link href="/producer" className="btn btn--onnavy">
                    Read the full story
                  </Link>
                  <Link href="/producer#contact" className="btn btn--cta">
                    Request custom work
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- licensing ---------------- */}
      <section className="section section--tint">
        <div className="wrap">
          <div className="head-row">
            <div>
              <span className="eyebrow">Licensing, in plain english</span>
              <h2>Pick a license, keep the rights you need</h2>
              <p className="lede" style={{ marginTop: 14 }}>
                Every beat carries the same tiers, so the terms never change from page to page. Prices below are for a
                typical beat.
              </p>
            </div>
            <Link href="/licensing" className="btn btn--ghost btn--sm">
              Compare in full →
            </Link>
          </div>
          <div className="lic-grid">
            <div className="lic">
              <h3>MP3 lease</h3>
              <div className="lic__price">
                $29.99 <small>/ beat</small>
              </div>
              <ul className="ticks">
                {["Tagless MP3, 320 kbps", "Up to 100,000 streams", "Music videos and live shows", "McDove keeps ownership"].map((t) => (
                  <li key={t}>
                    <Check width={15} height={15} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lic lic--best">
              <span className="lic__tag">Most licensed</span>
              <h3>WAV + trackout</h3>
              <div className="lic__price">
                $119.99 <small>/ beat</small>
              </div>
              <ul className="ticks">
                {["24-bit WAV and full stems", "Unlimited streams and sales", "Paid distribution everywhere", "Chord chart included"].map((t) => (
                  <li key={t}>
                    <Check width={15} height={15} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lic">
              <h3>Exclusive rights</h3>
              <div className="lic__price">
                from $499 <small>/ beat</small>
              </div>
              <ul className="ticks">
                {["Beat comes off the catalog", "Stems plus a signed contract", "No stream or sales cap", "Publishing split negotiable"].map((t) => (
                  <li key={t}>
                    <Check width={15} height={15} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- why ---------------- */}
      <section className="section section--tight">
        <div className="wrap">
          <div className="values">
            <div className="value">
              <span className="value__icon">
                <Headphones />
              </span>
              <b>Mixed and mastered</b>
              <p>Every beat is checked for level, loudness and clean stems before it goes live.</p>
            </div>
            <div className="value">
              <span className="value__icon">
                <Lock />
              </span>
              <b>Licensing you can read</b>
              <p>Three tiers, one page, no legal maze. You always know what you can release.</p>
            </div>
            <div className="value">
              <span className="value__icon">
                <Bolt />
              </span>
              <b>Files land instantly</b>
              <p>Downloads and your license PDF hit your inbox the second payment clears.</p>
            </div>
            <div className="value">
              <span className="value__icon">
                <Shield />
              </span>
              <b>Nothing sampled</b>
              <p>Every note is played or programmed here, so there is never a clearance to chase.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="section section--tight">
        <div className="wrap">
          <div className="cta-band">
            <h2>Your next record starts here.</h2>
            <p>Explore the catalog and find the beat that fits your vision.</p>
            <Link href="/beats" className="btn btn--cta btn--lg">
              Explore beats
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
