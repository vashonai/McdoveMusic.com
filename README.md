# McDoveMusic

Frontend for a beat and riddim marketplace. Everything in the catalog is produced by
one person — McDove — which is treated as a selling point rather than a gap: there is
no producer directory, and the producer page carries the trust that a multi-producer
marketplace normally spreads across profiles.

Next.js 15 (App Router), React 19, TypeScript, plain CSS. No UI library, no Tailwind.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build, every route prerendered
```

Copy `.env.example` to `.env.local` and fill in your Square sandbox IDs before
testing checkout — without them the card form falls back to demo IDs and will not
tokenize.

## Routes

| Route | What it is |
|---|---|
| `/` | Hero, latest beats, genres, producer band, licensing, CTA |
| `/beats` | Catalog with filters — type, genre, tempo, key, mood, price, sort |
| `/beats/[slug]` | Beat detail: waveform player, license picker, related beats |
| `/producer` | McDove's page — bio, socials, riddims, full catalog, custom work |
| `/licensing` | The four tiers in full, plus FAQ |
| `/checkout` | Details, Square card form, order summary, delivery confirmation |
| `/account` | Signed-out stub |

Deep links work: `/beats?genre=Dancehall`, `/beats?q=808`, `/beats?kind=riddim`,
and `sort`, `mood`, `key`, `bpm`, `price` on the same route.

## Design system

Tokens live at the top of `app/globals.css`.

- **Blue is the foundation** — white page backgrounds, `--blue-tint` sections,
  `--ink` headings, `--blue` for navigation and every interactive element.
- **Lime is a verb.** It appears on `Buy beat`, `Add to cart`, `Complete purchase`,
  the riddim badge, and the playhead. Nothing else. If you add a lime element that
  isn't an action, the system stops working.
- **Type has three jobs.** Archivo for display, Manrope for body, JetBrains Mono for
  anything that is a readout — BPM, key, prices, timecodes, counts. Mono on data is
  what makes the metadata read like a DAW display instead of body copy.

Everything below the `Additions` comment in `globals.css` was added for pages the
original token file did not cover (producer banner, licensing FAQ, the Square form,
the dock's volume control). It reuses the same variables and the same rules.

## Architecture notes

**`store/usePlayerStore.ts`** is the reason navigation never interrupts playback. The
transport (`components/Dock.tsx`) is mounted in the root layout, outside the route
tree, and holds the single `<audio>` element on the site. Start a beat on the home
page, filter the catalog, open a detail page — it keeps going. The dock, the card
play buttons, every waveform and the ambient hero waveform all read from that one
store.

Playback is **real**, not simulated: each beat carries a `previewUrl` and the store
tracks `time`/`duration` from the audio element's own events, so scrubbing a waveform
seeks the actual stream. The URLs currently point at SoundHelix demo tracks — replace
`previewUrl` in `lib/catalog.ts` with your own tagged previews.

**Cover art and waveforms are generated**, not stored. `lib/generative.ts` holds a
seeded PRNG so the server and the client produce identical output — no hydration
mismatch, no image assets, and a placeholder-free preview. Swap `Cover` for a real
`<Image>` when artwork exists; the component boundary is already in the right place.

**Cart state is in memory** (`store/useCartStore.ts`) and resets on reload. Items are
keyed `beatId:licenseId`, so the same beat can sit in the cart under two licenses.
Persist it to `localStorage` or a server session before this goes near production.

## Payments

Checkout uses the **Square Web Payments SDK** (`react-square-web-payments-sdk`). The
card form tokenizes in the browser and hands back a nonce.

**There is no server yet.** `handlePayment` in `components/Checkout.tsx` waits 1.5s
and resolves optimistically — the same placeholder the previous build shipped with.
To make it real, POST the token to a route handler and call Square's Payments API
with your access token there; nothing in the UI changes.

## Before this ships

- Charge the Square token server-side — right now nothing is billed
- Real audio, with tagged previews and untagged files released only after purchase
- A CMS or database behind `lib/catalog.ts`
- Persist the cart, and put accounts behind `/account`
- Exclusive rights probably wants its own enquiry flow rather than a radio button
  next to the leases; the price is negotiable and the contract is signed, not clicked
