import type { Scene } from "@/animations/types";

/**
 * The "Find us" map assembles as it scrolls in: the blocks pop up, the route draws itself
 * from the map's edge to the café, the pin drops onto the door, then the label and the
 * scooter appear. The CSS default is the finished map, which is also the reduced-motion
 * state, and it's left alone if it's already on screen when motion loads. The idle loops
 * (bobbing pin, clouds, traffic) belong to CSS and SMIL and are never touched here.
 */
export const miniMap: Scene = ({ gsap, c }) => {
  const map = document.querySelector<SVGSVGElement>("[data-mini-map]");
  if (!map || c.reduceMotion || map.getBoundingClientRect().top < window.innerHeight) return;

  const q = gsap.utils.selector(map);
  const routes = q<SVGPathElement>("[data-map-route]");
  const length = routes[0]?.getTotalLength() ?? 0;

  gsap
    .timeline({ scrollTrigger: { trigger: map, start: "top 80%", once: true } })
    .from(q("[data-map-block]"), {
      autoAlpha: 0,
      scale: 0.4,
      transformOrigin: "50% 50%",
      duration: 0.5,
      ease: "back.out(2)",
      stagger: { each: 0.03, from: "random" },
    })
    .fromTo(
      routes,
      { strokeDasharray: length, strokeDashoffset: length },
      { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" },
      0.35,
    )
    .from(q("[data-map-pin]"), { y: -70, autoAlpha: 0, duration: 0.8, ease: "bounce.out" }, "-=0.35")
    .from(q("[data-map-label]"), { autoAlpha: 0, x: -10, duration: 0.4 }, "-=0.3")
    .from(q("[data-map-rider]"), { autoAlpha: 0, duration: 0.3 }, "<");
};
