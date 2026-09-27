# AI Usage

## Tools used

- **Claude Code** (Claude Opus 5.5) in VS Code, working directly in the repository. It wrote the
  code, ran builds, drove headless Chrome for automated checks, and ran Lighthouse.
- I ran two Claude Code sessions in parallel: one for the main build, and one for the menu card
  stack, the mobile claim-section layout and some scroll scenes.

## What I used AI for

**What I did myself**

- **Direction.** I chose the stack: React + TypeScript on Next.js, Tailwind, and GSAP with Lenis
  for motion. I wrote the brief the AI worked from. It covered:
  - every assignment requirement, which it had to keep
  - the priority order when things conflict: assignment requirements → correctness →
    accessibility → responsive → performance → interaction → animation complexity
  - the accessibility and reduced-motion rules
  - the performance rules
  - that animation must be progressive enhancement, never needed to read the offer or claim
- **Content and assets.** I chose the campaign content and the photography: the brief's two
  reference photos, added in `public/images/`.
- **Testing.** I tested the page and the claim flow myself, and checked the automated test and
  Lighthouse results.
- **Review.** I reviewed the code before submitting (details below).

**What AI did**

- Wrote the implementation code:
  - the claim form and its states
  - the `/api/claim` route
  - shared validation
  - the GSAP scene system
  - the CSS design system
- Wrote and ran a headless-Chrome test script (Puppeteer against the production build). It checks
  the full claim flow, focus management, ARIA wiring, touch-target size, horizontal overflow,
  reduced-motion behaviour and the no-JS render.
- Ran Lighthouse and investigated the performance traces.
- Drafted the README and this file, following my direction.

## One useful thing AI helped with

Performance debugging from evidence rather than guesses. The first mobile Lighthouse run scored
69. Instead of changing things blindly, it traced the page under 4× CPU throttling:
- One Layout of just 477 objects was taking ~1.6 s.
- A/B runs with injected CSS overrides ruled out `text-wrap`, the marquee, the menu and the ₹
  glyph, and isolated the webfonts. Inter was pulling an 85 KB latin-ext file only to render ₹.
- Separate interleaved A/B runs showed the headline's entrance animation was delaying LCP.
- LCP lined up exactly with the GSAP chunk finishing, which is why GSAP now loads on first
  interaction.

The final build scores 88–89 for mobile performance and 100 on desktop, with accessibility at
100 on both.

## One thing AI got wrong or that I changed

The first version rendered **zoomed out on phones**, and the AI's own first overflow test missed
it. The test compared `scrollWidth` with `innerWidth`, but on mobile Chrome `innerWidth` itself
had grown to ~1318 px, so the check passed. Two things were widening the layout viewport:
- the phone `<input>`'s default intrinsic width (`size=20`) setting a grid column's minimum
- off-screen cards in the horizontal menu row

Both were fixed (`width: 100%` on inputs, `minmax(0,1fr)` grid columns, `contain: paint` on the
scroller). The test now asserts that `innerWidth` equals the device width.

Other mistakes that were caught and corrected:
- Writing `₹{amount}` in JSX, which let SplitText break a heading between "₹" and "150".
- Leaving component CSS unlayered, so Tailwind's `text-apricot` never applied (a real contrast
  failure).
- Loading GSAP during page load.
- Animating the LCP headline.

## What I personally reviewed

I reviewed the code, concentrating on the parts I need to be able to explain and change:

- **Claim request lifecycle:** `hooks/useClaim.ts` and `services/claimApi.ts`. That covers
  loading, success and error, the timeout, the double-submit guard, and how each failure maps to
  a message.
- **Shared validation:** `lib/validation.ts`, used by both the form and the API.
- **The API route:** `app/api/claim/route.ts`, with its status codes and how the code is derived
  from the phone number.
- **Motion:** `animations/MotionDirector.tsx` and the scenes. That covers loading GSAP on first
  interaction, `gsap.matchMedia()` for mobile, desktop and reduced motion, and cleanup on unmount.
- **The fixes listed above:** the `@layer` / specificity contrast bug and the mobile overflow fix.

I also checked the test results, the Lighthouse runs and how the page behaves myself.
