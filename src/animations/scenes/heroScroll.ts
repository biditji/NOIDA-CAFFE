import type { Scene } from "@/animations/types";

/**
 * As the hero leaves, the coupon lifts away: a tilt and drift on desktop; on phones and
 * tablets (no hover tilt there) it swings from its resting -4° through level and drifts up.
 */
export const heroScroll: Scene = ({ gsap, c }) => {
  const hero = document.querySelector<HTMLElement>("[data-hero]");
  const visual = hero?.querySelector<HTMLElement>("[data-hero-visual]");
  if (!hero || !visual || c.reduceMotion) return;

  gsap.to(visual, {
    ...(c.desktop ? { yPercent: -16, rotation: -5 } : { y: -44, rotation: 7, scale: 0.92 }),
    ease: "none",
    scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.5 },
  });
};
