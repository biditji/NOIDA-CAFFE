import type { Scene } from "@/animations/types";

/**
 * The top progress bar is a CSS scroll-driven animation (animation-timeline: scroll()) and
 * costs no JavaScript where supported. This scene is only the fallback for browsers
 * without it.
 */
export const scrollProgress: Scene = ({ gsap }) => {
  const bar = document.querySelector<HTMLElement>("[data-scroll-progress]");
  if (!bar || CSS.supports("animation-timeline: scroll()")) return;

  gsap.fromTo(
    bar,
    { scaleX: 0 },
    { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } },
  );
};
