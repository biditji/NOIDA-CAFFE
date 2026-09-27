import { CAMPAIGN } from "@/lib/campaign";

const ITEMS = [
  `₹${CAMPAIGN.offerAmount} off your next visit`,
  "Single-origin pour-overs",
  "Filter kaapi, slow brewed",
  "Bakes out of our own oven",
  CAMPAIGN.area,
  CAMPAIGN.hours,
];

/**
 * Decorative ribbon (all of this is said elsewhere on the page), so it is aria-hidden.
 * The loop is a CSS animation; the motion layer only nudges its playbackRate and skew
 * with scroll velocity through the Web Animations API.
 */
export function Marquee() {
  const row = ITEMS.map((item) => (
    <span key={item} className="marquee-item">
      {item}
      <span className="marquee-star">✺</span>
    </span>
  ));

  return (
    <div className="marquee" aria-hidden="true" data-marquee>
      <div className="marquee-skew" data-marquee-skew>
        <div className="marquee-track" data-marquee-track>
          <div className="marquee-row">{row}</div>
          <div className="marquee-row">{row}</div>
        </div>
      </div>
    </div>
  );
}
