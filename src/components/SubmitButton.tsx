import { ArrowRight } from "@/components/Icons";

interface SubmitButtonProps {
  busy: boolean;
  label: string;
  busyLabel: string;
}

/**
 * Uses aria-disabled rather than `disabled` while busy: the button keeps focus (a real
 * disabled button drops it to <body>), screen readers hear "dimmed/unavailable", and the
 * submit handler ignores it. Both labels share one grid cell so the width never jumps.
 */
export function SubmitButton({ busy, label, busyLabel }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className="btn btn-primary btn-submit w-full"
      aria-disabled={busy || undefined}
      data-busy={busy || undefined}
    >
      <span className="btn-face" aria-hidden={busy || undefined}>
        {label}
        <ArrowRight className="btn-arrow" />
      </span>
      <span className="btn-face btn-face-busy" aria-hidden={!busy || undefined}>
        <span className="spinner" />
        {busyLabel}
      </span>
    </button>
  );
}
