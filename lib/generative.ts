/* ------------------------------------------------------------------
   Seeded generative art and waveforms.

   Everything here is deterministic: the same beat always produces the
   same cover and the same bars, on the server and on the client. That
   is what keeps prerendering hydration-safe with no image assets.
   ------------------------------------------------------------------ */

export function rng(seed: number) {
  let s = (seed * 2654435761) >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/* Brand palette, four ways. Blue foundation, lime as the one accent. */
const ART_PAL = [
  ["#0B2350", "#1F4FE5", "#B6F13C"],
  ["#1F4FE5", "#0B2350", "#EFF4FF"],
  ["#071634", "#173BAF", "#B6F13C"],
  ["#173BAF", "#EFF4FF", "#0B2350"],
];

export type CoverShape =
  | { t: "rect"; x: number; y: number; w: number; h: number; fill: string; o?: number; rotate?: string }
  | { t: "circle"; cx: number; cy: number; r: number; fill?: string; stroke?: string; sw?: number; o?: number };

export const COVER_SIZE = 300;

/** Four geometric systems, picked by `beat.art`. */
export function coverShapes(id: number, art: number): CoverShape[] {
  const r = rng(id * 97 + 13);
  const P = ART_PAL[art % 4];
  const s = COVER_SIZE;
  const out: CoverShape[] = [];

  if (art % 4 === 0) {
    // concentric arcs
    out.push({ t: "rect", x: 0, y: 0, w: s, h: s, fill: P[0] });
    for (let i = 6; i > 0; i--) {
      out.push({
        t: "circle",
        cx: 70 + r() * 40,
        cy: 230 - r() * 30,
        r: i * 36,
        stroke: i % 3 === 0 ? P[2] : P[1],
        sw: i % 3 === 0 ? 4 : 14,
        o: 0.25 + i * 0.11,
      });
    }
  } else if (art % 4 === 1) {
    // stacked horizon bands
    out.push({ t: "rect", x: 0, y: 0, w: s, h: s, fill: P[1] });
    let y = 0;
    for (let i = 0; i < 7; i++) {
      const h = 18 + r() * 44;
      out.push({ t: "rect", x: 0, y, w: s, h, fill: i === 4 ? P[2] : P[0], o: i === 4 ? 0.95 : 0.18 + i * 0.12 });
      y += h + 6;
    }
    out.push({ t: "circle", cx: 228, cy: 72, r: 30, fill: P[2], o: 0.9 });
  } else if (art % 4 === 2) {
    // diagonal cut
    out.push({ t: "rect", x: 0, y: 0, w: s, h: s, fill: P[0] });
    for (let i = 0; i < 9; i++) {
      out.push({
        t: "rect",
        x: -60 + i * 44,
        y: -40,
        w: 10 + r() * 22,
        h: 400,
        fill: P[1],
        o: 0.2 + r() * 0.6,
        rotate: "rotate(18 150 150)",
      });
    }
    out.push({ t: "rect", x: 0, y: 228, w: s, h: 9, fill: P[2] });
  } else {
    // dot matrix
    out.push({ t: "rect", x: 0, y: 0, w: s, h: s, fill: P[0] });
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const v = r();
        if (v < 0.2) continue;
        out.push({
          t: "circle",
          cx: 26 + x * 35,
          cy: 26 + y * 35,
          r: 5 + v * 11,
          fill: x === 5 && y === 2 ? P[2] : P[1],
          o: 0.25 + v * 0.7,
        });
      }
    }
  }
  return out;
}

/**
 * Bar heights for a waveform, 0–1.
 * The envelope fades the ends; every 4th and 8th bar is nudged up so the
 * grid stays visible — that is what makes it read as music, not noise.
 */
export function waveHeights(seed: number, n: number): number[] {
  const r = rng(seed * 31 + 7);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const env = 0.38 + 0.62 * Math.pow(Math.sin(Math.PI * t), 0.45);
    const accent = i % 8 === 0 ? 1.18 : i % 4 === 0 ? 1.06 : 1;
    out.push(Math.max(0.14, Math.min(1, (0.34 + r() * 0.66) * env * accent)));
  }
  return out;
}
