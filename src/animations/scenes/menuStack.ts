import type { Scene } from "@/animations/types";

/** px of each buried card left showing above the one that covers it */
const PEEK = 14;
/** scale lost per level of depth */
const SHRINK = 0.06;
/** buried cards deeper than this fade out, so the pile never gets messy */
const MAX_DEPTH = 3;
/** scroll held (in card-lengths) before the first and after the last card */
const HOLD = 0.5;

const depthState = (d: number) => ({
  // Shrinking from the top edge plus the lift is what leaves each buried card's edge showing.
  transformOrigin: "50% 0%",
  y: -PEEK * Math.min(d, MAX_DEPTH),
  scale: 1 - SHRINK * Math.min(d, MAX_DEPTH + 1),
  autoAlpha: d > MAX_DEPTH ? 0 : 1,
});
const shadeAt = (d: number) => Math.min(MAX_DEPTH, d) * 0.1;

/**
 * "What your ₹150 gets you" as a scroll-driven card stack, on every screen size.
 *
 * The stage is `position: sticky` (set by .is-stacked in CSS) over an empty runway, so the
 * browser holds it in place on the compositor: no pin spacer, no jump when a pin engages
 * on touch. The runway's scroll progress scrubs one timeline: each card rises from below
 * the fold and lands on the deck while the cards beneath sink back, shrink and darken.
 * As a card lands its price strikes through, counts down to the offer price and an
 * "₹150 off" stamp hits the photo.
 *
 * Reduced motion (and very short landscape screens) keep the native swipe row instead.
 */
export const menuStack: Scene = ({ gsap, ScrollTrigger, c }) => {
  const section = document.querySelector<HTMLElement>("[data-stack]");
  const stage = section?.querySelector<HTMLElement>("[data-stack-stage]");
  const deck = section?.querySelector<HTMLElement>("[data-stack-deck]");
  const runway = section?.querySelector<HTMLElement>("[data-stack-runway]");
  const cards = section ? gsap.utils.toArray<HTMLElement>("[data-stack-card]", section) : [];
  if (!section || !stage || !deck || !runway || cards.length < 2 || c.reduceMotion) return;
  // Checked once rather than as a matchMedia condition: on some Android browsers the
  // on-screen keyboard shrinks the viewport, and that must not rebuild the page mid-typing.
  if (window.innerHeight < 480) return;

  section.classList.add("is-stacked");
  // The deck no longer scrolls sideways, so it shouldn't be a tab stop or say it scrolls.
  const label = stage.getAttribute("aria-label");
  stage.removeAttribute("tabindex");
  stage.setAttribute("aria-label", "Menu highlights");

  const n = cards.length;
  const count = section.querySelector<HTMLElement>("[data-stack-count]");
  const bar = section.querySelector<HTMLElement>("[data-stack-bar]");
  const parts = cards.map((card) => {
    const num = card.querySelector<HTMLElement>("[data-stack-num]");
    return {
      card,
      num,
      finalText: num?.textContent ?? "",
      orb: card.querySelector("[data-stack-orb]"),
      strike: card.querySelector("[data-stack-strike]"),
      now: card.querySelector("[data-stack-now]"),
      stamp: card.querySelector("[data-stack-stamp]"),
      shade: card.querySelector("[data-stack-shade]"),
    };
  });
  type Parts = (typeof parts)[number];
  let alive = true;
  let active = -1;

  const setActive = (index: number) => {
    if (index === active || !count) return;
    active = index;
    count.textContent = String(index + 1).padStart(2, "0");
  };

  // CSS centres the sticky stage with top: (viewport − --stage-h) / 2, so hand it the
  // stage's height before every ScrollTrigger measurement.
  const measure = () => stage.style.setProperty("--stage-h", `${stage.offsetHeight}px`);
  measure();
  ScrollTrigger.addEventListener("refreshInit", measure);

  // The runway starts right where the stage ends, so the stage is stuck from the moment the
  // runway's top reaches (sticky top + stage height) until the runway's bottom does.
  const stuckAt = () => (parseFloat(getComputedStyle(stage).top) || 0) + stage.offsetHeight;

  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: runway,
      start: () => `top ${stuckAt()}px`,
      end: () => `bottom ${stuckAt()}px`,
      scrub: c.mobile ? 0.4 : 0.7,
      invalidateOnRefresh: true,
    },
    onUpdate: () => setActive(gsap.utils.clamp(0, n - 1, Math.floor(timeline.time()))),
  });

  /** A card's arrival details: orb spins in, price strikes and counts down, stamp hits. */
  const land = ({ num, finalText, orb, strike, now, stamp }: Parts, at: number) => {
    if (orb) {
      timeline.fromTo(orb, { scale: 0.55, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.7, ease: "power2.out" }, at);
    }
    if (strike) {
      timeline.fromTo(strike, { scaleX: 0 }, { scaleX: 1, duration: 0.2, ease: "power1.in" }, at + 0.15);
    }
    // The offer price stays hidden until it lands, then appears counting down from the menu price.
    if (now) timeline.fromTo(now, { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.15 }, at + 0.25);
    if (num) {
      const from = Number(num.dataset.from);
      const proxy = { value: from };
      num.textContent = String(from);
      // fromTo, not to: invalidateOnRefresh re-records a .to() start value, which would be
      // the already-counted-down number after a resize.
      timeline.fromTo(
        proxy,
        { value: from },
        {
          value: Number(finalText),
          duration: 0.4,
          ease: "power2.out",
          immediateRender: false,
          onUpdate: () => {
            if (alive) num.textContent = String(Math.round(proxy.value));
          },
        },
        at + 0.25,
      );
    }
    if (stamp) {
      timeline.fromTo(
        stamp,
        { scale: 2.4, autoAlpha: 0, rotation: -35 },
        { scale: 1, autoAlpha: 1, rotation: 0, duration: 0.22, ease: "back.out(2.2)" },
        at + 0.5,
      );
    }
  };

  parts.forEach((incoming, i) => {
    if (i === 0) {
      land(incoming, 0);
      return;
    }
    const at = HOLD + (i - 1);

    // Rises from just below the fold, tipped alternately left and right, and settles flat.
    timeline.fromTo(
      incoming.card,
      { y: () => window.innerHeight, rotation: i % 2 ? 7 : -7, transformOrigin: "50% 50%" },
      { y: 0, rotation: 0, transformOrigin: "50% 50%", duration: 1, ease: "power2.out" },
      at,
    );

    // Everything already on the deck sinks one level as the new card comes down on it.
    parts.slice(0, i).forEach(({ card, shade }, j) => {
      const depth = i - j;
      const sink = { duration: 0.7, immediateRender: false };
      timeline.fromTo(card, depthState(depth - 1), { ...depthState(depth), ...sink }, at + 0.3);
      if (shade) timeline.fromTo(shade, { opacity: shadeAt(depth - 1) }, { opacity: shadeAt(depth), ...sink }, at + 0.3);
    });

    land(incoming, at + 0.55);
  });

  if (bar) timeline.fromTo(bar, { scaleX: 1 / n }, { scaleX: 1, duration: n - 2 * HOLD + 0.5 }, HOLD - 0.25);
  // Pad the end so the last card rests before the stage lets go.
  timeline.set({}, {}, n);

  // The deck itself rises into the stage and untilts while the stage scrolls into view.
  gsap.fromTo(
    deck,
    { y: 60, rotation: -3, scale: 0.92 },
    {
      y: 0,
      rotation: 0,
      scale: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: runway,
        start: () => `top ${window.innerHeight + stage.offsetHeight * 0.7}px`,
        end: () => `top ${stuckAt()}px`,
        scrub: c.mobile ? 0.4 : 0.7,
        invalidateOnRefresh: true,
      },
    },
  );

  return () => {
    alive = false;
    ScrollTrigger.removeEventListener("refreshInit", measure);
    stage.style.removeProperty("--stage-h");
    section.classList.remove("is-stacked");
    stage.setAttribute("tabindex", "0");
    if (label) stage.setAttribute("aria-label", label);
    for (const { num, finalText } of parts) if (num) num.textContent = finalText;
    if (count) count.textContent = "01";
  };
};
