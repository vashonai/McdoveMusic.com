import { COVER_SIZE, coverShapes } from "@/lib/generative";

/**
 * Generated cover art. No image files, no placeholders, identical on server
 * and client. When real artwork exists, swap the body for next/image — the
 * component boundary is already in the right place.
 */
export default function Cover({ id, art, title }: { id: number; art: number; title: string }) {
  const shapes = coverShapes(id, art);
  const s = COVER_SIZE;

  return (
    <svg viewBox={`0 0 ${s} ${s}`} role="img" aria-label={`Cover art for ${title}`}>
      {shapes.map((sh, i) =>
        sh.t === "rect" ? (
          <rect key={i} x={sh.x} y={sh.y} width={sh.w} height={sh.h} fill={sh.fill} opacity={sh.o} transform={sh.rotate} />
        ) : (
          <circle
            key={i}
            cx={sh.cx}
            cy={sh.cy}
            r={sh.r}
            fill={sh.fill ?? "none"}
            stroke={sh.stroke}
            strokeWidth={sh.sw}
            opacity={sh.o}
          />
        ),
      )}
    </svg>
  );
}
