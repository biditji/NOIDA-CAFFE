import type { Scene } from "@/animations/types";

/**
 * Secondary content fades up as it enters. ScrollTrigger.batch groups elements entering on
 * the same frame into one staggered tween instead of one trigger-and-tween per element.
 * Anything already on screen when motion loads is left alone — no hide-then-show flash.
 */
export const reveal: Scene = ({ gsap, ScrollTrigger, c }) => {
  const fold = window.innerHeight;
  const items = gsap.utils
    .toArray<HTMLElement>("[data-reveal]")
    .filter((el) => el.getBoundingClientRect().top > fold);
  if (!items.length) return;

  gsap.set(items, { autoAlpha: 0, y: c.reduceMotion ? 0 : 28 });
  ScrollTrigger.batch(items, {
    start: "top 90%",
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        stagger: 0.08,
        duration: c.reduceMotion ? 0.4 : 0.8,
        overwrite: true,
      }),
  });
};
