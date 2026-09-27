import { matches, prefersReducedMotion } from "@/utils/media";

/** The smooth scroller, if the motion layer started one (desktop + fine pointer only). */
interface SmoothScroller {
  scrollTo(target: HTMLElement, options?: { offset?: number }): void;
}

let smoothScroller: SmoothScroller | null = null;

export function setSmoothScroller(instance: SmoothScroller | null) {
  smoothScroller = instance;
}

/**
 * Takes the visitor to the claim form and puts focus where they need it: the name field,
 * or the success heading if they have already claimed. Works with or without the motion layer.
 */
export function goToClaim() {
  const section = document.getElementById("claim");
  const focusTarget = document.querySelector<HTMLElement>("[data-claim-focus]");
  if (!section) return;

  // On touch, focusing synchronously inside the tap keeps the on-screen keyboard behaviour
  // predictable; the browser scrolls the field into view itself.
  if (matches("(pointer: coarse)")) {
    focusTarget?.focus();
    if (!focusTarget) section.scrollIntoView({ block: "start" });
    return;
  }

  focusTarget?.focus({ preventScroll: true });
  if (smoothScroller) smoothScroller.scrollTo(section, { offset: -24 });
  else section.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}
