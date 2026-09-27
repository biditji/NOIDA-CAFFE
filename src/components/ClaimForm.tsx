"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Field } from "@/components/Field";
import { AlertCircle } from "@/components/Icons";
import { SubmitButton } from "@/components/SubmitButton";
import { SuccessTicket } from "@/components/SuccessTicket";
import { useClaim } from "@/hooks/useClaim";
import { useClaimSnapshot } from "@/hooks/useClaimSnapshot";
import { OFFER } from "@/lib/campaign";
import { claimStore } from "@/lib/claimStore";
import { validateClaim } from "@/lib/validation";
import type { ClaimFailureReason, ClaimField, ClaimRequest } from "@/types/claim";

const EMPTY: ClaimRequest = { name: "", phone: "" };

/** Turns a failure into something a person at a café table can act on. */
function failureCopy(reason: ClaimFailureReason, message: string) {
  switch (reason) {
    case "rejected":
      return { title: "Please check your details", body: message };
    case "offline":
      return {
        title: "You seem to be offline",
        body: "Check your connection and try again — your details are still filled in.",
      };
    case "timeout":
      return {
        title: "That took too long",
        body: "The connection is slow right now. Your details are still here, so just try again.",
      };
    case "network":
      return {
        title: "We couldn't reach Morrow",
        body: "Something interrupted the connection. Your details are still here — please try again.",
      };
    case "server":
      return {
        title: message,
        body: "It's a problem on our side, not yours. Please try again in a moment.",
      };
  }
}

export function ClaimForm() {
  const claim = useClaimSnapshot();
  const { state, submit, clearError } = useClaim();
  const [values, setValues] = useState<ClaimRequest>(EMPTY);
  const [touched, setTouched] = useState<Record<ClaimField, boolean>>({ name: false, phone: false });
  const [attempted, setAttempted] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const busy = state.status === "submitting";
  const { errors } = validateClaim(values);
  const visibleError = (field: ClaimField) => (touched[field] || attempted ? errors[field] : undefined);

  const onChange = (field: ClaimField) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = field === "phone" ? event.target.value.replace(/[^\d\s()+-]/g, "") : event.target.value;
    setValues((current) => ({ ...current, [field]: value }));
    if (state.status === "error") clearError();
  };

  const onBlur = (field: ClaimField) => () => {
    if (values[field]) setTouched((current) => (current[field] ? current : { ...current, [field]: true }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setAttempted(true);

    const result = validateClaim(values);
    if (!result.valid) {
      // Send focus to the first problem; its error is announced via aria-describedby.
      (result.errors.name ? nameRef : phoneRef).current?.focus();
      return;
    }
    void submit(result.data);
  };

  const resetClaim = () => {
    claimStore.clear();
    setValues(EMPTY);
    setTouched({ name: false, phone: false });
    setAttempted(false);
    requestAnimationFrame(() => nameRef.current?.focus());
  };

  if (claim) {
    return (
      <div className="claim-card" style={{ viewTransitionName: "claim-card" }}>
        <SuccessTicket claim={claim} onReset={resetClaim} />
      </div>
    );
  }

  const failure = state.status === "error" ? failureCopy(state.reason, state.message) : null;

  return (
    <div className="claim-card" style={{ viewTransitionName: "claim-card" }}>
      <form className="claim-form" noValidate onSubmit={onSubmit} aria-labelledby="claim-form-title" aria-busy={busy}>
        <div>
          <h3 id="claim-form-title" className="claim-form-title">
            Your {OFFER} code is one step away
          </h3>
          <p className="claim-form-sub">Two fields. No OTP, no app, no spam.</p>
        </div>

        <Field
          ref={nameRef}
          id="claim-name"
          name="name"
          label="Your name"
          autoComplete="name"
          autoCapitalize="words"
          enterKeyHint="next"
          spellCheck={false}
          maxLength={80}
          placeholder="e.g. Rahul Sharma"
          value={values.name}
          onChange={onChange("name")}
          onBlur={onBlur("name")}
          error={visibleError("name")}
          valid={touched.name && !errors.name}
          readOnly={busy}
          data-claim-focus=""
        />

        <Field
          ref={phoneRef}
          id="claim-phone"
          name="phone"
          type="tel"
          label="Mobile number"
          hint="10-digit Indian mobile. We only use it to verify your code."
          prefix="+91"
          autoComplete="tel"
          inputMode="tel"
          enterKeyHint="send"
          maxLength={16}
          placeholder="98765 43210"
          value={values.phone}
          onChange={onChange("phone")}
          onBlur={onBlur("phone")}
          error={visibleError("phone")}
          valid={touched.phone && !errors.phone}
          readOnly={busy}
        />

        {failure && (
          <div className="form-alert" role="alert">
            <AlertCircle className="shrink-0" />
            <div>
              <p className="form-alert-title">{failure.title}</p>
              <p>{failure.body}</p>
            </div>
          </div>
        )}

        <SubmitButton
          busy={busy}
          label={failure ? "Try again" : `Claim ${OFFER} OFF`}
          busyLabel="Claiming your offer…"
        />

        <p className="claim-form-footnote">
          Your code appears right here, instantly. Show it at the counter on your next visit.
        </p>

        {/* Loading is announced politely; request errors use role=alert above, and field
            errors are read when focus lands on the first invalid field. */}
        <p className="sr-only" role="status">
          {busy ? "Claiming your offer, please wait." : ""}
        </p>
      </form>
    </div>
  );
}
