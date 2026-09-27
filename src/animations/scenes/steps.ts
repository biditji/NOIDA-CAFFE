import type { Scene } from "@/animations/types";

/**
 * "How it works": a progress rail fills with scroll and each step's badge pops as the rail
 * reaches it. The rail runs down the left on phones and across the top from tablet up.
 * Only transform is animated (scaleX/scaleY/scale). Text is never dimmed, so no step is ever
 * low-contrast. The CSS default is the finished state, which is also the reduced-motion state.
 */
export const steps: Scene = ({ gsap, c }) => {
  const section = document.querySelector<HTMLElement>("[data-steps]");
  const list = section?.querySelector<HTMLElement>("ol");
  const rail = section?.querySelector<HTMLElement>("[data-steps-progress]");
  if (!section || !list || !rail || c.reduceMotion) return;

  const fills = gsap.utils.toArray<HTMLElement>("[data-step-fill]", section);
  const axis = c.mobile ? "scaleY" : "scaleX";

  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: list,
      start: "top 75%",
      end: c.mobile ? "bottom 55%" : "top 25%",
      scrub: 0.6,
    },
  });

  timeline.fromTo(rail, { [axis]: 0 }, { [axis]: 1, duration: 1 }, 0);
  fills.forEach((fill, index) => {
    const at = (index / Math.max(1, fills.length - 1)) * 0.9;
    timeline.fromTo(fill, { scale: 0 }, { scale: 1, duration: 0.1, ease: "back.out(2.5)" }, at);
  });
};
