export type Kind = "riddim" | "beat";

export interface Beat {
  id: number;
  slug: string;
  title: string;
  kind: Kind;
  genre: string;
  bpm: number;
  key: string;
  mood: string;
  price: number;
  length: number; // seconds
  plays: number;
  released: string;
  tags: string[];
  art: number; // which generative cover system
  note: string; // one line from the producer about the beat
  previewUrl: string; // tagged preview stream — swap for your own CDN
}

export interface License {
  id: string;
  name: string;
  desc: string;
  detail: string[];
  price: number;
}

/* ------------------------------------------------------------------
   One producer. One catalog. Everything on the site is his.
   ------------------------------------------------------------------ */
export const PRODUCER = {
  name: "McDove",
  handle: "@mcdovemusic",
  location: "Spanish Town, Jamaica",
  since: 2016,
  tagline: "Every riddim on this site was built by one pair of hands.",
  bio: [
    "McDove builds riddims and instrumentals out of a room in Spanish Town. Bass and guitar are played in, drums are a mix of programmed and tracked, and nothing is sampled from a record — so nothing you release from here needs clearing.",
    "The catalog runs from roots reggae and dancehall through afrobeats, trap and R&B. Riddims come as full versions with the melody stems separated, the way a singer would want them for a voicing session.",
  ],
  credits: ["Voiced by artists across JA, UK and Lagos", "Two riddims charted on regional radio", "Mixing and mastering handled in-house"],
  stats: [
    { label: "Beats and riddims", value: "142" },
    { label: "Years producing", value: "10" },
    { label: "Average delivery", value: "< 60s" },
  ],
  socials: [
    { name: "Instagram", href: "#" },
    { name: "YouTube", href: "#" },
    { name: "Spotify", href: "#" },
    { name: "Email", href: "#" },
  ],
};

export const GENRES = ["Reggae", "Dancehall", "Hip-Hop", "Trap", "R&B", "Afrobeats", "Drill", "Pop"];

const preview = (n: number) => `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${n}.mp3`;

export const BEATS: Beat[] = [
  { id: 1, slug: "kingston-haze", title: "Kingston Haze", kind: "riddim", genre: "Dancehall", bpm: 102, key: "F# Min", mood: "Dark", price: 34.99, length: 198, plays: 12400, released: "2026-07-28", tags: ["dancehall", "dark", "riddim", "night", "bass heavy"], art: 0, note: "Built around a detuned bass I recorded at 2am. Sits low — leave room in the mix.", previewUrl: preview(1) },
  { id: 2, slug: "salt-air", title: "Salt Air", kind: "riddim", genre: "Reggae", bpm: 76, key: "G Maj", mood: "Warm", price: 29.99, length: 212, plays: 8800, released: "2026-07-21", tags: ["roots", "organ", "skank", "sunny"], art: 1, note: "One-drop with a live organ bubble. Written for a singer, not a deejay.", previewUrl: preview(2) },
  { id: 3, slug: "nightbus", title: "Nightbus", kind: "beat", genre: "Drill", bpm: 142, key: "A Min", mood: "Menacing", price: 39.99, length: 176, plays: 21300, released: "2026-07-14", tags: ["drill", "sliding 808", "strings", "uk"], art: 2, note: "Strings played in, no sample. The 808 slides on the two and the four.", previewUrl: preview(3) },
  { id: 4, slug: "gold-teeth", title: "Gold Teeth", kind: "beat", genre: "Trap", bpm: 148, key: "C# Min", mood: "Hard", price: 29.99, length: 184, plays: 15900, released: "2026-07-09", tags: ["trap", "808", "hi-hats", "aggressive"], art: 3, note: "Hook space is wide open from bar 17. Made for a punch-in flow.", previewUrl: preview(4) },
  { id: 5, slug: "peppermint", title: "Peppermint", kind: "beat", genre: "R&B", bpm: 88, key: "D Maj", mood: "Smooth", price: 44.99, length: 225, plays: 9700, released: "2026-06-30", tags: ["rnb", "rhodes", "late night", "soft drums"], art: 1, note: "Rhodes first, drums last. Comes with a chord chart in the stems folder.", previewUrl: preview(5) },
  { id: 6, slug: "portmore-two-step", title: "Portmore Two Step", kind: "riddim", genre: "Afrobeats", bpm: 108, key: "B Min", mood: "Bright", price: 39.99, length: 203, plays: 18200, released: "2026-06-24", tags: ["afrobeats", "log drum", "shaker", "dance"], art: 0, note: "Percussion tracked live then cut to a grid. Raw shakers ship with the stems.", previewUrl: preview(6) },
  { id: 7, slug: "concrete-choir", title: "Concrete Choir", kind: "beat", genre: "Hip-Hop", bpm: 90, key: "E Min", mood: "Soulful", price: 34.99, length: 190, plays: 11100, released: "2026-06-18", tags: ["boom bap", "choir", "dusty", "90s"], art: 2, note: "The choir is me, layered eleven times through a tape machine.", previewUrl: preview(7) },
  { id: 8, slug: "riverbend", title: "Riverbend", kind: "beat", genre: "R&B", bpm: 72, key: "A Maj", mood: "Mellow", price: 29.99, length: 236, plays: 6400, released: "2026-06-11", tags: ["slow jam", "guitar", "warm", "ballad"], art: 3, note: "Nylon string guitar, one take, one mistake left in on purpose.", previewUrl: preview(8) },
  { id: 9, slug: "yard-style", title: "Yard Style", kind: "riddim", genre: "Dancehall", bpm: 96, key: "D Min", mood: "Bouncy", price: 34.99, length: 181, plays: 24800, released: "2026-06-02", tags: ["dancehall", "bouncy", "party", "riddim"], art: 2, note: "Most voiced riddim in the catalog. Four artists on it so far.", previewUrl: preview(9) },
  { id: 10, slug: "static-bloom", title: "Static Bloom", kind: "beat", genre: "Trap", bpm: 140, key: "G Min", mood: "Spacey", price: 24.99, length: 169, plays: 5200, released: "2026-05-27", tags: ["trap", "ambient", "pads", "moody"], art: 1, note: "Pads run through a broken reverb pedal. That hiss is meant to be there.", previewUrl: preview(10) },
  { id: 11, slug: "rudeboy-waltz", title: "Rudeboy Waltz", kind: "riddim", genre: "Reggae", bpm: 80, key: "C Maj", mood: "Uplifting", price: 29.99, length: 207, plays: 7300, released: "2026-05-19", tags: ["reggae", "horns", "uplifting", "live band"], art: 0, note: "Three-piece horn line, arranged and played by the same section every time.", previewUrl: preview(11) },
  { id: 12, slug: "blue-hour", title: "Blue Hour", kind: "beat", genre: "Pop", bpm: 116, key: "F Maj", mood: "Euphoric", price: 49.99, length: 194, plays: 16700, released: "2026-05-12", tags: ["pop", "synth", "anthemic", "radio"], art: 3, note: "Widest thing in the catalog. Built for a chorus that lands on the one.", previewUrl: preview(12) },
  { id: 13, slug: "cold-pattern", title: "Cold Pattern", kind: "beat", genre: "Drill", bpm: 145, key: "F Min", mood: "Menacing", price: 34.99, length: 172, plays: 13900, released: "2026-05-04", tags: ["drill", "icy", "bells", "tense"], art: 2, note: "Bells are a plucked guitar pitched up two octaves. Cheaper than a Rhodes.", previewUrl: preview(13) },
  { id: 14, slug: "sunday-bass", title: "Sunday Bass", kind: "riddim", genre: "Afrobeats", bpm: 104, key: "E Maj", mood: "Joyful", price: 39.99, length: 216, plays: 10400, released: "2026-04-26", tags: ["afrobeats", "guitar", "summer", "groove"], art: 1, note: "Guitar line came from a church rehearsal. Rewritten, but the feel stayed.", previewUrl: preview(14) },
  { id: 15, slug: "paper-planes", title: "Paper Planes", kind: "beat", genre: "Hip-Hop", bpm: 94, key: "B♭ Min", mood: "Soulful", price: 29.99, length: 188, plays: 4900, released: "2026-04-17", tags: ["hip hop", "sample-free", "flute", "laid back"], art: 0, note: "Flute is played, not pulled. Every note here is clearable.", previewUrl: preview(15) },
  { id: 16, slug: "lightskip", title: "Lightskip", kind: "beat", genre: "Pop", bpm: 112, key: "A Min", mood: "Bright", price: 44.99, length: 199, plays: 8100, released: "2026-04-08", tags: ["pop", "afro-pop", "crossover", "hooky"], art: 3, note: "Crossover tempo. Works for a singer or a toaster, both have tried it.", previewUrl: preview(16) },
];

export const MOODS = Array.from(new Set(BEATS.map((b) => b.mood)));
export const KEYS = Array.from(new Set(BEATS.map((b) => b.key))).sort();

export function getBeat(slug: string) {
  return BEATS.find((b) => b.slug === slug);
}

/* Licensing is identical on every beat — that consistency is the product. */
export function licensesFor(b: Beat): License[] {
  return [
    {
      id: "mp3",
      name: "MP3 lease",
      desc: "Tagless MP3, 320 kbps",
      detail: ["Tagless MP3, 320 kbps", "Up to 100,000 streams", "Music videos and live shows", "McDove keeps ownership"],
      price: b.price,
    },
    {
      id: "wav",
      name: "WAV lease",
      desc: "24-bit WAV master",
      detail: ["24-bit WAV master", "Unlimited streams", "Paid distribution on all platforms", "McDove keeps ownership"],
      price: round(b.price + 20),
    },
    {
      id: "trackout",
      name: "WAV + trackout",
      desc: "Full stems, mix ready",
      detail: ["24-bit WAV plus every stem", "Unlimited streams and sales", "Paid distribution on all platforms", "Chord chart included"],
      price: round(b.price + 90),
    },
    {
      id: "exclusive",
      name: "Exclusive rights",
      desc: "Comes off the store",
      detail: ["Beat is removed from the catalog", "Stems plus a signed contract", "No stream or sales cap", "Publishing split negotiable"],
      price: b.price < 35 ? 499 : 799,
    },
  ];
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}
