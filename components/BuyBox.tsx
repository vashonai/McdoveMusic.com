"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Lock } from "@/components/Icons";
import { licensesFor, type Beat } from "@/lib/catalog";
import { money } from "@/lib/format";
import { cartItemId, useCartStore } from "@/store/useCartStore";

export default function BuyBox({ beat }: { beat: Beat }) {
  const router = useRouter();
  const licenses = licensesFor(beat);
  // WAV is the tier most people actually want, so it starts selected.
  const [picked, setPicked] = useState("wav");
  const [flash, setFlash] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addItem = useCartStore((s) => s.addItem);
  const inCart = useCartStore((s) => s.items.some((i) => i.id === cartItemId(beat.id, picked)));

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const selected = licenses.find((l) => l.id === picked) ?? licenses[0];

  const add = () => {
    addItem({
      id: cartItemId(beat.id, selected.id),
      beatId: beat.id,
      slug: beat.slug,
      title: beat.title,
      art: beat.art,
      licenseId: selected.id,
      licenseName: selected.name,
      price: selected.price,
    });
    setFlash(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setFlash(false), 1400);
  };

  return (
    <aside className="buybox">
      <span className="eyebrow">Choose a license</span>

      <div style={{ marginTop: 14 }}>
        {licenses.map((l) => (
          <button key={l.id} className={`lic-opt${l.id === picked ? " is-on" : ""}`} onClick={() => setPicked(l.id)}>
            <span className="radio" />
            <span className="lic-opt__t">
              <b>{l.name}</b>
              <span>{l.desc}</span>
            </span>
            <span className="lic-opt__p">{money(l.price)}</span>
          </button>
        ))}
      </div>

      <div className="buybox__total">
        <span style={{ color: "var(--muted)", fontSize: ".9rem" }}>Total</span>
        <b>{money(selected.price)}</b>
      </div>

      <button className="btn btn--cta btn--block btn--lg" onClick={add}>
        {flash ? "Added to cart ✓" : inCart ? "In cart — add again?" : "Add to cart"}
      </button>
      <button
        className="btn btn--ghost btn--block"
        style={{ marginTop: 10 }}
        onClick={() => {
          add();
          router.push("/checkout");
        }}
      >
        Buy now
      </button>

      <div className="secure">
        <Lock width={14} height={14} />
        Encrypted checkout · instant download
      </div>
    </aside>
  );
}
