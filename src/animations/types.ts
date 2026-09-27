import type { gsap as GSAP } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import type { SplitText as SplitTextType } from "gsap/SplitText";
import type { MQ } from "@/utils/media";

export interface MotionLib {
  gsap: typeof GSAP;
  ScrollTrigger: typeof ScrollTriggerType;
  SplitText: typeof SplitTextType;
}

/** Resolved gsap.matchMedia() conditions, one boolean per key in MQ. */
export type Conditions = Record<keyof typeof MQ, boolean>;

export interface SceneContext extends MotionLib {
  c: Conditions;
}

/**
 * A scene wires one behaviour to data-attributes in the server-rendered DOM.
 * Tweens, ScrollTriggers and SplitTexts it creates are reverted automatically by the
 * surrounding gsap.matchMedia(); anything else (DOM listeners, classes) goes in the
 * returned cleanup.
 */
export type Scene = (ctx: SceneContext) => void | (() => void);
