/** Single source of truth for campaign facts used across the page, API and success state. */
export const CAMPAIGN = {
  id: "morrow-150-2026",
  cafe: "Morrow Café",
  area: "Sector 104, Noida",
  address: "Ground floor, Sector 104, Noida, Uttar Pradesh",
  hours: "Open daily, 8 am – 11 pm",
  offerAmount: 150,
  minBill: 499,
  validityDays: 30,
  directionsUrl: "https://www.google.com/maps/search/?api=1&query=Sector+104+Noida",
} as const;

/**
 * Pre-joined labels. Writing ₹{amount} in JSX makes two text nodes ("₹" and "150"), and a
 * line can break between them (SplitText did exactly that). One string keeps them together.
 */
export const OFFER = `₹${CAMPAIGN.offerAmount}`;
export const MIN_BILL = `₹${CAMPAIGN.minBill}`;

export const TERMS = [
  `${OFFER} off on a bill of ${MIN_BILL} or more.`,
  "One claim per mobile number.",
  `Use it within ${CAMPAIGN.validityDays} days of claiming.`,
  `Dine-in or takeaway at ${CAMPAIGN.cafe}, ${CAMPAIGN.area}.`,
  "Can't be combined with other offers or exchanged for cash.",
] as const;

export const CLAIM_SUCCESS_MESSAGE = "Your offer has been claimed.";
export const CLAIM_GENERIC_ERROR = "Unable to process your request.";
