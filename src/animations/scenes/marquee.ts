import type { Scene } from "@/animations/types";

/**
 * The ribbon's loop is a plain CSS animation. Here we grab it via the Web Animations API
 * and steer its playbackRate with scroll velocity (faster when flicking, reversed when
 * scrolling up), plus a skew that leans with the flick. It pauses entirely while off screen.
 */
export const marquee: Scene = ({ gsap, ScrollTrigger, c }) => {
  const root = document.querySelector<HTMLElement>("[data-marquee]");
  const skewLayer = root?.querySelector<HTMLElement>("[data-marquee-skew]");
  const loop = root?.querySelector<HTMLElement>("[data-marquee-track]")?.getAnimations?.()[0];
  if (!root || !skewLayer || !loop || c.reduceMotion) return;

  const speed = { rate: 1 };
  const setRate = gsap.quickTo(speed, "rate", {
    duration: 0.8,
    ease: "power3.out",
    onUpdate: () => {
      loop.playbackRate = speed.rate;
    },
  });
  const setSkew = gsap.quickTo(skewLayer, "skewX", { duration: 0.6, ease: "power3.out" });
  // Touch flicks are much faster than wheel scrolls, so phones get a gentler lean.
  const maxSkew = c.finePointer ? 8 : 5;

  let direction = 1;
  const settle = gsap.delayedCall(0.2, () => {
    setRate(direction);
    setSkew(0);
  });
  settle.pause();

  ScrollTrigger.create({
    trigger: root,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
    onUpdate: (self) => {
      const velocity = self.getVelocity();
      direction = self.direction;
      setRate(direction * (1 + gsap.utils.clamp(0, 5, Math.abs(velocity) / 600)));
      setSkew(gsap.utils.clamp(-maxSkew, maxSkew, -velocity / 300));
      settle.restart(true);
    },
  });

  return () => {
    settle.kill();
    loop.playbackRate = 1;
    loop.play();
  };
};
