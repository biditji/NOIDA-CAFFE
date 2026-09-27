import type { MotionLib } from "@/animations/types";

let pending: Promise<MotionLib> | null = null;

/**
 * GSAP and its plugins arrive as a separate chunk after the page is interactive, so they
 * never compete with first paint or the form's hydration. Loaded once, shared by everyone.
 */
export function loadMotion(): Promise<MotionLib> {
  pending ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("gsap/SplitText")])
    .then(([{ gsap }, { ScrollTrigger }, { SplitText }]) => {
      gsap.registerPlugin(ScrollTrigger, SplitText);
      // Mobile browsers resize the viewport as the URL bar shows/hides; don't recalc for that.
      ScrollTrigger.config({ ignoreMobileResize: true });
      gsap.defaults({ ease: "power3.out", duration: 0.8 });
      return { gsap, ScrollTrigger, SplitText };
    })
    .catch((error: unknown) => {
      pending = null; // allow a later retry; the page is fully usable without motion
      throw error;
    });
  return pending;
}
