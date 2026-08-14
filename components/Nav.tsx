"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Cart, Close, Mark, Menu } from "@/components/Icons";
import { useCartStore } from "@/store/useCartStore";

const LINKS = [
  { href: "/beats", label: "Beats" },
  { href: "/producer", label: "The producer" },
  { href: "/licensing", label: "Licensing" },
  { href: "/account", label: "My account" },
];

export default function Nav() {
  const pathname = usePathname();
  const count = useCartStore((s) => s.items.length);
  const [open, setOpen] = useState(false);

  const isOn = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="nav">
      <div className="nav__in">
        <Link href="/" className="brand" aria-label="McDoveMusic home">
          <Mark />
          <span>
            <b>McDove</b>
            <i>Music</i>
          </span>
        </Link>

        <nav className="nav__links">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={isOn(l.href) ? "is-on" : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="nav__right">
          <Link href="/beats" className="btn btn--cta btn--sm">
            Browse beats
          </Link>
          <Link href="/checkout" className="cart-btn">
            <Cart width={17} height={17} />
            <span className="lbl">Cart</span>
            <span className="count">{count}</span>
          </Link>
          <button className="nav__burger" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label="Menu">
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Any tap in here navigates, so close the drawer on the way out. */}
      <div className={`nav__drawer${open ? " is-open" : ""}`} onClick={() => setOpen(false)}>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href}>
            {l.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
