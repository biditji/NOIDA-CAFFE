import { flushSync } from "react-dom";
import { prefersReducedMotion } from "@/utils/media";

/**
 * Runs a React state update inside a View Transition when the browser supports it and the
 * visitor hasn't asked for reduced motion. Everywhere else the update just happens and the
 * component's own CSS entrance takes over, so the result is identical either way.
 */
export function withViewTransition(update: () => void) {
  const doc = document as Document & {
    startViewTransition?: (callback: () => void) => unknown;
  };
  if (typeof doc.startViewTransition !== "function" || prefersReducedMotion()) {
    update();
    return;
  }
  doc.startViewTransition(() => flushSync(update));
}
