/** Request body for POST /api/claim — exactly the assignment contract. */
export interface ClaimRequest {
  name: string;
  phone: string;
}

/** Success response — exactly the assignment contract. */
export interface ClaimSuccess {
  success: true;
  claimCode: string;
  message: string;
}

/** Error response — exactly the assignment contract. */
export interface ClaimError {
  success: false;
  message: string;
}

export type ClaimResponse = ClaimSuccess | ClaimError;

/** Why a claim attempt failed, as seen by the UI. Drives the copy we show. */
export type ClaimFailureReason = "rejected" | "server" | "network" | "offline" | "timeout";

export type ClaimResult =
  | { ok: true; data: ClaimSuccess }
  | { ok: false; reason: ClaimFailureReason; message: string };

export type ClaimField = keyof ClaimRequest;
export type FieldErrors = Partial<Record<ClaimField, string>>;

/** A claim the visitor has already made on this device. */
export interface StoredClaim {
  code: string;
  phoneLast4: string;
  claimedAt: number;
}
