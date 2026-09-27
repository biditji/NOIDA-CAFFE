"use client";

import { useEffect, useRef } from "react";
import { CopyButton } from "@/components/CopyButton";
import { MapPin } from "@/components/Icons";
import { CAMPAIGN, MIN_BILL, OFFER } from "@/lib/campaign";
import type { ClaimSnapshot } from "@/lib/claimStore";

const dateFormat = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });

interface SuccessTicketProps {
  claim: ClaimSnapshot;
  onReset: () => void;
}

export function SuccessTicket({ claim, onReset }: SuccessTicketProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const validUntil = dateFormat.format(claim.claimedAt + CAMPAIGN.validityDays * 86_400_000);

  // Move focus to the result only when it was just claimed; a restored claim on page load
  // must not steal focus from wherever the visitor is.
  useEffect(() => {
    if (claim.fresh) headingRef.current?.focus({ preventScroll: true });
  }, [claim.fresh]);

  return (
    <div className="success" data-fresh={claim.fresh || undefined}>
      <div className="success-badge" aria-hidden="true">
        <svg viewBox="0 0 52 52" width="52" height="52">
          <circle className="success-badge-ring" cx="26" cy="26" r="24" />
          <path className="success-badge-check" d="M15 27l7 7 15-16" />
        </svg>
      </div>

      <p className="success-kicker">
        {claim.fresh ? "You're all set" : "Welcome back — your code is saved on this phone"}
      </p>
      <h3 id="success-title" ref={headingRef} tabIndex={-1} className="success-title" data-claim-focus>
        {OFFER} OFF claimed
      </h3>

      <div className="success-ticket">
        <p className="success-code-label" id="claim-code-label">
          Your code
        </p>
        <p className="success-code" aria-labelledby="claim-code-label">
          <span className="sr-only">{claim.code}</span>
          <span aria-hidden="true">
            {Array.from(claim.code).map((char, i) => (
              <span key={i} className="code-char" style={{ "--i": i } as React.CSSProperties}>
                {char}
              </span>
            ))}
          </span>
        </p>
        <p className="success-instruction">
          Show this code at the counter when you visit {CAMPAIGN.cafe}.
        </p>
      </div>

      <div className="success-actions">
        <CopyButton text={claim.code} />
        <a className="btn btn-ghost" href={CAMPAIGN.directionsUrl} target="_blank" rel="noopener noreferrer">
          <span className="btn-face">
            <MapPin />
            Get directions
            <span className="sr-only">(opens Google Maps in a new tab)</span>
          </span>
        </a>
      </div>

      <ul className="success-notes">
        <li>
          Valid until <strong>{validUntil}</strong> on bills of {MIN_BILL} or more.
        </li>
        <li>
          Linked to your number ending <strong>{claim.phoneLast4}</strong>. Lost the code? Claim again with
          the same number and you&apos;ll get the same code back.
        </li>
        <li>Tip: take a screenshot so it&apos;s handy at the counter.</li>
      </ul>

      <button type="button" className="link-button" onClick={onReset}>
        Not your number? Claim with a different one
      </button>
    </div>
  );
}
