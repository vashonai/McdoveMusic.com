# McDoveMusic — Backend Implementation Plan

Turning the frontend into a working store. Ten phases, each one shippable on its own.

**Stack:** Next.js 15 (already built) · Supabase (Postgres + Auth) · Cloudflare R2 (audio) · Square Web Payments (payments) · Resend (email) · Vercel (hosting)

> **Payments note.** This plan was originally written against Stripe hosted Checkout and has been
> reworked for Square, because the frontend already ships a working Square card form
> (`react-square-web-payments-sdk` in `components/Checkout.tsx`). That is not a cosmetic swap: with
> Stripe's hosted Checkout the browser leaves your site and the webhook is the only thing that ever
> learns the payment succeeded. With Square's Web Payments SDK, **your own server creates the
> payment and gets the result synchronously.** Phases 5 and 6 are rewritten around that. Everything
> outside payments — schema, R2, auth, downloads, PDFs — is unchanged.

---

## How to work through this with Claude Code

Do **one phase per session**. Each phase ends in a working state you can commit.

Start each session with roughly this:

> I'm building McDoveMusic, a single-producer beat store. Next.js 15 App Router,
> TypeScript, Supabase, Cloudflare R2, Square. Read `IMPLEMENTATION.md` and do
> **Phase 3** only. Don't touch phases 4+. Show me the files you plan to change
> before you write them.

Three rules that will save you a lot of pain:

1. **Never let it skip ahead.** If it starts wiring Square while you're on the schema, stop it. Phases have dependencies in one direction only.
2. **Make it write the test at the same time as the code** for Phases 5–7. Payment bugs are silent and expensive.
3. **Commit at the end of every phase.** `git commit -m "phase 3: catalog from db"`. If a phase goes wrong you want a clean point to reset to.

---

## Architecture at a glance

```
                    ┌─────────────────────────────┐
   Browser ────────▶│  Next.js on Vercel          │
   (Square SDK      │                             │
    tokenizes the   │  /  /beats  /beats/[slug]   │  ← reads catalog
    card in an      │  /api/checkout              │  ← charges the card token
    iframe)         │  /api/webhooks/square       │  ← reconciles + refunds
                    │  /api/download/[itemId]     │  ← issues signed URLs
                    └──┬──────────┬───────────┬───┘
                       │          │           │
        ┌──────────────▼──┐  ┌────▼─────┐  ┌──▼──────────────┐
        │ Supabase        │  │ Square   │  │ Cloudflare R2   │
        │ Postgres + Auth │  │ Payments │  │ previews (pub)  │
        │ catalog, orders │  │ webhooks │  │ masters (priv)  │
        └─────────────────┘  └──────────┘  └─────────────────┘
```

**The one rule that governs everything:** exactly one place marks an order paid — the server route
that called `payments.create` and got `COMPLETED` back. Never the browser, which can lie, close, or
lose its connection between tokenizing and hearing the answer. The webhook is a *reconciler*, not
the source of truth: it catches payments your route started but never saw finish. Both paths write
the same "mark paid" function, and that function must be idempotent, because both can run for the
same payment.

Card data itself never touches your server — the Web Payments SDK renders Square-hosted iframes and
hands you back a single-use token. That keeps you in the same low PCI bracket hosted checkout would.

---

## Phase 0 — Accounts and environment

Before any code.

| Service | What to create | Free tier note |
|---|---|---|
| Supabase | Project, save the DB password | 500 MB DB, pauses after 7 days idle — Phase 9 fixes that |
| Cloudflare | R2 enabled, two buckets, one API token | 10 GB, zero egress, never pauses |
| Square | Developer account → application → **Sandbox** credentials | No monthly fee, ~2.9% + 30¢ per online sale — confirm current rates |
| Resend | Account, verify your sending domain | 3,000 emails/month |

Square specifics, from **developer.squareup.com/apps** → your application:

- *Sandbox* tab gives you an application ID, a location ID and an access token. Use these until Phase 10.
- The sandbox comes with a fake seller dashboard where test payments appear — that is how you confirm a charge landed.
- Taking real money later needs the Square **account itself activated** (business details, bank account). Start that early; it is not instant.

Buckets: `mcdove-previews` (public, custom domain like `cdn.mcdovemusic.com`) and `mcdove-masters` (private, no public access — verify this twice).

`.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...        # server only — never import in a client component

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_MASTERS=mcdove-masters
R2_BUCKET_PREVIEWS=mcdove-previews
NEXT_PUBLIC_PREVIEW_BASE_URL=https://cdn.mcdovemusic.com

# Square — server side
SQUARE_ACCESS_TOKEN=EAAA...             # server only, never NEXT_PUBLIC_
SQUARE_ENVIRONMENT=sandbox              # sandbox | production
SQUARE_LOCATION_ID=L...                 # the location the charge is booked to
SQUARE_WEBHOOK_SIGNATURE_KEY=...        # from the webhook subscription, Phase 6

# Square — browser side (already read by components/Checkout.tsx)
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sandbox-sq0idb-...
NEXT_PUBLIC_SQUARE_LOCATION_ID=L...     # must match SQUARE_LOCATION_ID

# Email
RESEND_API_KEY=re_...
EMAIL_FROM="McDoveMusic <orders@mcdovemusic.com>"

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

The two location IDs must be the same value. A token minted for one location and charged against
another is rejected, and the error does not say so clearly.

```bash
npm install @supabase/supabase-js @supabase/ssr @aws-sdk/client-s3 @aws-sdk/s3-request-presigner square resend pdf-lib
```

`react-square-web-payments-sdk` is already installed — that is the browser half. `square` is the
server half.

Add `.env.local` to `.gitignore` and confirm it's ignored (`.env*.local` is already covered).
`SUPABASE_SERVICE_ROLE_KEY` and `SQUARE_ACCESS_TOKEN` both bypass every security rule you're about
to write — treat them like root passwords.

**Done when:** all four dashboards open, `.env.local` is filled and ignored by git, and
`.env.example` is updated to match (without values).

---

## Phase 1 — Database schema

Run in the Supabase SQL editor.

```sql
-- ============================================================
-- BEATS
-- ============================================================
create type beat_status as enum ('draft', 'live', 'exclusive_sold', 'archived');
create type beat_kind   as enum ('riddim', 'beat');

create table beats (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  kind          beat_kind not null default 'beat',
  genre         text not null,
  bpm           int  not null check (bpm between 40 and 300),
  key           text not null,
  mood          text not null,
  length_sec    int  not null,
  tags          text[] not null default '{}',
  note          text,                          -- the producer line on the detail page
  art_seed      int  not null default 0,       -- keeps generative covers stable
  waveform      real[],                        -- precomputed peaks, see Phase 2
  status        beat_status not null default 'draft',
  plays         int not null default 0,
  released_at   timestamptz not null default now(),
  created_at    timestamptz not null default now()
);
create index on beats (status, released_at desc);
create index on beats (genre) where status = 'live';

-- ============================================================
-- ASSETS — one row per file in R2
-- ============================================================
create type asset_kind as enum ('preview', 'wav', 'stems', 'artwork');

create table beat_assets (
  id         uuid primary key default gen_random_uuid(),
  beat_id    uuid not null references beats(id) on delete cascade,
  kind       asset_kind not null,
  r2_key     text not null,
  bytes      bigint,
  created_at timestamptz not null default now(),
  unique (beat_id, kind)
);

-- ============================================================
-- PRICING — per beat, so you can disable exclusive on the riddims
-- ============================================================
create type license_tier as enum ('mp3', 'wav', 'trackout', 'exclusive');

create table beat_licenses (
  beat_id     uuid not null references beats(id) on delete cascade,
  tier        license_tier not null,
  price_cents int not null check (price_cents > 0),
  is_active   boolean not null default true,
  primary key (beat_id, tier)
);

-- ============================================================
-- ORDERS
-- ============================================================
create type order_status as enum ('pending', 'paid', 'fulfilled', 'failed', 'refunded');

create table orders (
  id                uuid primary key default gen_random_uuid(),
  order_number      text unique not null default 'MD-' || upper(substr(gen_random_uuid()::text, 1, 8)),
  user_id           uuid references auth.users(id) on delete set null,
  email             text not null,
  customer_name     text,
  artist_name       text,                      -- the name that goes on the license
  square_payment_id text unique,               -- set once the charge completes
  square_order_id   text,                      -- optional, only if you use the Orders API
  square_refund_id  text,
  subtotal_cents    int not null default 0,
  tax_cents         int not null default 0,
  total_cents       int not null default 0,
  status            order_status not null default 'pending',
  failure_reason    text,                      -- Square's decline code, for support
  created_at        timestamptz not null default now(),
  paid_at           timestamptz
);
create index on orders (email, created_at desc);
create index on orders (status) where status = 'pending';

create table order_items (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null references orders(id) on delete cascade,
  beat_id        uuid not null references beats(id),
  tier           license_tier not null,
  price_cents    int not null,
  license_number text unique,                  -- goes on the PDF
  license_pdf_key text,                        -- R2 key once generated
  created_at     timestamptz not null default now()
);
create index on order_items (order_id);

-- ============================================================
-- DOWNLOAD AUDIT — catch link sharing
-- ============================================================
create table downloads (
  id            uuid primary key default gen_random_uuid(),
  order_item_id uuid not null references order_items(id) on delete cascade,
  asset_kind    asset_kind not null,
  ip            inet,
  user_agent    text,
  created_at    timestamptz not null default now()
);
create index on downloads (order_item_id, created_at desc);

-- ============================================================
-- ROW LEVEL SECURITY
-- Public reads the live catalog. Everything else goes through
-- server routes using the service role key.
-- ============================================================
alter table beats          enable row level security;
alter table beat_assets    enable row level security;
alter table beat_licenses  enable row level security;
alter table orders         enable row level security;
alter table order_items    enable row level security;
alter table downloads      enable row level security;

create policy "public reads live beats" on beats
  for select using (status = 'live');

create policy "public reads preview assets" on beat_assets
  for select using (
    kind in ('preview', 'artwork')
    and exists (select 1 from beats b where b.id = beat_id and b.status = 'live')
  );

create policy "public reads active prices" on beat_licenses
  for select using (
    is_active
    and exists (select 1 from beats b where b.id = beat_id and b.status = 'live')
  );

create policy "users read own orders" on orders
  for select using (auth.uid() = user_id);

create policy "users read own order items" on order_items
  for select using (
    exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- orders/order_items have no insert or update policy on purpose.
-- Only the service role writes them, and only from server routes.
```

Note what the RLS gives you: **no policy exists that exposes `wav` or `stems` asset rows to the public.** Even a fully compromised anon key can't learn the R2 key of a master file.

**Done when:** tables exist, and querying `beat_assets` from the browser with the anon key returns preview rows only.

---

## Phase 2 — R2 and the upload pipeline

### The client

`lib/r2.ts`:

```ts
import { S3Client } from "@aws-sdk/client-s3";

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const MASTERS = process.env.R2_BUCKET_MASTERS!;
export const PREVIEWS = process.env.R2_BUCKET_PREVIEWS!;
```

### Key layout

```
mcdove-previews/
  preview/kingston-haze.mp3          ← tagged, 128 kbps, public

mcdove-masters/
  wav/kingston-haze.wav              ← 24-bit master
  stems/kingston-haze.zip            ← trackout
  license/MD-A1B2C3D4-001.pdf        ← generated per sale
```

### The ingest script

Write `scripts/ingest.ts` — a local Node script, not an API route. For each beat it should:

1. Take a source WAV and a stems folder
2. Run ffmpeg to produce the tagged preview
3. Extract waveform peaks and BPM/duration
4. Upload preview → previews bucket, WAV + stems zip → masters bucket
5. Insert the `beats`, `beat_assets` and `beat_licenses` rows

The ffmpeg calls:

```bash
# Tagged preview — voice tag mixed in every ~20s, then downsample
ffmpeg -i master.wav -i tag.wav \
  -filter_complex "[1:a]adelay=20000|20000,aloop=loop=8:size=0:start=0[tag];[0:a][tag]amix=inputs=2:duration=first:weights=1 0.6" \
  -b:a 128k -ar 44100 preview.mp3

# 120 waveform peaks for the player
ffmpeg -i master.wav -ac 1 -filter:a aresample=8000 -map 0:a -c:a pcm_s16le -f data - \
  | node scripts/peaks.js > peaks.json
```

**Tag the previews.** An untagged preview MP3 sitting on a public CDN is your product, free. The tag is what makes the paid file worth paying for.

The catalog currently points `previewUrl` at SoundHelix demo tracks. This phase is what replaces
them — once ingest works, `previewUrl` comes from `NEXT_PUBLIC_PREVIEW_BASE_URL` + the preview
asset's R2 key.

**Done when:** one beat is fully ingested, the preview plays from `NEXT_PUBLIC_PREVIEW_BASE_URL`, and pasting a masters-bucket URL into a browser gives you access-denied.

---

## Phase 3 — Catalog from the database

Replace `lib/catalog.ts`. Keep the exported types **identical** so no component has to change — this phase should touch data-fetching only.

```ts
// lib/queries.ts
import { createClient } from "@supabase/supabase-js";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getLiveBeats() {
  const { data, error } = await db
    .from("beats")
    .select("*, beat_licenses(tier, price_cents, is_active), beat_assets(kind, r2_key)")
    .eq("status", "live")
    .order("released_at", { ascending: false });
  if (error) throw error;
  return data.map(toBeat);
}
```

Two things to change in the components:

- `components/Cover.tsx` — swap the generative SVG for real artwork once you have it, keeping the generative version as the fallback when `artwork` is missing
- `components/Wave.tsx` — read `beat.waveform` from the DB instead of `waveHeights()` in `lib/generative.ts`; keep the seeded version as fallback

`generateStaticParams` in `app/beats/[slug]/page.tsx` now needs to hit the DB. Add
`export const revalidate = 3600` to the beat pages so new uploads appear within the hour without a
redeploy.

One thing that does *not* change: `licensesFor()` currently derives prices arithmetically from
`beat.price`. Once `beat_licenses` exists, prices come from rows, and that function goes away. The
server must never re-derive a price it could look up.

**Done when:** the site renders entirely from Supabase and the ingest script's beat shows up on the homepage.

---

## Phase 4 — Auth

Supabase Auth with `@supabase/ssr`. Email magic link is enough — no passwords to store or reset.

- `middleware.ts` to refresh the session cookie
- `lib/supabase/server.ts` and `lib/supabase/client.ts`
- `/account` becomes real: order history, re-download links
- Checkout stays **guest-friendly** — do not force signup before purchase, it kills conversion. Create the account silently at fulfilment and email a magic link.

**Done when:** you can sign in, and `/account` shows an empty order list rather than the stub.

---

## Phase 5 — Charging the card with Square

The frontend already renders Square's card form. What is missing is the server: today
`handlePayment` in `components/Checkout.tsx` waits 1.5 seconds and pretends. This phase makes it real.

**Why not a hosted redirect?** Square does offer hosted Payment Links, which would mirror the
original Stripe-Checkout design. Don't use them here — you already have a working in-page card form
with the checkout UI built around it, and the Web Payments SDK keeps card entry inside
Square-hosted iframes anyway, so the PCI position is effectively the same. The trade you accept is
that **3DS/SCA is now your job** (see below), where hosted checkout would have handled it.

### The browser half

`cardTokenizeResponseReceived` already fires with the results — it just ignores them. Take both arguments:

```tsx
// components/Checkout.tsx
<PaymentForm
  applicationId={APPLICATION_ID}
  locationId={LOCATION_ID}
  cardTokenizeResponseReceived={async (token, verifiedBuyer) => {
    setProcessing(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        sourceId: token.token,                    // single-use card nonce
        verificationToken: verifiedBuyer?.token,  // 3DS result, when required
        email: details.email,
        customerName: `${details.first} ${details.last}`.trim(),
        artistName: details.artist,
        // beat + tier only. No prices — the server looks those up.
        items: items.map((i) => ({ beatId: i.beatId, tier: i.licenseId })),
      }),
    });
    const result = await res.json();
    setProcessing(false);
    if (!res.ok) return setError(result.message ?? "Payment failed. Please try again.");
    setPaid(result.items);
    clearCart();
  }}
  createVerificationDetails={() => ({
    amount: (total).toFixed(2),
    currencyCode: "USD",
    intent: "CHARGE",
    billingContact: { givenName: details.first, familyName: details.last, email: details.email },
  })}
>
```

`createVerificationDetails` is what triggers `verifyBuyer()` and produces the 3DS challenge for
cards that demand one. Skip it and European cards will decline in production while working fine in
sandbox.

### The server half

`app/api/checkout/route.ts`:

```ts
import { NextResponse } from "next/server";
import { SquareClient, SquareEnvironment } from "square";
import { createServiceClient } from "@/lib/supabase/service";

const square = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN!,
  environment:
    process.env.SQUARE_ENVIRONMENT === "production"
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox,
});

export async function POST(req: Request) {
  const { sourceId, verificationToken, items, email, customerName, artistName } = await req.json();
  const db = createServiceClient();

  // ⚠️ Prices come from the DB. NEVER trust a price sent by the browser.
  const { data: prices } = await db
    .from("beat_licenses")
    .select("beat_id, tier, price_cents, beats(slug, title, status)")
    .in("beat_id", items.map((i: any) => i.beatId))
    .eq("is_active", true);

  const lines = items.map((item: any) => {
    const row = prices!.find((p) => p.beat_id === item.beatId && p.tier === item.tier);
    if (!row) throw new Error("Unknown license");
    if ((row.beats as any).status !== "live") throw new Error("No longer available");
    return { beat_id: row.beat_id, tier: row.tier, price_cents: row.price_cents };
  });

  const subtotal = lines.reduce((a, l) => a + l.price_cents, 0);
  const tax = Math.round(subtotal * 0.075);
  const total = subtotal + tax;

  // 1. Order row first, so a payment can never exist without something to attach it to.
  const { data: order } = await db
    .from("orders")
    .insert({
      email, customer_name: customerName, artist_name: artistName,
      subtotal_cents: subtotal, tax_cents: tax, total_cents: total,
      status: "pending",
    })
    .select()
    .single();

  // 2. Charge. The idempotency key is the order id, so a retried request
  //    returns the original payment instead of charging twice.
  try {
    const { payment } = await square.payments.create({
      sourceId,
      verificationToken,
      idempotencyKey: order!.id,
      amountMoney: { amount: BigInt(total), currency: "USD" },
      locationId: process.env.SQUARE_LOCATION_ID!,
      buyerEmailAddress: email,
      referenceId: order!.order_number,
      note: `McDoveMusic ${order!.order_number}`,
    });

    if (payment?.status !== "COMPLETED") {
      await db.from("orders")
        .update({ status: "failed", failure_reason: payment?.status ?? "unknown" })
        .eq("id", order!.id);
      return NextResponse.json({ message: "Payment was not completed." }, { status: 402 });
    }

    // 3. One function marks orders paid and fulfils them. The webhook calls
    //    the same one. It must be safe to run twice — see Phase 6.
    const fulfilled = await fulfilOrder(order!.id, payment.id!, lines);
    return NextResponse.json({ items: fulfilled });
  } catch (err: any) {
    const detail = err?.errors?.[0];
    await db.from("orders")
      .update({ status: "failed", failure_reason: detail?.code ?? "exception" })
      .eq("id", order!.id);
    // Square's decline codes are safe to show; anything else is not.
    return NextResponse.json(
      { message: detail?.detail ?? "Payment failed. Please try again." },
      { status: 402 },
    );
  }
}
```

The price lookup is the single most important security line in this document. If the browser can
send a price, someone will send `1`.

The idempotency key is the second most important. Square dedupes on it for 24 hours, which is what
stops a double-clicked button or a retried fetch from charging twice.

**SDK version note.** The code above is the modern `square` SDK (v43+): `SquareClient`,
`square.payments.create()`, `bigint` amounts. Older versions use
`new Client({...})` and `client.paymentsApi.createPayment({...})` with plain numbers. Check
`npm ls square` before copying.

**Sandbox test cards:** `4111 1111 1111 1111`, CVV `111`, any future expiry, postcode `94103`.
Square publishes separate numbers that force declines and 3DS challenges — test at least one
decline, since that path is the one you'll otherwise ship untested.

**Done when:** a sandbox purchase charges the test card, the payment appears in the Square sandbox
seller dashboard, the order row reaches `paid`, and a forced decline shows an error in the UI
instead of a success screen.

---

## Phase 6 — The webhook

`app/api/webhooks/square/route.ts`. With Square this is a **safety net, not the main path** —
Phase 5 already knows whether the charge worked. The webhook exists for the cases your route never
saw: the client vanished mid-request, your function timed out after Square took the money, a
payment settled asynchronously, or someone refunded from the Square dashboard.

Subscribe to `payment.created`, `payment.updated`, `refund.created` and `refund.updated` in the
Developer Dashboard. That gives you the signature key for `.env.local`.

```ts
import { WebhooksHelper } from "square";
import { fulfilOrder, markRefunded } from "@/lib/orders";

const NOTIFICATION_URL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/square`;

export async function POST(req: Request) {
  const body = await req.text();  // raw body — required for the signature check
  const signature = req.headers.get("x-square-hmacsha256-signature") ?? "";

  const valid = await WebhooksHelper.verifySignature({
    requestBody: body,
    signatureHeader: signature,
    signatureKey: process.env.SQUARE_WEBHOOK_SIGNATURE_KEY!,
    notificationUrl: NOTIFICATION_URL,
  });
  if (!valid) return new Response("Bad signature", { status: 400 });

  const event = JSON.parse(body);

  if (event.type === "payment.created" || event.type === "payment.updated") {
    const payment = event.data.object.payment;
    if (payment.status === "COMPLETED") {
      // Find the order by reference_id or by square_payment_id, then run the
      // same fulfilment Phase 5 runs. Returns early if already paid.
      await fulfilOrder(null, payment.id, null, { referenceId: payment.reference_id });
    }
  }

  if (event.type.startsWith("refund.")) {
    await markRefunded(event.data.object.refund);
  }

  return new Response(null, { status: 200 });
}
```

**The signature gotcha.** Square's HMAC is computed over *the notification URL concatenated with the
raw body*. The URL string must match the subscription exactly — scheme, host, path, no trailing
slash drift. A mismatch here fails every event and looks identical to a wrong key. When it breaks
in production, print the URL you're passing before you touch anything else.

`fulfilOrder()` must be **idempotent.** Square retries on any non-2xx, duplicate deliveries happen
in normal operation, and here it can also race Phase 5's direct call. Guard on
`orders.status in ('paid','fulfilled')` and return early.

Fulfilment, in order:

1. Mark the order `paid`, record `square_payment_id` and `paid_at`
2. Create `order_items` with license numbers
3. Generate a license PDF per item, upload to R2, store the key
4. **If any item is `exclusive`:** set that beat's `status = 'exclusive_sold'` in the same transaction, and deactivate its other tiers
5. Create the user account if this email is new, generate a magic link
6. Send the delivery email
7. Mark the order `fulfilled`

**Local testing.** There is no `stripe listen` equivalent — Square needs a publicly reachable URL:

```bash
cloudflared tunnel --url http://localhost:3000    # or: ngrok http 3000
```

Point a **sandbox** webhook subscription at `<tunnel>/api/webhooks/square`, set
`NEXT_PUBLIC_SITE_URL` to the tunnel origin so the signature check matches, then use the
Developer Dashboard's *Send test event* button. Re-send the same event twice and confirm the second
one changes nothing — that is the idempotency test.

**On the exclusive race:** two buyers can pay for the same exclusive seconds apart. Phase 5's status
check narrows the window; being the charging party narrows it further, but does not close it.
Re-check inside `fulfilOrder()` under a transaction, and if the beat is already `exclusive_sold`,
refund the loser:

```ts
await square.refunds.refundPayment({
  idempotencyKey: `refund-${order.id}`,
  paymentId: order.square_payment_id,
  amountMoney: { amount: BigInt(order.total_cents), currency: "USD" },
  reason: `Exclusive already sold — ${order.order_number}`,
});
```

Then send an apology email. It'll happen maybe once. Handling it badly in public is much worse than
the code costing you an hour.

**Done when:** a sandbox purchase produces a `fulfilled` order with items in the DB, replaying the
same webhook event changes nothing, and a dashboard-initiated refund flips the order to `refunded`.

---

## Phase 7 — Secure downloads

`app/api/download/[itemId]/route.ts`:

```ts
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2, MASTERS } from "@/lib/r2";

export async function GET(req: Request, { params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await params;
  const kind = new URL(req.url).searchParams.get("kind") ?? "wav";

  // 1. Who is asking, and do they own this item?
  const user = await requireUser();
  const item = await getOwnedOrderItem(itemId, user.id);
  if (!item) return new Response("Not found", { status: 404 });

  // 2. Does their tier include this file?
  if (kind === "stems" && !["trackout", "exclusive"].includes(item.tier)) {
    return new Response("Not included in your license", { status: 403 });
  }

  // 3. Sign a short-lived URL and log it
  const asset = await getAsset(item.beat_id, kind);
  const url = await getSignedUrl(
    r2,
    new GetObjectCommand({ Bucket: MASTERS, Key: asset.r2_key }),
    { expiresIn: 900 }   // 15 minutes
  );

  await logDownload(itemId, kind, req);
  return Response.redirect(url, 302);
}
```

Three things this gets right, all of which are easy to get wrong:

- **Redirect, don't stream.** Piping a 400 MB stems zip through a Vercel function burns bandwidth and hits the response timeout. The 302 hands the transfer to R2, where egress is free.
- **Short expiry.** 15 minutes is plenty to start a download and useless to anyone the link is forwarded to a day later.
- **Tier enforcement server-side.** An MP3-lease buyer guessing `?kind=stems` gets a 403, not a zip.

Add a soft rate limit — say 20 downloads per item per day — and log the rest. You want the audit trail more than the block.

**Done when:** you can download a purchased file, a signed URL 403s after expiry, and requesting stems on an MP3 lease is refused.

---

## Phase 8 — Email and license PDFs

The license PDF is the actual legal artefact. Generate it at fulfilment with `pdf-lib`, one per order item, containing: license number, date, buyer's legal name and artist name, beat title, tier, and the full terms for that tier.

Two emails via Resend:

- **Order confirmation** — order number, items, download links (to `/account`, never signed URLs — those expire), license PDFs attached
- **Magic link** — for first-time buyers, so they can reach their downloads

Send the confirmation from `fulfilOrder()`, after the PDFs exist. If the email fails, do not fail the
order — the money is already taken and the webhook path must still return 200. Queue a retry
instead, and surface the download links on the success screen regardless.

**Done when:** a test purchase lands a confirmation in your inbox with a correct PDF attached.

---

## Phase 9 — Keeping it alive and honest

**Supabase keep-alive.** `vercel.json`:

```json
{ "crons": [{ "path": "/api/cron/keepalive", "schedule": "0 6 * * *" }] }
```

The route does one trivial query (`select count(*) from beats limit 1`). That resets the 7-day inactivity timer. Also add an external monitor — UptimeRobot's free tier — hitting your homepage every 5 minutes, so you find out about downtime before a customer does.

**Payment reconciliation.** Add a daily cron that lists Square payments for the last 48 hours
(`square.payments.list({ beginTime })`) and flags any `COMPLETED` payment with no matching `paid`
order. That is the report which catches the failure mode this architecture has and hosted checkout
doesn't: money taken, fulfilment missed. It should be empty every day. When it isn't, you want to
know within hours, not when the customer emails.

**Backups.** Free-tier Supabase has none. Add a weekly cron that dumps the orders and order_items tables to R2. Losing your catalog is annoying; losing proof of who bought what is a legal problem.

**Masters backup.** Sync the masters bucket to Backblaze B2 monthly. Your source files should not exist in exactly one company's account.

**Watch these numbers:** Supabase egress (5 GB/mo — should stay near zero since audio bypasses it), R2 storage (10 GB free, ~$0.015/GB after), Square's cut, Resend volume.

---

## Phase 10 — Launch checklist

Security:

- [ ] `SUPABASE_SERVICE_ROLE_KEY` and `SQUARE_ACCESS_TOKEN` appear in no client component — grep the build output for both
- [ ] Masters bucket returns access-denied on a direct URL
- [ ] RLS on, and no policy exposes `wav`/`stems` asset rows
- [ ] Checkout prices read from DB, never from the request body
- [ ] Every `payments.create` call carries an idempotency key
- [ ] Webhook signature verified against the exact production notification URL, handler idempotent
- [ ] Download route checks ownership *and* tier

Money:

- [ ] Square account activated for live payments, bank account attached
- [ ] Production access token, application ID and location ID swapped in; `SQUARE_ENVIRONMENT=production`
- [ ] A **separate** production webhook subscription registered, with its own signature key
- [ ] `createVerificationDetails` wired, and a 3DS-challenge test card passed
- [ ] A real card charged for a real dollar, then refunded from the dashboard — and the refund webhook flipped the order to `refunded`
- [ ] Tax handling decided. Square has no automatic tax for the Payments API: either keep the flat 7.5% the UI shows, or move to the Orders API with tax lines, but decide
- [ ] Refund policy written and linked from checkout

Content:

- [ ] Every live beat has preview + wav + stems assets
- [ ] Every preview is tagged
- [ ] License terms reviewed by someone who isn't you

---

## Two things I'd change about the frontend while you're in there

**Exclusive rights shouldn't be a radio button.** At $499–799 with a negotiable publishing split and a contract to sign, it's an enquiry, not an add-to-cart. Right now `components/BuyBox.tsx` lists it as a fourth `lic-opt` beside a $29 lease. Give it a *Request exclusive* button that opens a form and starts a conversation.

**The cart resets on reload.** `store/useCartStore.ts` holds state in memory. Persist to `localStorage` in Phase 4 (zustand's `persist` middleware is a two-line change), and to the database once a user is signed in.

---

## Rough sequencing

Phases 0–2 are a weekend. Phase 3 is an afternoon. Phases 4–8 are the real work — budget a week of evenings, most of it in 6 and 7. Phases 9–10 are half a day.

You can go live after Phase 8 with a handful of beats and add the rest of the catalog later. Don't wait for 142 beats to be ingested before taking the first sale.
