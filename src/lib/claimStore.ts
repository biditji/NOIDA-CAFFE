import { CAMPAIGN } from "@/lib/campaign";
import type { StoredClaim } from "@/types/claim";

/**
 * The visitor's claim, remembered on this device so the code is still there when they
 * reopen the page at the counter. A tiny external store read via useSyncExternalStore,
 * shared by the claim form and the sticky mobile CTA.
 */

const STORAGE_KEY = "morrow:claim:v1";
const MAX_AGE_MS = CAMPAIGN.validityDays * 24 * 60 * 60 * 1000;

export interface ClaimSnapshot extends StoredClaim {
  /** True only for a claim made in this page session — drives focus and entrance animation. */
  fresh: boolean;
}

let snapshot: ClaimSnapshot | null = null;
let hydrated = false;
const listeners = new Set<() => void>();

function isStoredClaim(value: unknown): value is StoredClaim {
  const v = value as Partial<StoredClaim> | null;
  return (
    typeof v === "object" &&
    v !== null &&
    typeof v.code === "string" &&
    typeof v.phoneLast4 === "string" &&
    typeof v.claimedAt === "number"
  );
}

function readStorage(): ClaimSnapshot | null {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
    if (!isStoredClaim(parsed) || Date.now() - parsed.claimedAt > MAX_AGE_MS) return null;
    return { ...parsed, fresh: false };
  } catch {
    return null;
  }
}

function emit() {
  for (const listener of listeners) listener();
}

export const claimStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): ClaimSnapshot | null {
    if (!hydrated) {
      hydrated = true;
      snapshot = readStorage();
    }
    return snapshot;
  },
  getServerSnapshot(): ClaimSnapshot | null {
    return null;
  },
  save(claim: StoredClaim) {
    snapshot = { ...claim, fresh: true };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(claim));
    } catch {
      // Private mode or storage disabled: the code is still on screen, just not remembered.
    }
    emit();
  },
  clear() {
    snapshot = null;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing to clean up.
    }
    emit();
  },
};
