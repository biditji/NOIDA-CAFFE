import type { Scene } from "@/animations/types";

/**
 * Section headings rise line by line out of a mask. SplitText's autoSplit re-splits when the
 * width or fonts change and reverts the previous animation, so line breaks stay correct.
 * Reduced motion gets a plain fade instead of movement.
 */
export const textReveal: Scene = ({ gsap, SplitText, c }) => {
  for (const heading of gsap.utils.toArray<HTMLElement>("[data-split]")) {
    const trigger = () => ({ trigger: heading, start: "top 85%", once: true });

    if (c.reduceMotion) {
      gsap.from(heading, { autoAlpha: 0, duration: 0.5, ease: "none", scrollTrigger: trigger() });
      continue;
    }

    SplitText.create(heading, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 110,
          duration: c.mobile ? 0.8 : 1.05,
          ease: "expo.out",
          stagger: 0.09,
          scrollTrigger: trigger(),
        }),
    });
  }
};
