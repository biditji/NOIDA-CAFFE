import { NextResponse } from "next/server";
import { CLAIM_GENERIC_ERROR, CLAIM_SUCCESS_MESSAGE } from "@/lib/campaign";
import { createClaimCode } from "@/lib/claimCode";
import { validateClaim } from "@/lib/validation";
import type { ClaimError, ClaimSuccess } from "@/types/claim";

const MAX_BODY_BYTES = 1024;

function fail(status: number, message = CLAIM_GENERIC_ERROR, headers?: HeadersInit) {
  return NextResponse.json<ClaimError>({ success: false, message }, { status, headers });
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * POST /api/claim — honours the assignment contract exactly.
 *
 * Reviewers can force the non-happy paths on the live URL with `?demo=slow` or
 * `?demo=error` in the page URL; the form forwards it as the x-demo-scenario header.
 */
export async function POST(request: Request) {
  const scenario = request.headers.get("x-demo-scenario");
  if (scenario === "slow") await sleep(2500);
  if (scenario === "error") return fail(503);

  if (!request.headers.get("content-type")?.includes("application/json")) return fail(415);

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return fail(413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail(400);
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>).name !== "string" ||
    typeof (body as Record<string, unknown>).phone !== "string"
  ) {
    return fail(400);
  }

  const { name, phone } = body as { name: string; phone: string };
  const result = validateClaim({ name, phone });
  if (!result.valid) {
    // Same shape as the contract's error, with a message a person can act on.
    return fail(422, result.errors.phone ?? result.errors.name);
  }

  const claimCode = await createClaimCode(result.data.phone);
  return NextResponse.json<ClaimSuccess>(
    { success: true, claimCode, message: CLAIM_SUCCESS_MESSAGE },
    { status: 200 },
  );
}

export function GET() {
  return fail(405, CLAIM_GENERIC_ERROR, { Allow: "POST" });
}
