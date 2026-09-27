/** Media queries shared by CSS-adjacent code and the GSAP matchMedia conditions. */
export const MQ = {
  mobile: "(max-width: 767px)",
  tablet: "(min-width: 768px) and (max-width: 1023px)",
  desktop: "(min-width: 1024px)",
  finePointer: "(hover: hover) and (pointer: fine)",
  reduceMotion: "(prefers-reduced-motion: reduce)",
} as const;

export function matches(query: string): boolean {
  return typeof window !== "undefined" && window.matchMedia(query).matches;
}

export const prefersReducedMotion = () => matches(MQ.reduceMotion);
