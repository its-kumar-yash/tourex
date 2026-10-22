/**
 * Phone numbers are stored in E.164 form (+919876543210).
 * A bare 10-digit Indian mobile number gets +91; anything starting with + is
 * accepted as an international number of 8 to 15 digits.
 */
export function normalizePhone(input: string): string | null {
  const raw = input.trim();
  const digits = raw.replace(/[^\d]/g, "");
  if (raw.startsWith("+")) {
    if (digits.startsWith("91")) return /^91[6-9]\d{9}$/.test(digits) ? `+${digits}` : null;
    return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null;
  }
  const local = digits.replace(/^0+/, "");
  if (/^[6-9]\d{9}$/.test(local)) return `+91${local}`;
  if (/^91[6-9]\d{9}$/.test(local)) return `+${local}`;
  return null;
}

export const PHONE_HINT = "10-digit mobile number. For numbers outside India, start with + and the country code.";

/** "+91 98765 43210" for display. */
export function formatPhone(e164: string | null | undefined) {
  if (!e164) return "";
  const m = e164.match(/^\+91(\d{5})(\d{5})$/);
  return m ? `+91 ${m[1]} ${m[2]}` : e164;
}
