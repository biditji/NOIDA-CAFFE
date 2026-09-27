import type { Scene } from "@/animations/types";

/**
 * The claim card rises out of the dark section and settles flat as it scrolls in. It is done
 * by "top 70%", so by the time a tap on a Claim button has scrolled the name field into view
 * (and the keyboard is up) the card has stopped moving under the visitor's finger.
 * The wrapper is animated, not .claim-card itself, which carries the view-transition name.
 */
export const claimCard: Scene = ({ gsap, c }) => {
  const card = document.querySelector<HTMLElement>("[data-claim-card]");
  if (!card || c.reduceMotion || card.getBoundingClientRect().top < window.innerHeight) return;

  gsap.fromTo(
    card,
    { y: c.mobile ? 56 : 80, rotation: c.mobile ? 1.5 : 2.5, scale: 0.95 },
    {
      y: 0,
      rotation: 0,
      scale: 1,
      ease: "power2.out",
      scrollTrigger: { trigger: card, start: "top bottom", end: "top 70%", scrub: 0.5 },
    },
  );
};
