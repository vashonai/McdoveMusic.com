"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "@/components/Icons";

export default function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");

  return (
    <form
      className="searchbar"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(q.trim() ? `/beats?q=${encodeURIComponent(q.trim())}` : "/beats");
      }}
    >
      <Search width={19} height={19} />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search beats, genres, moods…"
        aria-label="Search beats"
      />
      <button className="btn btn--cta" type="submit">
        Search
      </button>
    </form>
  );
}
