import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My account — McDoveMusic",
  description: "Sign in to see your purchases, re-download files and manage your licenses.",
};

export default function AccountPage() {
  return (
    <div className="wrap" style={{ padding: "70px 0" }}>
      <span className="eyebrow">Signed out</span>
      <h2 style={{ margin: "10px 0 14px" }}>My account</h2>
      <p className="lede">
        Sign in to see your purchases, re-download files and manage your licenses. Accounts are not wired up yet — every
        purchase still emails the files and the license PDF straight away.
      </p>
      <div className="account-acts">
        <button className="btn btn--cta">Sign in</button>
        <button className="btn btn--ghost">Create account</button>
        <Link href="/beats" className="btn btn--ghost">
          Browse beats
        </Link>
      </div>
    </div>
  );
}
