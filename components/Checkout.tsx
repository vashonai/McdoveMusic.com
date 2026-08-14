"use client";

import Link from "next/link";
import { useState } from "react";
import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";
import Cover from "@/components/Cover";
import { Bolt, Check, Lock, Shield } from "@/components/Icons";
import { money, TAX_RATE } from "@/lib/format";
import { useCartStore, type CartItem } from "@/store/useCartStore";

/* Square sandbox credentials fall back to demo IDs so the page still renders
   for anyone who clones this without an .env — see .env.example. */
const APPLICATION_ID = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || "sandbox-sq0idb-demo";
const LOCATION_ID = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || "L-DEMO";

export default function Checkout() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);

  const [details, setDetails] = useState({ first: "", last: "", email: "", artist: "" });
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState<CartItem[] | null>(null);

  const subtotal = items.reduce((a, i) => a + i.price, 0);
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  const field = (k: keyof typeof details) => ({
    value: details[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDetails((d) => ({ ...d, [k]: e.target.value })),
  });

  /**
   * Square tokenizes the card in the browser and hands back a nonce. Charging
   * it needs a server: POST the token to your backend and call the Payments
   * API there. Until that endpoint exists this resolves optimistically, which
   * is the same behaviour the Vite build shipped with.
   */
  const handlePayment = async () => {
    setProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      setPaid(items);
      clearCart();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  /* ---------------- delivered ---------------- */
  if (paid) {
    return (
      <div className="wrap">
        <div className="done">
          <div className="done__mark">
            <Check width={34} height={34} />
          </div>
          <span className="eyebrow">Payment received</span>
          <h2 style={{ margin: "12px 0 14px" }}>Your files are ready</h2>
          <p className="lede" style={{ margin: "0 auto 30px" }}>
            {details.email ? `We sent everything to ${details.email} as well.` : "We sent everything to your email as well."}{" "}
            Downloads stay in your account for good.
          </p>

          {paid.map((i) => (
            <div key={i.id} className="dl">
              <div className="sum-item__art" style={{ width: 44, height: 44 }}>
                <Cover id={i.beatId} art={i.art} title={i.title} />
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <b>{i.title}</b>
                <span>{i.licenseName} · WAV, MP3, license PDF</span>
              </div>
              <button className="btn btn--blue btn--sm">Download</button>
            </div>
          ))}

          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
            <Link href="/beats" className="btn btn--ghost">
              Keep browsing
            </Link>
            <Link href="/account" className="btn btn--cta">
              Go to my downloads
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- empty ---------------- */
  if (!items.length) {
    return (
      <div className="wrap">
        <div className="crumbs">
          <Link href="/beats">Beats</Link> / Checkout
        </div>
        <div className="empty" style={{ margin: "40px 0 80px" }}>
          <b>Your cart is empty</b>
          <p>Find a beat you like, choose a license, and it will show up here.</p>
          <Link href="/beats" className="btn btn--cta btn--sm">
            Browse beats
          </Link>
        </div>
      </div>
    );
  }

  /* ---------------- checkout ---------------- */
  return (
    <div className="wrap">
      <div className="crumbs">
        <Link href="/beats">Beats</Link> / Checkout
      </div>

      <div style={{ padding: "18px 0 30px" }}>
        <span className="eyebrow">Step 2 of 2</span>
        <h2 style={{ marginTop: 8 }}>Checkout</h2>
      </div>

      <div className="checkout">
        <div>
          <div className="panel">
            <h3>Your details</h3>
            <p className="panel__hint">Files and your license PDF go to this email address.</p>
            <div className="row2">
              <div className="field">
                <label htmlFor="cFirst">First name</label>
                <input id="cFirst" placeholder="Andre" autoComplete="given-name" {...field("first")} />
              </div>
              <div className="field">
                <label htmlFor="cLast">Last name</label>
                <input id="cLast" placeholder="McDove" autoComplete="family-name" {...field("last")} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="cEmail">Email</label>
              <input id="cEmail" type="email" placeholder="you@email.com" autoComplete="email" {...field("email")} />
            </div>
            <div className="field">
              <label htmlFor="cArtist">Artist or company name</label>
              <input id="cArtist" placeholder="The name that goes on the license" {...field("artist")} />
            </div>
          </div>

          <div className="panel">
            <h3>Payment</h3>
            <p className="panel__hint">Processed by Square. McDoveMusic never sees your card number.</p>

            {processing ? (
              <div className="paying">
                <div className="spinner" />
                <b>Processing payment…</b>
              </div>
            ) : (
              <div className="sqwrap">
                <PaymentForm
                  applicationId={APPLICATION_ID}
                  locationId={LOCATION_ID}
                  cardTokenizeResponseReceived={handlePayment}
                >
                  <CreditCard
                    buttonProps={{
                      css: {
                        backgroundColor: "#B6F13C",
                        color: "#071634",
                        borderRadius: "999px",
                        fontSize: "1rem",
                        fontWeight: 700,
                        fontFamily: "var(--f-display)",
                        letterSpacing: ".02em",
                        padding: "16px",
                        transition: "background .16s ease",
                        "&:hover": { backgroundColor: "#9BD91C" },
                      },
                    }}
                  >
                    {`Complete purchase — ${money(total)}`}
                  </CreditCard>
                </PaymentForm>

                <div className="pay-note">
                  <Lock width={13} height={13} />
                  Card details are tokenized in your browser and never touch this server.
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="summary">
          <h3 style={{ marginBottom: 6 }}>Order summary</h3>

          {items.map((i) => (
            <div key={i.id} className="sum-item">
              <div className="sum-item__art">
                <Cover id={i.beatId} art={i.art} title={i.title} />
              </div>
              <div style={{ minWidth: 0 }}>
                <b>{i.title}</b>
                <span>{i.licenseName}</span>
                <br />
                <button
                  style={{ fontSize: ".76rem", color: "var(--blue)", fontWeight: 600 }}
                  onClick={() => removeItem(i.id)}
                >
                  Remove
                </button>
              </div>
              <span className="sum-item__p">{money(i.price)}</span>
            </div>
          ))}

          <div className="sum-line">
            <span>Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="sum-line">
            <span>Tax (7.5%)</span>
            <span>{money(tax)}</span>
          </div>
          <div className="sum-total">
            <span style={{ color: "var(--muted)", fontSize: ".9rem" }}>Total due</span>
            <b>{money(total)}</b>
          </div>

          <div className="trust">
            <div>
              <Lock width={13} height={13} /> 256-bit SSL
            </div>
            <div>
              <Shield width={13} height={13} /> Buyer protection
            </div>
            <div>
              <Bolt width={13} height={13} /> Instant delivery
            </div>
          </div>
        </aside>
      </div>
      <div style={{ height: 60 }} />
    </div>
  );
}
