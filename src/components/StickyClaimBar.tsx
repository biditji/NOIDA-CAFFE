"use client";

import { useEffect, useState } from "react";
import { ClaimLink } from "@/components/ClaimLink";
import { ArrowRight } from "@/components/Icons";
import { useClaimSnapshot } from "@/hooks/useClaimSnapshot";
import { OFFER } from "@/lib/campaign";

/**
 * Mobile-only CTA that appears once the hero button has scrolled away and disappears as soon
 * as the claim section is on screen, so it never covers the form it points to.
 * One IntersectionObserver, no scroll listeners.
 */
export function StickyClaimBar() {
  const [visible, setVisible] = useState(false);
  const claim = useClaimSnapshot();

  useEffect(() => {
    const heroCta = document.getElementById("hero-cta");
    const claimSection = document.getElementById("claim");
    if (!heroCta || !claimSection) return;

    let heroScrolledPast = false;
    let claimStillBelow = true;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const above = entry.boundingClientRect.top < 0;
        if (entry.target === heroCta) heroScrolledPast = !entry.isIntersecting && above;
        else claimStillBelow = !entry.isIntersecting && !above;
      }
      setVisible(heroScrolledPast && claimStillBelow);
    });

    observer.observe(heroCta);
    observer.observe(claimSection);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="sticky-bar md:hidden" data-visible={visible} inert={!visible}>
      <div className="sticky-bar-inner">
        <p className="sticky-bar-text">
          {claim ? (
            <>Your code: <strong className="font-mono">{claim.code}</strong></>
          ) : (
            <>
              <strong>{OFFER} off</strong> your next visit
            </>
          )}
        </p>
        <ClaimLink className="btn-primary btn-sm">
          <span className="btn-face">
            {claim ? "View code" : "Claim"}
            <ArrowRight width={18} height={18} />
          </span>
        </ClaimLink>
      </div>
    </div>
  );
}
