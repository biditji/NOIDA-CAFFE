import type { Scene } from "@/animations/types";

/**
 * Photo frames open from an inset clip-path as they scroll in, while the photo inside settles
 * from a slight zoom and drifts the other way (parallax). The inner layer is oversized in CSS,
 * so neither ever shows an edge. A "float" frame is a print laid over another photo: instead
 * of opening, it rises past it faster and turns as it goes, so the two read as separate
 * layers. Phones get shallower versions of both.
 */
export const imageReveal: Scene = ({ gsap, c }) => {
  for (const frame of gsap.utils.toArray<HTMLElement>("[data-image-reveal]")) {
    const media = frame.querySelector<HTMLElement>("[data-parallax]");
    const float = frame.dataset.imageReveal === "float";

    if (c.reduceMotion) {
      gsap.from(frame, {
        autoAlpha: 0,
        duration: 0.6,
        ease: "none",
        scrollTrigger: { trigger: frame, start: "top 90%", once: true },
      });
      continue;
    }

    // A float frame moves itself, which would shift its own start/end if it were the trigger.
    const trigger = float ? (frame.parentElement ?? frame) : frame;

    if (float) {
      gsap.fromTo(
        frame,
        { yPercent: c.mobile ? 16 : 28, rotation: 7 },
        {
          yPercent: c.mobile ? -8 : -14,
          rotation: -3,
          ease: "none",
          scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: 0.6 },
        },
      );
    } else {
      const radius = getComputedStyle(frame).borderTopLeftRadius || "0px";
      const from = c.mobile ? `inset(10% 0% 10% 0% round ${radius})` : `inset(16% 12% 16% 12% round ${radius})`;

      gsap.fromTo(
        frame,
        { clipPath: from },
        {
          clipPath: `inset(0% 0% 0% 0% round ${radius})`,
          ease: "none",
          scrollTrigger: { trigger, start: "top 95%", end: "top 45%", scrub: 0.5 },
        },
      );
    }

    if (media) {
      gsap.fromTo(
        media,
        { scale: c.mobile ? 1.12 : 1.2 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger, start: "top 95%", end: "top 35%", scrub: 0.5 },
        },
      );
      gsap.fromTo(
        media,
        { yPercent: c.mobile ? -3 : -6 },
        {
          yPercent: c.mobile ? 3 : 6,
          ease: "none",
          scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    }
  }

  // The stamp over the photos spins in once. Left alone if it's already on screen when motion
  // loads, so it never blinks out and back.
  if (c.reduceMotion) return;
  for (const stamp of gsap.utils.toArray<HTMLElement>("[data-stamp]")) {
    if (stamp.getBoundingClientRect().top < window.innerHeight) continue;
    gsap.from(stamp, {
      autoAlpha: 0,
      scale: 0.4,
      rotation: -140,
      duration: 1.1,
      ease: "back.out(1.6)",
      scrollTrigger: { trigger: stamp.parentElement ?? stamp, start: "top 75%", once: true },
    });
  }
};
