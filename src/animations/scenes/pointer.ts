import type { Scene } from "@/animations/types";

/**
 * Pointer interactions, mouse and trackpad only. On touch there is no hover to follow, so
 * these don't exist there; touch gets CSS :active press feedback instead.
 * quickTo reuses one tween per property instead of creating a tween on every pointermove.
 */

/** The hero CTA leans toward the cursor. */
export const magnetic: Scene = ({ gsap, c }) => {
  if (!c.finePointer || c.reduceMotion) return;

  const cleanups = gsap.utils.toArray<HTMLElement>("[data-magnetic]").map((el) => {
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
    let rect: DOMRect | null = null;

    const onMove = (event: PointerEvent) => {
      rect ??= el.getBoundingClientRect(); // measured once per hover, not per move
      xTo((event.clientX - (rect.left + rect.width / 2)) * 0.25);
      yTo((event.clientY - (rect.top + rect.height / 2)) * 0.35);
    };
    const onLeave = () => {
      rect = null;
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  });

  return () => cleanups.forEach((cleanup) => cleanup());
};

/** The coupon tilts in 3D under the cursor, with a glare that follows it. */
export const tilt: Scene = ({ gsap, c }) => {
  if (!c.finePointer || c.reduceMotion || c.mobile) return;

  const cleanups = gsap.utils.toArray<HTMLElement>("[data-tilt]").map((area) => {
    const card = area.querySelector<HTMLElement>("[data-tilt-inner]");
    if (!card) return () => {};

    gsap.set(area, { perspective: 1000 });
    const ease = { duration: 0.7, ease: "power3.out" };
    const rotateX = gsap.quickTo(card, "rotationX", ease);
    const rotateY = gsap.quickTo(card, "rotationY", ease);
    const glareX = gsap.quickTo(card, "--gx", { duration: 0.4 });
    const glareY = gsap.quickTo(card, "--gy", { duration: 0.4 });
    let rect: DOMRect | null = null;

    const onMove = (event: PointerEvent) => {
      rect ??= area.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      rotateY((x - 0.5) * 16);
      rotateX((0.5 - y) * 12);
      glareX(x * 100);
      glareY(y * 100);
    };
    const onLeave = () => {
      rect = null;
      rotateX(0);
      rotateY(0);
    };

    area.addEventListener("pointermove", onMove);
    area.addEventListener("pointerleave", onLeave);
    return () => {
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
    };
  });

  return () => cleanups.forEach((cleanup) => cleanup());
};
