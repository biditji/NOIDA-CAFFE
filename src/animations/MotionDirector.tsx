"use client";

import { useEffect } from "react";
import { loadMotion } from "@/animations/loadMotion";
import { SCENES } from "@/animations/scenes";
import type { Conditions, MotionLib } from "@/animations/types";
import { MQ } from "@/utils/media";

function mountScenes(lib: MotionLib) {
  const { gsap, ScrollTrigger } = lib;
  const mm = gsap.matchMedia();

  // One matchMedia for the whole page: when any condition flips (rotate a tablet, toggle
  // reduced motion) every scene is reverted and rebuilt for the new conditions.
  mm.add(MQ, (context) => {
    const c = context.conditions as Conditions;
    const cleanups = SCENES.map((scene) => scene({ ...lib, c }));
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    return () => {
      for (const cleanup of cleanups) cleanup?.();
    };
  });

  // Webfonts change line breaks and section heights; measure again once they're in.
  let alive = true;
  document.fonts?.ready.then(() => alive && ScrollTrigger.refresh());

  return () => {
    alive = false;
    mm.revert();
  };
}

const WAKE_EVENTS = ["scroll", "wheel", "touchstart", "pointerdown", "pointermove", "keydown"] as const;

/**
 * The single client entry point for page motion. Sections stay server components and only
 * carry data-attributes; this component attaches every scene. Unmounting reverts all of it
 * (tweens, ScrollTriggers, pins, splits, listeners).
 *
 * GSAP is fetched on the visitor's first interaction, not during page load. Every scene is
 * interaction-driven (scroll scenes need a scroll, pointer effects need a pointer, reveals
 * only touch content below the fold), so nothing is lost by waiting. On a throttled phone,
 * loading it during page load competed with hydration and pushed LCP from ~1.5s to 3.5s.
 */
export function MotionDirector() {
  useEffect(() => {
    let dispose: (() => void) | undefined;
    let cancelled = false;
    let started = false;

    const start = () => {
      if (started) return;
      started = true;
      removeWakeListeners();
      loadMotion()
        .then((lib) => {
          if (!cancelled) dispose = mountScenes(lib);
        })
        .catch(() => {
          // Motion is an enhancement; if the chunk fails the page is already complete.
        });
    };

    const removeWakeListeners = () => {
      for (const type of WAKE_EVENTS) window.removeEventListener(type, start);
    };
    for (const type of WAKE_EVENTS) window.addEventListener(type, start, { once: true, passive: true });
    // Page restored mid-scroll (back/forward, reload): the visitor is already interacting.
    if (window.scrollY > 0) start();

    return () => {
      cancelled = true;
      removeWakeListeners();
      dispose?.();
    };
  }, []);

  return null;
}
