import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

/* Stroked icons share one shell so weight stays consistent across the site. */
function Stroke({ children, width = 18, height = 18, strokeWidth = 2, ...rest }: P) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const Check = (p: P) => (
  <Stroke strokeWidth={3} {...p}>
    <path d="m5 13 4 4L19 7" />
  </Stroke>
);

export const Headphones = (p: P) => (
  <Stroke {...p}>
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </Stroke>
);

export const Lock = (p: P) => (
  <Stroke {...p}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Stroke>
);

export const Bolt = (p: P) => (
  <Stroke {...p}>
    <path d="M13 2 3 14h8l-1 8 10-12h-8z" />
  </Stroke>
);

export const Shield = (p: P) => (
  <Stroke {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Stroke>
);

export const Search = (p: P) => (
  <Stroke strokeWidth={2.2} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </Stroke>
);

export const Cart = (p: P) => (
  <Stroke {...p}>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
  </Stroke>
);

export const Menu = (p: P) => (
  <Stroke strokeWidth={2.2} {...p}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </Stroke>
);

export const Close = (p: P) => (
  <Stroke strokeWidth={2.2} {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Stroke>
);

export const Volume = (p: P) => (
  <Stroke {...p}>
    <path d="M11 5 6 9H2v6h4l5 4z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
  </Stroke>
);

export const Instagram = (p: P) => (
  <Stroke {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" />
  </Stroke>
);

export const YouTube = (p: P) => (
  <Stroke {...p}>
    <rect x="2" y="5" width="20" height="14" rx="4" />
    <path d="m10 9 5 3-5 3z" />
  </Stroke>
);

export const Spotify = (p: P) => (
  <Stroke {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M7.5 10c3-1 6.5-.6 9 1M8 13.3c2.4-.8 5-.5 7 .9M8.8 16.3c1.8-.6 3.8-.4 5.4.7" />
  </Stroke>
);

export const Mail = (p: P) => (
  <Stroke {...p}>
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="m3 7 9 6 9-6" />
  </Stroke>
);

/* Filled transport icons — these read better at small sizes than strokes. */
export const Play = ({ width = 17, height = 17, ...rest }: P) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...rest}>
    <path d="M7 4.5v15l13-7.5z" />
  </svg>
);

export const Pause = ({ width = 17, height = 17, ...rest }: P) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...rest}>
    <rect x="6.5" y="4.5" width="4" height="15" rx="1" />
    <rect x="13.5" y="4.5" width="4" height="15" rx="1" />
  </svg>
);

/** The brand mark: four bars, one of them lime. */
export const Mark = () => (
  <span className="mark" aria-hidden="true">
    <span />
    <span />
    <span />
    <span />
  </span>
);
