"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BeatGrid from "@/components/BeatGrid";
import { BEATS, GENRES, KEYS, MOODS } from "@/lib/catalog";

const BPM_MAX = 160;
const PRICE_MAX = 50;

type Sort = "new" | "pop" | "lo" | "hi" | "bpm";
type Kind = "" | "riddim" | "beat";

interface Filters {
  q: string;
  kind: Kind;
  genres: string[];
  moods: string[];
  key: string;
  bpm: number;
  price: number;
  sort: Sort;
}

const EMPTY: Filters = { q: "", kind: "", genres: [], moods: [], key: "", bpm: BPM_MAX, price: PRICE_MAX, sort: "new" };

/** Deep links are part of the contract: /beats?genre=Dancehall, ?q=808, ?kind=riddim. */
function fromParams(params: URLSearchParams): Filters {
  const genre = params.get("genre");
  const mood = params.get("mood");
  const kind = params.get("kind");
  const sort = params.get("sort");
  return {
    ...EMPTY,
    q: params.get("q") ?? "",
    kind: kind === "riddim" || kind === "beat" ? kind : "",
    genres: genre ? [genre] : [],
    moods: mood ? [mood] : [],
    key: params.get("key") ?? "",
    bpm: Number(params.get("bpm")) || BPM_MAX,
    price: Number(params.get("price")) || PRICE_MAX,
    sort: (["new", "pop", "lo", "hi", "bpm"] as const).includes(sort as Sort) ? (sort as Sort) : "new",
  };
}

export default function Market() {
  const searchParams = useSearchParams();
  const key = searchParams.toString();

  const [f, setF] = useState<Filters>(() => fromParams(new URLSearchParams(key)));
  const [drawer, setDrawer] = useState(false);

  // Re-seed when the URL changes under us — a genre link tapped while already
  // on this page must still take effect. Adjusting during render rather than
  // in an effect keeps it to a single pass, with no filtered-then-refiltered
  // flash of the wrong results.
  const [seenKey, setSeenKey] = useState(key);
  if (seenKey !== key) {
    setSeenKey(key);
    setF(fromParams(new URLSearchParams(key)));
  }

  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setF((prev) => ({ ...prev, [k]: v }));
  const toggleIn = (k: "genres" | "moods", v: string) =>
    setF((prev) => ({ ...prev, [k]: prev[k].includes(v) ? prev[k].filter((x) => x !== v) : [...prev[k], v] }));

  const results = useMemo(() => {
    const out = BEATS.filter((b) => {
      if (f.kind && b.kind !== f.kind) return false;
      if (f.genres.length && !f.genres.includes(b.genre)) return false;
      if (f.moods.length && !f.moods.includes(b.mood)) return false;
      if (b.bpm > f.bpm) return false;
      if (f.key && b.key !== f.key) return false;
      if (b.price > f.price) return false;
      if (f.q) {
        const hay = `${b.title} ${b.genre} ${b.mood} ${b.key} ${b.kind} ${b.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(f.q.toLowerCase())) return false;
      }
      return true;
    });

    const sorters: Record<Sort, (a: (typeof BEATS)[number], b: (typeof BEATS)[number]) => number> = {
      new: (a, b) => +new Date(b.released) - +new Date(a.released),
      pop: (a, b) => b.plays - a.plays,
      lo: (a, b) => a.price - b.price,
      hi: (a, b) => b.price - a.price,
      bpm: (a, b) => a.bpm - b.bpm,
    };
    return out.sort(sorters[f.sort]);
  }, [f]);

  const clear = () => setF(EMPTY);

  return (
    <div className="wrap">
      <div className="crumbs">
        <Link href="/">Home</Link> / Beats
      </div>

      <div className="market__head">
        <span className="eyebrow">The catalog</span>
        <h2 style={{ marginTop: 8 }}>Every beat and riddim</h2>
      </div>

      <div className="market">
        <aside className={`filters${drawer ? " is-open" : ""}`}>
          <div className="filters__head">
            <b>Filters</b>
            <button onClick={clear}>Clear all</button>
          </div>

          <div className="fgroup">
            <label className="flabel" htmlFor="fSearch">
              Search
            </label>
            <input
              id="fSearch"
              className="textin"
              type="search"
              value={f.q}
              onChange={(e) => set("q", e.target.value)}
              placeholder="Title, tag, mood…"
            />
          </div>

          <div className="fgroup">
            <span className="flabel">Type</span>
            <div className="chips">
              {(
                [
                  ["", "Everything"],
                  ["riddim", "Riddims"],
                  ["beat", "Beats"],
                ] as const
              ).map(([v, label]) => (
                <button key={label} className={`chip${f.kind === v ? " is-on" : ""}`} onClick={() => set("kind", v)}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="fgroup">
            <span className="flabel">Genre</span>
            <div className="chips">
              {GENRES.map((g) => (
                <button key={g} className={`chip${f.genres.includes(g) ? " is-on" : ""}`} onClick={() => toggleIn("genres", g)}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="fgroup">
            <label className="flabel" htmlFor="fBpm">
              Tempo — max BPM
            </label>
            <input
              id="fBpm"
              className="range"
              type="range"
              min={60}
              max={BPM_MAX}
              value={f.bpm}
              onChange={(e) => set("bpm", Number(e.target.value))}
            />
            <div className="range-val">
              <span>60</span>
              <span>{f.bpm} BPM</span>
            </div>
          </div>

          <div className="fgroup">
            <label className="flabel" htmlFor="fKey">
              Key
            </label>
            <select id="fKey" className="select" value={f.key} onChange={(e) => set("key", e.target.value)}>
              <option value="">Any key</option>
              {KEYS.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </div>

          <div className="fgroup">
            <span className="flabel">Mood</span>
            <div className="chips">
              {MOODS.map((m) => (
                <button key={m} className={`chip${f.moods.includes(m) ? " is-on" : ""}`} onClick={() => toggleIn("moods", m)}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="fgroup">
            <label className="flabel" htmlFor="fPrice">
              Price — up to
            </label>
            <input
              id="fPrice"
              className="range"
              type="range"
              min={20}
              max={PRICE_MAX}
              value={f.price}
              onChange={(e) => set("price", Number(e.target.value))}
            />
            <div className="range-val">
              <span>$20</span>
              <span>${f.price}</span>
            </div>
          </div>
        </aside>

        <div>
          <div className="market__bar">
            <span className="market__count">
              <b>{results.length}</b> {results.length === 1 ? "result" : "results"}
            </span>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button className="btn btn--ghost btn--sm filter-toggle" onClick={() => setDrawer((v) => !v)}>
                Filters
              </button>
              <select
                className="select"
                style={{ width: "auto", height: 38 }}
                value={f.sort}
                onChange={(e) => set("sort", e.target.value as Sort)}
                aria-label="Sort results"
              >
                <option value="new">Newest first</option>
                <option value="pop">Most played</option>
                <option value="lo">Price: low to high</option>
                <option value="hi">Price: high to low</option>
                <option value="bpm">Tempo: slow to fast</option>
              </select>
            </div>
          </div>

          {results.length > 0 ? (
            <BeatGrid beats={results} />
          ) : (
            <div className="empty">
              <b>No beats match those filters</b>
              <p>Try widening the tempo range or clearing a genre.</p>
              <button className="btn btn--blue btn--sm" onClick={clear}>
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
      <div style={{ height: 84 }} />
    </div>
  );
}
