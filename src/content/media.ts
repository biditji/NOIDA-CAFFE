/**
 * Photo slots. To use real photos, drop the files in /public/images and set `src`
 * (e.g. "/images/interior.webp"). next/image then serves AVIF/WebP at the right width.
 * While `src` is null the slot renders a CSS-only illustration instead.
 */
export interface MediaSlot {
  src: string | null;
  alt: string;
  /** CSS aspect-ratio, reserved up front so nothing shifts when the image loads. */
  aspect: string;
  art: "interior" | "coffee";
}

export const MEDIA = {
  interior: {
    src: "/images/interior.webp",
    alt: "Inside Morrow Café: warm pendant lights over the coffee counter, a chalkboard menu, a fig tree, and white wire chairs with cushions.",
    aspect: "16 / 11",
    art: "interior",
  },
  coffee: {
    src: "/images/coffee.webp",
    alt: "Three flat whites with heart latte art on a wooden table, surrounded by plants.",
    aspect: "2 / 3",
    art: "coffee",
  },
} satisfies Record<string, MediaSlot>;
