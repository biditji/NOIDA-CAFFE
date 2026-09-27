import { Clock, MapPin, MorrowMark } from "@/components/Icons";
import { ImageSlot } from "@/components/ImageSlot";
import { MEDIA } from "@/content/media";
import { CAMPAIGN } from "@/lib/campaign";

export function VisitUs() {
  return (
    // overflow-x-clip: the stamp's box grows as it turns and can poke past a 320px screen.
    <section aria-labelledby="visit-title" className="section overflow-x-clip">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 md:grid-cols-2 md:gap-12 md:px-8">
        <div className="visit-media">
          <ImageSlot
            media={MEDIA.interior}
            className="visit-media-main"
            sizes="(min-width: 1152px) 540px, (min-width: 768px) 46vw, calc(100vw - 40px)"
          />
          <ImageSlot
            media={MEDIA.coffee}
            className="visit-media-inset"
            reveal="float"
            sizes="(min-width: 768px) 200px, 38vw"
          />
          {/* Decorative (the address below says the same). The ring spins in CSS; GSAP only
              owns the stamp's entrance, on the outer element. */}
          <div className="visit-stamp" data-stamp aria-hidden="true">
            <svg className="visit-stamp-ring" viewBox="0 0 100 100">
              <path id="visit-stamp-path" d="M50 50m-37 0a37 37 0 1 1 74 0a37 37 0 1 1-74 0" fill="none" />
              <text textLength="226" lengthAdjust="spacing">
                <textPath href="#visit-stamp-path">
                  {CAMPAIGN.cafe} • {CAMPAIGN.area.replace(", ", " • ")} •
                </textPath>
              </text>
            </svg>
            <MorrowMark className="visit-stamp-mark" />
          </div>
        </div>

        <div>
          <p className="section-kicker">Come say hello</p>
          <h2 id="visit-title" className="section-title" data-split>
            Find us in {CAMPAIGN.area.split(",")[0]}.
          </h2>
          <dl className="visit-details">
            <div data-reveal>
              <dt>
                <MapPin width={18} height={18} /> Address
              </dt>
              <dd>
                {CAMPAIGN.cafe}
                <br />
                {CAMPAIGN.address}
              </dd>
            </div>
            <div data-reveal>
              <dt>
                <Clock width={18} height={18} /> Hours
              </dt>
              <dd>{CAMPAIGN.hours}</dd>
            </div>
          </dl>
          <a
            className="btn btn-outline mt-7"
            href={CAMPAIGN.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-reveal
          >
            <span className="btn-face">
              <MapPin />
              Get directions
              <span className="sr-only">(opens Google Maps in a new tab)</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
