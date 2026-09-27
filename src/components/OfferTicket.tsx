import { CAMPAIGN } from "@/lib/campaign";

/**
 * The hero's coupon. Purely visual (the same facts are in the hero copy), so it is hidden
 * from assistive tech. Layers are split so each transform has exactly one owner:
 *   [data-hero-visual] → GSAP scroll   .hero-ticket-in → CSS entrance
 *   [data-tilt]        → pointer area, plus the CSS idle float (the `translate` property)
 *   [data-tilt-inner]  → GSAP tilt     .offer-ticket-sheen → CSS sweep (`translate`)
 */
export function OfferTicket() {
  return (
    <div className="offer-ticket-wrap" data-tilt aria-hidden="true">
      <div className="offer-ticket-shadow" />
      <div className="offer-ticket" data-tilt-inner>
        <div className="offer-ticket-main">
          <p className="offer-ticket-kicker">
            {CAMPAIGN.cafe} · {CAMPAIGN.area.split(",")[0]}
          </p>
          <p className="offer-ticket-amount">
            <span className="offer-ticket-rupee">₹</span>
            {CAMPAIGN.offerAmount}
            <span className="offer-ticket-off">OFF</span>
          </p>
          <p className="offer-ticket-sub">your next visit</p>
          <div className="offer-ticket-row">
            <span>Code</span>
            <span className="font-mono tracking-widest">MORROW-····</span>
          </div>
        </div>
        <div className="offer-ticket-stub">
          <span className="offer-ticket-barcode" />
          <span className="offer-ticket-stub-text">Scan · Claim · Sip</span>
        </div>
        <div className="offer-ticket-sheen" />
        <div className="offer-ticket-glare" />
      </div>
    </div>
  );
}
