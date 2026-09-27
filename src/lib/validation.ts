import type { ClaimRequest, FieldErrors } from "@/types/claim";

/**
 * Validation shared by the form and the API route, so both reject exactly the same input.
 * Kept dependency-free on purpose: two fields don't justify a schema library in the bundle.
 */

export const NAME_MIN = 2;
export const NAME_MAX = 60;

// Letters (any script, so Hindi names pass), combining marks, spaces, apostrophes, dots, hyphens.
const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}' .-]*$/u;

export function normalizeName(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

export function validateName(raw: string): string | undefined {
  const name = normalizeName(raw);
  if (!name) return "Please enter your name.";
  if (!NAME_PATTERN.test(name)) return "Please use letters only — no numbers or symbols.";
  if (name.replace(/[^\p{L}]/gu, "").length < NAME_MIN) return "Please enter at least 2 letters.";
  if (name.length > NAME_MAX) return `Please keep it under ${NAME_MAX} characters.`;
  return undefined;
}

/**
 * Reduces what people actually type or autofill ("+91 98765-43210", "098765 43210")
 * to the 10-digit national number. Returns null when it can't be an Indian mobile.
 */
export function normalizePhone(raw: string): string | null {
  const trimmed = raw.trim();
  if (/[^\d\s()+-]/.test(trimmed)) return null;
  if (trimmed.startsWith("+") && !trimmed.startsWith("+91")) return null;

  let digits = trimmed.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

export function validatePhone(raw: string): string | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return "Please enter your mobile number.";
  if (/[^\d\s()+-]/.test(trimmed)) return "Mobile numbers can only contain digits.";
  if (trimmed.startsWith("+") && !trimmed.startsWith("+91")) {
    return "We can only accept Indian (+91) mobile numbers for now.";
  }

  const digits = normalizePhone(trimmed) ?? "";
  if (digits.length !== 10) return "Enter a 10-digit mobile number, like 98765 43210.";
  if (!/^[6-9]/.test(digits)) return "Indian mobile numbers start with 6, 7, 8 or 9.";
  if (/^(\d)\1{9}$/.test(digits)) return "That number doesn't look right. Please check it.";
  return undefined;
}

export type ValidationResult =
  | { valid: true; data: ClaimRequest; errors: FieldErrors }
  | { valid: false; errors: FieldErrors };

export function validateClaim(input: ClaimRequest): ValidationResult {
  const errors: FieldErrors = {};
  const nameError = validateName(input.name);
  const phoneError = validatePhone(input.phone);
  if (nameError) errors.name = nameError;
  if (phoneError) errors.phone = phoneError;

  if (nameError || phoneError) return { valid: false, errors };
  return {
    valid: true,
    errors,
    data: { name: normalizeName(input.name), phone: normalizePhone(input.phone) as string },
  };
}
