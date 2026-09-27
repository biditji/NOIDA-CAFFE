import { claimCard } from "@/animations/scenes/claimCard";
import { heroScroll } from "@/animations/scenes/heroScroll";
import { imageReveal } from "@/animations/scenes/imageReveal";
import { marquee } from "@/animations/scenes/marquee";
import { menuStack } from "@/animations/scenes/menuStack";
import { magnetic, tilt } from "@/animations/scenes/pointer";
import { reveal } from "@/animations/scenes/reveal";
import { scrollProgress } from "@/animations/scenes/scrollProgress";
import { smoothScroll } from "@/animations/scenes/smoothScroll";
import { steps } from "@/animations/scenes/steps";
import { textReveal } from "@/animations/scenes/textReveal";
import type { Scene } from "@/animations/types";

/**
 * Order matters: the card stack switches its section to the (taller) stacked layout before
 * any trigger below it is created, so their positions already include its scroll runway.
 */
export const SCENES: Scene[] = [
  smoothScroll,
  menuStack,
  heroScroll,
  textReveal,
  reveal,
  steps,
  claimCard,
  imageReveal,
  marquee,
  scrollProgress,
  magnetic,
  tilt,
];
