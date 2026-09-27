import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import { AlertCircle, Check } from "@/components/Icons";

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "prefix"> {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  valid?: boolean;
  prefix?: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

/**
 * Label, hint, input and error wired together with aria-describedby so the hint and any
 * error are read out when the field gets focus.
 */
export function Field({ id, label, hint, error, valid, prefix, ...inputProps }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="field" data-invalid={error ? "" : undefined} data-valid={valid ? "" : undefined}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      )}
      <div className="field-control">
        {prefix && (
          <span className="field-prefix" aria-hidden="true">
            {prefix}
          </span>
        )}
        <input
          id={id}
          className="field-input"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...inputProps}
        />
        <Check className="field-valid-icon" width={18} height={18} />
      </div>
      {error && (
        <p id={errorId} className="field-error">
          <AlertCircle width={16} height={16} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
