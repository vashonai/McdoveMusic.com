import { Suspense } from "react";
import type { Metadata } from "next";
import Market from "@/components/Market";

export const metadata: Metadata = {
  title: "Beats and riddims — McDoveMusic",
  description: "Filter the full catalog by type, genre, tempo, key, mood and price.",
};

export default function BeatsPage() {
  return (
    <Suspense
      fallback={
        <div className="wrap">
          <div className="market__head">
            <span className="eyebrow">The catalog</span>
            <h2 style={{ marginTop: 8 }}>Every beat and riddim</h2>
          </div>
        </div>
      }
    >
      <Market />
    </Suspense>
  );
}
