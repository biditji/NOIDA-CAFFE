import { ClaimForm } from "@/components/ClaimForm";
import { OFFER, TERMS } from "@/lib/campaign";

/**
 * Server-rendered frame around the one interactive island that matters: the form.
 * Source order is intro → form → fine print, so on a phone the form comes straight after the
 * heading instead of below five lines of terms. From lg the terms move under the intro in
 * the left column and the form takes the right.
 */
export function ClaimSection() {
  return (
    <section id="claim" aria-labelledby="claim-title" className="claim section theme-dark">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 md:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-0">
        <div className="lg:col-start-1 lg:row-start-1">
          <p className="section-kicker text-apricot">Claim your offer</p>
          <h2 id="claim-title" className="section-title text-cream" data-split>
            {OFFER} off, saved to your phone.
          </h2>
          <p className="mt-4 max-w-md text-sand">
            Fill in two fields and your code appears instantly. Nothing to download, nothing to verify.
          </p>
        </div>

        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1" data-claim-card>
          <ClaimForm />
        </div>

        <div className="claim-terms lg:col-start-1 lg:row-start-2">
          <h3 className="claim-terms-title">The fine print</h3>
          <ul className="claim-terms-list">
            {TERMS.map((term) => (
              <li key={term} data-reveal>
                {term}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
