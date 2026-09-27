"use client";

import { Check, CopyIcon } from "@/components/Icons";
import { useClipboard } from "@/hooks/useClipboard";

export function CopyButton({ text }: { text: string }) {
  const { status, copy } = useClipboard();

  return (
    <>
      <button
        type="button"
        className="btn btn-primary btn-copy"
        data-status={status}
        onClick={() => copy(text)}
      >
        <span className="btn-face" aria-hidden={status === "copied" || undefined}>
          <CopyIcon />
          Copy code
        </span>
        <span className="btn-face btn-face-copied" aria-hidden={status !== "copied" || undefined}>
          <Check className="copy-check" />
          Copied
        </span>
      </button>
      <p className="sr-only" role="status">
        {status === "copied" && `Code ${text} copied to your clipboard.`}
        {status === "failed" && "Couldn't copy automatically. Please note the code down or take a screenshot."}
      </p>
      {status === "failed" && (
        <p className="text-sm text-roast">Couldn&apos;t copy — take a screenshot instead.</p>
      )}
    </>
  );
}
