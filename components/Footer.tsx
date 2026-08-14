import Link from "next/link";
import { Mark } from "@/components/Icons";
import { PRODUCER } from "@/lib/catalog";

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot__grid">
          <div>
            <div className="brand" style={{ marginBottom: 14 }}>
              <Mark />
              <span>
                <b>McDove</b>
                <i>Music</i>
              </span>
            </div>
            <p style={{ fontSize: ".9rem", maxWidth: "34ch" }}>
              Riddims and instrumentals, all built by one producer. {PRODUCER.location}.
            </p>
          </div>

          <div>
            <h4>Shop</h4>
            <ul>
              <li>
                <Link href="/beats">All beats</Link>
              </li>
              <li>
                <Link href="/beats?kind=riddim">Riddims</Link>
              </li>
              <li>
                <Link href="/beats?sort=pop">Most played</Link>
              </li>
              <li>
                <Link href="/beats?sort=new">New releases</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Learn</h4>
            <ul>
              <li>
                <Link href="/licensing">Licensing guide</Link>
              </li>
              <li>
                <Link href="/producer">About McDove</Link>
              </li>
              <li>
                <Link href="/producer#contact">Custom work</Link>
              </li>
              <li>
                <Link href="/account">My downloads</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Legal</h4>
            <ul>
              <li>
                <Link href="/licensing#faq">Terms</Link>
              </li>
              <li>
                <Link href="/licensing#faq">Privacy</Link>
              </li>
              <li>
                <Link href="/licensing#faq">Refunds</Link>
              </li>
              <li>
                <Link href="/licensing#faq">Copyright</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="foot__bar">
          <span>© {new Date().getFullYear()} McDoveMusic. All rights reserved.</span>
          <span>Payments secured by Square</span>
        </div>
      </div>
    </footer>
  );
}
