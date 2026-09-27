import Image from "next/image";
import type { MediaSlot } from "@/content/media";
import { cn } from "@/utils/cn";

interface ImageSlotProps {
  media: MediaSlot;
  sizes: string;
  className?: string;
  /** "clip": the frame opens from an inset. "float": a print that rises and turns past it. */
  reveal?: "clip" | "float";
}

/**
 * A fixed-ratio frame (no layout shift) that holds either an optimised photo or, until one
 * is supplied, a CSS illustration. `data-image-reveal` / `data-parallax` are hooks for the
 * motion layer; without it the image simply sits there.
 */
export function ImageSlot({ media, sizes, className, reveal = "clip" }: ImageSlotProps) {
  return (
    <figure
      className={cn("image-slot", className)}
      style={{ aspectRatio: media.aspect }}
      data-image-reveal={reveal}
    >
      <div className="image-slot-media" data-parallax>
        {media.src ? (
          <Image src={media.src} alt={media.alt} fill sizes={sizes} className="object-cover" />
        ) : (
          <div className={`art art-${media.art}`} aria-hidden="true">
            <span className="art-light art-light-1" />
            <span className="art-light art-light-2" />
            <span className="art-light art-light-3" />
            <span className="art-shape" />
          </div>
        )}
      </div>
    </figure>
  );
}
