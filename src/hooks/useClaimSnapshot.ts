"use client";

import { useSyncExternalStore } from "react";
import { claimStore } from "@/lib/claimStore";

export function useClaimSnapshot() {
  return useSyncExternalStore(
    claimStore.subscribe,
    claimStore.getSnapshot,
    claimStore.getServerSnapshot,
  );
}
