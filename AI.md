# AI Usage

## Tools used

- **Claude Code** (Claude Opus 5.5) in VS Code, working directly in the repository: reading
  the brief, writing code, running builds, driving headless Chrome and running Lighthouse.
- A second Claude Code session ran in parallel on the menu card stack, the mobile claim-section
  layout and some scene work.

## What I used AI for

- Turning the brief into a requirements checklist, then scaffolding the Next.js / TypeScript /
  Tailwind project and its folder structure.
- Writing most of the implementation: the claim form and its states, the `/api/claim` route,
  shared validation, the GSAP scene system, and the CSS design system.
- Verification. It wrote a headless-Chrome test script (Puppeteer against the production build)
  that checks the full claim flow, focus management, ARIA wiring, touch-target size, horizontal
  overflow, reduced-motion behaviour and the no-JS render. It ran Lighthouse and read the traces.
- Drafting this README and AI.md.

## One useful thing AI helped with

Performance debugging from evidence rather than guesses. The first mobile Lighthouse run scored
69. Instead of changing things blindly, it traced the page under 4× CPU throttling:
- One Layout of just 477 objects was taking ~1.6 s.
- A/B runs with injected CSS overrides ruled out `text-wrap`, the marquee, the menu and the ₹
  glyph, and isolated the webfonts. Inter was pulling an 85 KB latin-ext file only to render ₹.
- Separate interleaved A/B runs showed the headline's entrance animation was delaying LCP.
- LCP lined up exactly with the GSAP chunk finishing, which is why GSAP now loads on first
  interaction.

## One thing AI got wrong or that I changed

The first version rendered **zoomed out on real phones**, and the AI's own first overflow test
missed it. The test compared `scrollWidth` with `innerWidth`, but on mobile Chrome `innerWidth`
itself had grown to ~1318 px, so the check passed. Two things were widening the layout viewport:
- the phone `<input>`'s default intrinsic width (`size=20`) setting a grid column's minimum
- off-screen cards in the horizontal menu row

It fixed both (`width: 100%` on inputs, `minmax(0,1fr)` grid columns, `contain: paint` on the
scroller). The test now asserts that `innerWidth` equals the device width.

Other things it got wrong and corrected:
- Writing `₹{amount}` in JSX, which let SplitText break a heading between "₹" and "150".
- Leaving component CSS unlayered, so Tailwind's `text-apricot` never applied (a real contrast
  failure).
- Loading GSAP during page load.
- Animating the LCP headline.

## What I personally reviewed

_TODO (candidate): write this yourself. Say which files you read line by line, what you ran on
a real phone, and anything you changed after reviewing. Before the walkthrough, be ready to
explain:_
- _`hooks/useClaim.ts` and `services/claimApi.ts` (the request lifecycle)_
- _`lib/validation.ts` (shared validation)_
- _`animations/MotionDirector.tsx` and one scene (matchMedia, cleanup, lazy loading)_
- _the `@layer` / specificity fix and the mobile overflow fix_
