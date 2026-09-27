import { MotionDirector } from "@/animations/MotionDirector";
import { StickyClaimBar } from "@/components/StickyClaimBar";
import { ClaimSection } from "@/sections/ClaimSection";
import { Hero } from "@/sections/Hero";
import { HowItWorks } from "@/sections/HowItWorks";
import { Marquee } from "@/sections/Marquee";
import { MenuHighlights } from "@/sections/MenuHighlights";
import { SiteFooter } from "@/sections/SiteFooter";
import { SiteHeader } from "@/sections/SiteHeader";
import { VisitUs } from "@/sections/VisitUs";

/**
 * Statically rendered at build time. The only client components are the claim form,
 * the claim links, the sticky mobile bar and the motion director. Everything else ships
 * as HTML with no component JavaScript.
 */
export default function Page() {
  return (
    <>
      <a href="#claim" className="skip-link">
        Skip to the claim form
      </a>
      <div className="scroll-progress" data-scroll-progress aria-hidden="true" />

      <SiteHeader />
      <main>
        <Hero />
        <Marquee />
        <HowItWorks />
        <MenuHighlights />
        <ClaimSection />
        <VisitUs />
      </main>
      <SiteFooter />

      <StickyClaimBar />
      <MotionDirector />
    </>
  );
}
