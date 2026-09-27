# Morrow Café — ₹150 off campaign

A mobile-first campaign page for a fictional café. A customer scans a QR code at the table,
lands here, and claims ₹150 off their next visit with just a name and phone number. They get
a code on screen to show at the counter.

**Live:** _TODO: add the deployed URL_ · **Try the unhappy paths:** add `?demo=error`
(server failure) or `?demo=slow` (2.5 s response) to the live URL.

---

## What's in it

- **Campaign page:** café identity, the offer, a short value proposition, how it works,
  menu highlights priced with the offer applied, the fine print, and address and hours.
- **Claim form:** name and Indian mobile number, with validation shared by client and server,
  human error messages, and a `tel` keyboard with autofill.
- **`POST /api/claim`:** a real Next.js route handler that honours the contract exactly.
- **States:** idle → submitting → success, or error. Loading, disabled, error and success
  states are all announced to screen readers.
- **Success:** the claim code, copy-to-clipboard with confirmation, validity date, directions,
  and what to do at the counter. The claim is remembered on the device, so reopening the page
  at the counter still shows the code.
- **Motion:** CSS for the hero entrance and all UI state changes. A lazily loaded GSAP layer
  handles scroll scenes, and View Transitions handle the form → ticket change. Every piece has
  a reduced-motion alternative.

## Stack and why

| | Why |
|---|---|
| **Next.js 16 (App Router) + React 19 + TypeScript** | The page is statically prerendered. Sections are server components, so they ship HTML and no component JS. Only the form, two CTA links, the sticky mobile bar and the motion loader are client components. The API route lives in the same project and deploys with it. `next/font` self-hosts the display font with size-adjusted fallbacks (no layout shift). |
| **Tailwind CSS v4** | Layout utilities plus design tokens in `@theme`. Complex pieces (the coupon, the ticket, form states) are plain CSS in `@layer components`. |
| **GSAP (ScrollTrigger, SplitText) + Lenis** | Scroll-linked scenes that CSS can't do reliably across browsers yet: scrubbed timelines, masked line reveals, a sticky scroll-driven card stack, and velocity-reactive motion. These are loaded **only after the visitor first interacts**, never during page load. Lenis is used only for mouse and trackpad users. |

**Trade-off I'd flag myself:** the brief asks for minimal JavaScript. The React + Next runtime
is ~160 KB gzip before any of my code, and that is the largest JS cost on this page. The
campaign code on first load is ~14 KB gzip. GSAP (~48 KB gzip) and Lenis (~5 KB) arrive later,
on interaction. For a real one-page campaign I'd seriously consider Astro with a single form
island, which would ship far less. I chose Next.js because it's in the studio's stack, it keeps
the API route in one deploy, and React/TS is what I can explain line by line.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production build (use this for Lighthouse)
npm run typecheck
```

Optional: set `CLAIM_CODE_SECRET` (any string) in production. Without it, a dev secret is used.

**Deploy:** push to GitHub and import into Vercel. No config is needed; `/api/claim` becomes a
serverless function.

**Adding photos:** drop files in `public/images/` and set `src` in `src/content/media.ts`.
`next/image` then serves AVIF/WebP at the right widths. Until then the slots render CSS
illustrations at the same aspect ratio, so nothing shifts when real photos arrive.

## Architecture

```text
src/
  app/            layout (fonts, metadata), page, globals.css, api/claim/route.ts
  sections/       server components, one per page section (no client JS)
  components/     ClaimForm, Field, SubmitButton, SuccessTicket, CopyButton, ClaimLink,
                  StickyClaimBar, OfferTicket, ImageSlot, Icons
  animations/     MotionDirector (the only motion entry point), loadMotion, scenes/*
  hooks/          useClaim (request lifecycle), useClaimSnapshot, useClipboard
  lib/            campaign facts, shared validation, claim code, claim store, scroll, view transition
  services/       claimApi (fetch, timeout, response guards)
  types/          the API contract as TypeScript types
  utils/          media queries, cn
```

Separation of concerns:
- **Presentation** is sections and components.
- **Validation** is `lib/validation.ts`, the same code on client and server.
- **API** is `services/claimApi.ts`, which turns every outcome (success, 4xx, 5xx, timeout,
  offline, network error, off-contract JSON) into one typed `ClaimResult`.
- **Request state** is `useClaim` (a small reducer).
- **The persisted claim** is `claimStore`, an external store read with `useSyncExternalStore`
  and shared by the form and the sticky bar.

## The API: `POST /api/claim`

Request and responses match the brief exactly:
`{ name, phone }` → `{ success: true, claimCode, message }` or `{ success: false, message }`.

| Case | Status | Message |
|---|---|---|
| Valid | 200 | `Your offer has been claimed.` |
| Invalid name or phone | 422 | Human message (same text the form shows) |
| Malformed JSON, missing or non-string fields | 400 | `Unable to process your request.` |
| Wrong content type / body > 1 KB / not POST | 415 / 413 / 405 | `Unable to process your request.` |
| `?demo=error` / `?demo=slow` | 503 / 200 after 2.5 s | for reviewing error and loading states |

**Claim codes** (`MORROW-XXXX`) are derived with an HMAC of the campaign id and the phone
number. They are not random. The same number always gets the same code, so double-submits and
"I lost my code" are idempotent without a database. The alphabet drops look-alikes (0/O, 1/I)
so a barista can read it. This is a demo trade-off, not a redemption system; see Production.

**Why a real route instead of a mock:** it's ~60 lines in the same deploy. It also lets the
client exercise real network behaviour: status codes, latency, JSON parsing and timeouts.

**Client lifecycle:**
- A 12 s timeout, and a double-submit guard.
- The button uses `aria-disabled`, not `disabled`, so focus isn't lost.
- Inputs are read-only while submitting, and values are kept after an error.
- The error copy depends on the cause: offline, timeout, network, server, or rejected.

## Motion architecture

- **The hero entrance is CSS-only**, so it never waits on JavaScript. The headline, which is
  the LCP element, is deliberately static.
- **One client entry point.** `MotionDirector` loads GSAP on the first `scroll`, `wheel`,
  `touchstart`, `pointerdown`, `pointermove` or `keydown`. It then runs every scene inside one
  `gsap.matchMedia()` keyed on mobile, tablet, desktop, fine pointer and reduced motion. When a
  condition flips, everything is reverted and rebuilt. On unmount, `mm.revert()` kills tweens,
  ScrollTriggers, SplitTexts and pins, and each scene's cleanup removes its DOM listeners.
- **Scenes are small functions** that find their targets by `data-*` attributes in the
  server-rendered HTML. The sections stay server components.
- **One owner per transform layer.** The coupon has four nested layers: GSAP scroll → CSS
  entrance → pointer area → GSAP tilt. Nothing fights over the same `transform`. The idle
  float and sheen loops animate the separate `translate`/`scale` properties, which compose
  with those transforms instead of replacing them.
- **The card stack uses `position: sticky`, not a GSAP pin.** `menuStack` adds `.is-stacked`,
  which makes the deck a sticky stage over an empty runway (`--stack-steps` card-lengths of
  scroll). The browser holds the stage in place on the compositor, so touch scrolling has no
  pin-spacer jump. The runway's scroll progress scrubs one timeline: each card rises from below
  the fold while the cards under it sink, shrink and darken, and as it lands its price is
  struck through, counts down to the offer price, and a "₹150 off" stamp hits the photo. The
  stage's height is measured on every `refreshInit` so CSS can centre it above the sticky bar.
- **`claimCard`** scrubs the form card up out of the dark section. It finishes by `top 70%`,
  so after a CTA tap scrolls the name field into view, the card is no longer moving.
- **`imageReveal`** handles the "Find us" photos. The interior frame opens from an inset
  clip-path while the photo inside settles from a 1.2× zoom and drifts against the scroll. The
  latte shot is a tilted print that rises past it faster and turns as it goes, so the two read
  as separate layers. It uses the photo block as its trigger because it moves itself. The
  stamp spins in once; its text ring turns slowly in CSS. The section is `overflow-x: clip`
  because a turning square's bounding box is wider than the square.
- **Lenis and ScrollTrigger share one loop.** Lenis is driven by `gsap.ticker`, calls
  `ScrollTrigger.update` on scroll, and has `lagSmoothing(0)`. Nothing else runs its own
  scroll loop.
- **Transform and opacity where possible.** The two exceptions are clip-path on image reveals
  and SVG stroke drawing. `quickTo` is used for pointer-driven values. Marquee speed changes go
  through the Web Animations API on a CSS animation.
- **Progressive enhancement.** Content, the form and the claim code never depend on motion.
  With JS disabled or GSAP blocked, the page is complete and static.

**Per device:**
- **Phones:** native scrolling, a vertical progress rail in "How it works", no pointer effects.
  Instead of hover effects, the coupon floats with a passing sheen, swings level as the hero
  scrolls away, the CTA gets a periodic shine, and the marquee leans with the flick.
- **Tablet:** horizontal rail, no smooth scrolling on touch.
- **Desktop with a mouse:** Lenis smoothing, a magnetic CTA, the 3D coupon tilt with glare,
  and photos that zoom slightly under the cursor.
- **Menu highlights:** a sticky, scroll-driven card stack on every screen size. Phones and
  tablets show the intro above the deck, and desktop shows them side by side as two sticky
  columns. Short landscape screens (under 480 px tall, checked once so an on-screen keyboard
  can't trigger a rebuild) and reduced motion keep a native swipe row with scroll-snap.
- **Reduced motion:** movement becomes short fades. Loops (marquee, pulse, coupon float and
  sheen, CTA shine, stamp ring) stop. Nothing is
  pinned, scrubbed or smoothed. The spinner still spins, slower, because it communicates state.

## Responsive and mobile

- Designed at 360–414 px first. Body text is ≥ 16 px (inputs are 17 px so iOS doesn't zoom).
- All touch targets are ≥ 44 px, which the tests check. Safe-area insets are respected, and
  `svh` units are used where the address bar matters.
- A mobile-only sticky CTA appears after the hero button scrolls away and hides before the form
  appears, so it never covers what it points to. It uses one IntersectionObserver and no scroll
  listener.
- Tapping the CTA focuses the name field in the same tap, so the keyboard opens predictably.
- In the claim section the source order is heading → form → fine print, so on a phone the form
  comes straight after the heading. From `lg`, grid placement moves the terms under the
  intro. Using source order rather than CSS `order` keeps screen-reader order matching what's
  on screen.

## Accessibility

- Semantic landmarks and one `h1`. Heading order is h1 → h2 per section → h3 for steps, cards
  and the form.
- A skip link goes to the form.
- Real `<label>`s. Hints and errors are linked with `aria-describedby`, and invalid fields get
  `aria-invalid`.
- On a failed submit, focus moves to the first invalid field. Request errors use `role="alert"`
  and loading uses a polite status.
- On success, focus moves to the result heading. A claim restored on page load never steals focus.
- Visible `:focus-visible` rings, themed per surface.
- Checked contrast pairs: text 4.9:1 and above on every surface; input borders 3.3:1 against
  white (non-text contrast).
- Decorative elements (the coupon art, marquee, illustrations) are `aria-hidden`. Their
  information exists elsewhere as text.

## Performance

Decisions:
- Static prerender and server components.
- One webfont: Fraunces 600, latin only, ~18 KB. Body uses the system UI stack (see below).
- CSS is inlined, so there is no render-blocking request.
- GSAP is loaded on interaction.
- Image slots have a fixed aspect ratio (CLS 0). Photos go through `next/image`, lazy by default.
- No icon or validation libraries.
- The mobile sticky bar uses IntersectionObserver rather than a scroll listener.

### Lighthouse report

All runs used Lighthouse 12.8.2 on the local production build (`next start`), with the default
mobile preset (simulated slow 4G, 4× CPU) unless noted.

**First audit:** mobile **69** perf / **96** a11y / 100 / 100. Desktop 98 / 96 / 100 / 100.
Mobile LCP was 3.5 s, TBT 710 ms, CLS 0.

**What I found and fixed:**
1. **Contrast failure (a11y 96 → 100).** A section kicker rendered ember on espresso (3.2:1).
   My component CSS was unlayered, which beats Tailwind's layered utilities, so `text-apricot`
   never applied. I moved components into `@layer components`.
2. **LCP render delay ~3 s.** LCP landed exactly when the GSAP chunk finished executing. The
   motion layer was loading at idle during page load and competing with hydration. It now loads
   on first interaction.
3. **One Layout of 477 objects took ~1.6 s under throttling.** I A/B-tested with injected CSS
   and traced it to webfonts. Inter needed its **85 KB latin-ext file just for ₹**, on top of its
   48 KB latin file, and the first layout with them was about 2× slower. Body text now uses
   system fonts (Roboto, SF and Segoe UI all include ₹). Fraunces stays for headings.
4. **The headline entrance delayed LCP.** An interleaved A/B under 4× CPU gave LCP of
   1,196–1,984 ms with the animation and 1,256–1,568 ms without. The headline is now static.
5. An endless `box-shadow` pulse restyled every frame. It's now a compositor-only
   transform/opacity pulse.
6. The stylesheet was render-blocking. It's now inlined with `experimental.inlineCss`.
7. **Not a Lighthouse finding, but the worst bug:** mobile Chrome's layout viewport grew to
   ~1318 px (`innerWidth`), so the page rendered zoomed out. The phone input's intrinsic
   `size=20` width set a grid column's minimum, and off-screen carousel cards counted toward
   viewport width. Fixed with `width: 100%` on inputs, `minmax(0, 1fr)` columns and
   `contain: paint` on the scroller. The tests now assert `innerWidth === device width`.

**Final audit (same local setup, final code):**

| | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| Mobile, run 1 | 88 | 100 | 100 | 100 | 1.4 s | 2.6 s | 290 ms | 0 |
| Mobile, run 2 | 89 | 100 | 100 | 100 | 1.4 s | 2.6 s | 240 ms | 0 |
| Desktop (×2) | 100 | 100 | 100 | 100 | 0.4 s | 0.6–0.7 s | 20–40 ms | 0 |

A third mobile run scored 78. I've excluded it because Lighthouse's CPU `benchmarkIndex` for
that run was 392, against ~1200–1400 for the others: the machine was busy, not the page. Earlier
runs taken while a second process was building in parallel swung between 56 and 88 on identical
code, for the same reason. _TODO: re-check on the live URL with PageSpeed Insights and note the
result here._

**What I deliberately left alone:**
- "Unused JavaScript" (~54 KB) and "legacy JavaScript" (~13 KB). Both are in the framework
  chunks, and removing them means a different framework, not a tweak.
- The remaining mobile LCP delay is the first layout plus React hydration. Going further means
  shipping less framework, not tuning this page.
- Speed Index (4.4 s in the clean runs) is the weakest mobile metric. I suspect the coupon's
  continuous idle float and sheen keep changing pixels in the first screen, which Speed Index
  counts as "not finished", but I didn't verify that.
- The browser fetches Fraunces's latin-ext file (17 KB) on demand, because ₹ falls in that
  subset's range. It isn't preloaded and doesn't block anything.

## Product thinking

### Decision 1: above the fold (phone, no scrolling)

Visible before any scroll:
- the café name and sector (trust: "this is the place I'm sitting in")
- "Thanks for scanning" (context for someone arriving from a QR code)
- the offer as the headline
- one sentence covering what it takes and what happens next: name and number → code on
  screen → show it at the counter
- the **Claim ₹150 OFF** button and "No app · No OTP · Code in seconds"
- the top of the coupon

A QR visitor has almost no context and little patience, so the first screen answers four of
the brief's five questions and puts the action one tap away. The form itself starts one tap
later, and the button drops the cursor straight into the name field.

### Decision 2: beyond the happy path (thousands of users)

1. **Duplicate claims from the same number.** The HMAC code already makes repeats idempotent.
   In production I'd add a `claims` table with a unique key on `(campaign_id, phone)`. An
   insert that hits the key returns the existing code with a friendly "you've already claimed —
   here it is" (200, not an error), and redemption gets its own `redeemed_at` so a code can be
   used once. The counter checks the code *and* the last 4 digits of the phone.
2. **Rate limiting and abuse.** Limit at the edge, e.g. Cloudflare or Upstash rate limiting.
   Use a sliding window per IP (say 5 per minute) plus a per-phone limit per day, returning
   `429` with the contract's error shape and a `Retry-After`. The UI already shows the server's
   message. Add a honeypot field and Cloudflare Turnstile (invisible) only if abuse actually
   appears, because every extra step costs conversions from real diners.
3. **API failures and retries.** The client already separates offline, timeout, network and
   server errors and keeps the input. Next steps:
   - one automatic retry with jittered backoff for network errors and 5xx (safe, because claims
     are idempotent per phone)
   - an idempotency key header so a retried request can never create two records
   - Sentry (or similar) on the client and the route, with an alert when the claim error rate
     over 5 minutes goes above a threshold

## What I cut, and what I'd do next in production

**Cut on purpose:**
- **No optional third field.** The brief allowed one, but every field costs conversions for a
  diner at a table, and nothing else was needed to redeem.
- **No OTP.** The brief says it isn't required.
- **No analytics.** In production I'd send scan (UTM from the QR code), form start, claim
  success, claim error and code copied, as a funnel, through a privacy-friendly tool.
- **No real persistence or redemption ledger.**

**Production next steps:**
- A database-backed claims table and a redemption flow for staff.
- A campaign end date and code expiry enforced on the server (the UI already shows a
  "valid until" date).
- Rate limiting and monitoring as above.
- Real photography, a WhatsApp share of the code, and an OG image for the link preview.

## Time spent

_TODO: fill in your honest total (build, testing, docs)._
