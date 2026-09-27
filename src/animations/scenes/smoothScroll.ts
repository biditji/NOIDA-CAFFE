import type Lenis from "lenis";
import type { Scene } from "@/animations/types";
import { setSmoothScroller } from "@/lib/scroll";

/**
 * Lenis smoothing for mouse/trackpad users only. Touch devices keep native momentum
 * scrolling (which is already smooth and which people expect), and reduced-motion users
 * keep native scrolling too. Lenis is driven by GSAP's ticker so there is exactly one
 * rAF loop and ScrollTrigger updates on the same frame Lenis moves the page.
 */
export const smoothScroll: Scene = ({ gsap, ScrollTrigger, c }) => {
  if (!c.finePointer || c.reduceMotion) return;

  let lenis: Lenis | null = null;
  let cancelled = false;
  const tick = (time: number) => lenis?.raf(time * 1000);

  import("lenis")
    .then(({ default: LenisClass }) => {
      if (cancelled) return;
      lenis = new LenisClass({ lerp: 0.12, autoRaf: false });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setSmoothScroller(lenis);
    })
    .catch(() => {
      // Native scrolling is the fallback.
    });

  return () => {
    cancelled = true;
    gsap.ticker.remove(tick);
    gsap.ticker.lagSmoothing(500, 33);
    setSmoothScroller(null);
    lenis?.destroy();
  };
};
