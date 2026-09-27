"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { claimStore } from "@/lib/claimStore";
import { withViewTransition } from "@/lib/viewTransition";
import { postClaim, readDemoScenario } from "@/services/claimApi";
import type { ClaimFailureReason, ClaimRequest } from "@/types/claim";

/** The request half of the flow. Success lives in claimStore, so it survives reloads. */
export type RequestState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; reason: ClaimFailureReason; message: string };

type Action =
  | { type: "submit" }
  | { type: "fail"; reason: ClaimFailureReason; message: string }
  | { type: "reset" };

function reducer(state: RequestState, action: Action): RequestState {
  switch (action.type) {
    case "submit":
      return { status: "submitting" };
    case "fail":
      return { status: "error", reason: action.reason, message: action.message };
    case "reset":
      return state.status === "idle" ? state : { status: "idle" };
  }
}

export function useClaim() {
  const [state, dispatch] = useReducer(reducer, { status: "idle" });
  const inFlight = useRef<AbortController | null>(null);

  useEffect(() => () => inFlight.current?.abort(), []);

  const submit = useCallback(async (body: ClaimRequest) => {
    if (inFlight.current) return; // double tap / double Enter guard
    const controller = new AbortController();
    inFlight.current = controller;
    dispatch({ type: "submit" });

    try {
      const result = await postClaim(body, {
        signal: controller.signal,
        scenario: readDemoScenario(),
      });
      if (controller.signal.aborted) return;

      if (result.ok) {
        withViewTransition(() => {
          dispatch({ type: "reset" });
          claimStore.save({
            code: result.data.claimCode,
            phoneLast4: body.phone.slice(-4),
            claimedAt: Date.now(),
          });
        });
      } else {
        dispatch({ type: "fail", reason: result.reason, message: result.message });
      }
    } catch {
      // Only reached when the component unmounted mid-request; nothing to update.
    } finally {
      if (inFlight.current === controller) inFlight.current = null;
    }
  }, []);

  const clearError = useCallback(() => dispatch({ type: "reset" }), []);

  return { state, submit, clearError };
}
