import { CAMPAIGN, OFFER } from "@/lib/campaign";

const ITEMS = [
  { name: "Flat white", note: "Double ristretto, silky whole milk.", price: 220, tag: "Most ordered", tone: "crema" },
  { name: "Filter kaapi", note: "Chicory blend, brewed slow, served in a dabara.", price: 160, tag: "Local favourite", tone: "kaapi" },
  { name: "Cardamom bun", note: "Laminated dough, brown butter, green cardamom sugar.", price: 180, tag: "From our oven", tone: "bun" },
  { name: "Cold brew tonic", note: "18-hour cold brew over tonic and orange peel.", price: 240, tag: "For hot afternoons", tone: "tonic" },
  { name: "Morrow breakfast", note: "Sourdough, eggs your way, greens, house chutney.", price: 420, tag: "Weekends till 1 pm", tone: "brunch" },
] as const;

const rupees = (n: number) => `₹${n}`;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "Why should I claim it?" answered with the menu: what ₹150 actually buys.
 * Default (reduced motion, no JS): a native swipe row with scroll-snap.
 * With motion: the stage turns into a sticky deck and each card stacks onto the last as you
 * scroll, its price counting down to the offer price as it lands (animations/scenes/menuStack).
 */
export function MenuHighlights() {
  return (
    <section
      aria-labelledby="menu-title"
      className="menu section"
      style={{ "--stack-steps": ITEMS.length } as React.CSSProperties}
      data-stack
    >
      <div className="menu-body">
        <div className="menu-intro">
          <p className="section-kicker">Why it&apos;s worth the trip</p>
          <div className="menu-intro-row">
            <h2 id="menu-title" className="section-title max-w-[14ch]" data-split>
              What your {OFFER} gets you.
            </h2>
            <p className="menu-lede">
              Morrow is a neighbourhood coffee house in {CAMPAIGN.area.split(",")[0]} — slow mornings,
              single-origin brews and bakes out of our own oven. A few favourites, with your offer applied:
            </p>
          </div>
        </div>

        <div
          className="menu-viewport"
          role="region"
          aria-label="Menu highlights, scrolls sideways"
          tabIndex={0}
          data-stack-stage
        >
          <div className="menu-deck-meta" aria-hidden="true">
            <span className="menu-deck-count">
              <span className="menu-deck-current" data-stack-count>
                {pad(1)}
              </span>{" "}
              / {pad(ITEMS.length)}
            </span>
            <span className="menu-deck-bar">
              <span className="menu-deck-bar-fill" data-stack-bar />
            </span>
          </div>

          <ul className="menu-track" data-stack-deck>
            {ITEMS.map((item) => {
              const after = Math.max(0, item.price - CAMPAIGN.offerAmount);
              return (
                <li key={item.name} className={`menu-card menu-card-${item.tone}`} data-stack-card>
                  <div className="menu-card-art" aria-hidden="true">
                    <span className="menu-card-orb" data-stack-orb />
                    <span className="menu-card-stamp" data-stack-stamp>
                      {OFFER}
                      <small>off</small>
                    </span>
                  </div>
                  <p className="menu-card-tag">{item.tag}</p>
                  <h3 className="menu-card-name">{item.name}</h3>
                  <p className="menu-card-note">{item.note}</p>
                  <p className="menu-card-price">
                    <span className="menu-card-was">
                      <span className="sr-only">Menu price </span>
                      <s>{rupees(item.price)}</s>
                      <span className="menu-card-strike" aria-hidden="true" data-stack-strike />
                    </span>
                    <span className="menu-card-now" data-stack-now>
                      <span className="sr-only">{rupees(after)} </span>
                      {/* The visible number counts down from the menu price as the card lands. */}
                      <span aria-hidden="true">
                        ₹<span data-stack-num data-from={item.price}>{after}</span>
                      </span>
                      <small>with your code</small>
                    </span>
                  </p>
                  <span className="menu-card-shade" aria-hidden="true" data-stack-shade />
                </li>
              );
            })}
          </ul>
        </div>

        {/* Empty scroll length the sticky stage rides over while the cards stack. */}
        <div className="menu-runway" aria-hidden="true" data-stack-runway />
      </div>
    </section>
  );
}
