import { ClaimLink } from "@/components/ClaimLink";
import { ArrowRight, Check } from "@/components/Icons";
import { OfferTicket } from "@/components/OfferTicket";
import { CAMPAIGN, OFFER } from "@/lib/campaign";

const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

/**
 * Above the fold on a phone: who this is from, the offer, what it takes, the button,
 * and the reassurance that answers "what happens next". The entrance is CSS-only so the
 * first paint never waits on JavaScript, and the headline (the LCP element) doesn't animate.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-x-clip" data-hero>
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 pt-7 pb-14 md:px-8 md:pt-12 md:pb-20 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-14 lg:pt-16 lg:pb-28">
        <div>
          <p className="hero-rise eyebrow" style={i(1)}>
            <span className="eyebrow-dot" aria-hidden="true" />
            Thanks for scanning
          </p>

          <h1 id="hero-title" className="hero-title">
            <span className="hero-title-line">
              Get <span className="rupee-num">{OFFER}</span> off
            </span>
            <span className="hero-title-line">your next visit.</span>
          </h1>

          <p className="hero-rise hero-lede" style={i(3)}>
            Claim it in about ten seconds with your name and number. You&apos;ll get a code on this
            screen — show it at the counter next time you&apos;re at {CAMPAIGN.cafe}.
          </p>

          <div className="hero-rise mt-7 flex flex-col gap-4 sm:flex-row sm:items-center" style={i(4)}>
            <span data-magnetic className="inline-flex">
              <ClaimLink id="hero-cta" className="btn-primary btn-lg btn-shine w-full sm:w-auto">
                <span className="btn-face">
                  Claim {OFFER} OFF
                  <ArrowRight className="btn-arrow" />
                </span>
              </ClaimLink>
            </span>
            <ul className="hero-assurances" aria-label="What to expect">
              <li>
                <Check width={16} height={16} /> No app
              </li>
              <li>
                <Check width={16} height={16} /> No OTP
              </li>
              <li>
                <Check width={16} height={16} /> Code in seconds
              </li>
            </ul>
          </div>
        </div>

        <div className="hero-visual" data-hero-visual>
          <div className="hero-ticket-in">
            <OfferTicket />
          </div>
        </div>
      </div>
    </section>
  );
}
