import type { Metadata } from "next";
import Link from "next/link";
import { Bolt, Check, Lock, Shield } from "@/components/Icons";
import { BEATS, licensesFor } from "@/lib/catalog";
import { money } from "@/lib/format";

export const metadata: Metadata = {
  title: "Licensing — McDoveMusic",
  description: "Four tiers, one page, no legal maze. What each license lets you release, in plain english.",
};

/* Every beat carries the same tiers; a mid-priced beat shows representative
   numbers without pretending the price is fixed. */
const SAMPLE = BEATS.find((b) => b.price === 34.99) ?? BEATS[0];

const FAQ = [
  {
    q: "What does a lease actually give me?",
    a: "The right to release a song built on the beat, on the terms of the tier you bought. McDove keeps ownership of the underlying instrumental and can license it to other artists.",
  },
  {
    q: "Do I have to credit the producer?",
    a: "Yes on every tier except exclusive, where it is negotiable. The standard credit is “Prod. McDove” in the title or description.",
  },
  {
    q: "What happens when a beat sells exclusively?",
    a: "It comes off the catalog that day. Leases already sold stay valid on their original terms — nothing you have released gets pulled.",
  },
  {
    q: "Is anything here sampled?",
    a: "No. Every note is played or programmed in-house, so there is never a clearance to chase and no third party can claim your release.",
  },
  {
    q: "Can I use a beat in a video or an advert?",
    a: "Music videos and live performances are covered from the MP3 lease up. Paid advertising and sync placements need the trackout tier or an exclusive.",
  },
  {
    q: "How do refunds work?",
    a: "Files are delivered instantly, so a purchase cannot be reversed once downloaded. If something is wrong with the files, email within 14 days and it gets fixed or refunded.",
  },
];

export default function LicensingPage() {
  const licenses = licensesFor(SAMPLE);

  return (
    <>
      <section className="section section--tint">
        <div className="wrap">
          <div className="crumbs" style={{ padding: 0 }}>
            <Link href="/">Home</Link> / Licensing
          </div>
          <div style={{ padding: "18px 0 30px" }}>
            <span className="eyebrow">Licensing, in plain english</span>
            <h2 style={{ marginTop: 8 }}>Pick a license, keep the rights you need</h2>
            <p className="lede" style={{ marginTop: 14 }}>
              Every beat carries the same four tiers, so the terms never change from page to page. The prices below are for a{" "}
              {money(SAMPLE.price)} beat — each tier scales with the beat&apos;s own price.
            </p>
          </div>

          <div className="lic-grid">
            {licenses.map((l) => (
              <div key={l.id} className={`lic${l.id === "trackout" ? " lic--best" : ""}`}>
                {l.id === "trackout" && <span className="lic__tag">Most licensed</span>}
                <h3>{l.name}</h3>
                <div className="lic__price">
                  {l.id === "exclusive" ? `from ${money(l.price)}` : money(l.price)} <small>/ beat</small>
                </div>
                <ul className="ticks">
                  {l.detail.map((d) => (
                    <li key={d}>
                      <Check width={15} height={15} />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap">
          <div className="values">
            <div className="value">
              <span className="value__icon">
                <Lock />
              </span>
              <b>Ownership stays put</b>
              <p>On every lease, McDove keeps the master. You own your vocal and your recording.</p>
            </div>
            <div className="value">
              <span className="value__icon">
                <Shield />
              </span>
              <b>Nothing to clear</b>
              <p>No samples anywhere in the catalog, so no third party can claim your release.</p>
            </div>
            <div className="value">
              <span className="value__icon">
                <Bolt />
              </span>
              <b>Delivered instantly</b>
              <p>Files and your license PDF land the second payment clears, on every tier.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="wrap">
          <div className="head-row">
            <div>
              <span className="eyebrow">Before you buy</span>
              <h2>Questions worth asking</h2>
            </div>
          </div>
          <div className="faq">
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap">
          <div className="cta-band">
            <h2>Ready when you are.</h2>
            <p>Pick a beat, pick a tier, and the files are yours in under a minute.</p>
            <Link href="/beats" className="btn btn--cta btn--lg">
              Explore beats
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
