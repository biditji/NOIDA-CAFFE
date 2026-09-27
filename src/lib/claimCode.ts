import { CAMPAIGN } from "@/lib/campaign";

// 32 symbols with the look-alikes removed (0/O, 1/I), so a barista can read it off a phone.
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const encoder = new TextEncoder();

/**
 * Derives the claim code from the phone number with an HMAC instead of storing it.
 * The same number always gets the same code for this campaign, which makes repeat
 * submissions idempotent without a database. It is not a redemption ledger — see README.
 */
export async function createClaimCode(phone: string): Promise<string> {
  const secret = process.env.CLAIM_CODE_SECRET ?? "morrow-local-dev-secret";
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, encoder.encode(`${CAMPAIGN.id}:${phone}`)),
  );

  let suffix = "";
  for (let i = 0; i < 4; i++) suffix += ALPHABET[signature[i]! & 31];
  return `MORROW-${suffix}`;
}
