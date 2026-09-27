import { CLAIM_GENERIC_ERROR } from "@/lib/campaign";
import type { ClaimError, ClaimRequest, ClaimResult, ClaimSuccess } from "@/types/claim";

const TIMEOUT_MS = 12_000;

export type DemoScenario = "slow" | "error";

function isClaimSuccess(value: unknown): value is ClaimSuccess {
  const v = value as Partial<ClaimSuccess> | null;
  return (
    typeof v === "object" &&
    v !== null &&
    v.success === true &&
    typeof v.claimCode === "string" &&
    v.claimCode.length > 0 &&
    typeof v.message === "string"
  );
}

function isClaimError(value: unknown): value is ClaimError {
  const v = value as Partial<ClaimError> | null;
  return typeof v === "object" && v !== null && v.success === false && typeof v.message === "string";
}

/**
 * The full request lifecycle for a claim: timeout, network failure, non-JSON and
 * off-contract responses all collapse into a typed ClaimResult the UI can render.
 */
export async function postClaim(
  body: ClaimRequest,
  options: { signal?: AbortSignal; scenario?: DemoScenario } = {},
): Promise<ClaimResult> {
  const timeout = AbortSignal.timeout(TIMEOUT_MS);
  const signal = options.signal ? AbortSignal.any([options.signal, timeout]) : timeout;

  let response: Response;
  try {
    response = await fetch("/api/claim", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(options.scenario ? { "x-demo-scenario": options.scenario } : {}),
      },
      body: JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (timeout.aborted) return { ok: false, reason: "timeout", message: CLAIM_GENERIC_ERROR };
    if (options.signal?.aborted) throw error;
    const offline = typeof navigator !== "undefined" && navigator.onLine === false;
    return { ok: false, reason: offline ? "offline" : "network", message: CLAIM_GENERIC_ERROR };
  }

  const data: unknown = await response.json().catch(() => null);

  if (response.ok && isClaimSuccess(data)) return { ok: true, data };
  if (isClaimError(data)) {
    return {
      ok: false,
      reason: response.status >= 500 ? "server" : "rejected",
      message: data.message,
    };
  }
  return { ok: false, reason: "server", message: CLAIM_GENERIC_ERROR };
}

/** Reads `?demo=slow|error` so reviewers can see non-happy states on the live URL. */
export function readDemoScenario(): DemoScenario | undefined {
  if (typeof window === "undefined") return undefined;
  const value = new URLSearchParams(window.location.search).get("demo");
  return value === "slow" || value === "error" ? value : undefined;
}
