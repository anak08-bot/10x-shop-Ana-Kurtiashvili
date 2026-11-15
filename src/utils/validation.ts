import type { ShippingInfo } from "../types/order";
import type { ProfileForm } from "../types/user";

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

/** 9-15 digits; a leading + and spaces/dashes are allowed. */
export function isValidPhone(value: string): boolean {
  const t = value.trim();
  if (!/^\+?[\d\s-]+$/.test(t)) return false;
  const digits = t.replace(/\D/g, "").length;
  return digits >= 9 && digits <= 15;
}

export function validateShipping(v: ShippingInfo): FieldErrors<ShippingInfo> {
  const errors: FieldErrors<ShippingInfo> = {};
  if (v.fullName.trim().length < 3) errors.fullName = "Full name must be at least 3 characters";
  if (!v.email.trim()) errors.email = "Email is required";
  else if (!isValidEmail(v.email)) errors.email = "Please enter a valid email address";
  if (v.address.trim().length < 5) errors.address = "Address must be at least 5 characters";
  if (!v.city.trim()) errors.city = "City is required";
  return errors;
}

export function validateProfile(v: ProfileForm): FieldErrors<ProfileForm> {
  const errors: FieldErrors<ProfileForm> = {};
  if (v.firstName.trim().length < 2) errors.firstName = "First name must be at least 2 characters";
  if (v.lastName.trim().length < 2) errors.lastName = "Last name must be at least 2 characters";
  if (!isValidEmail(v.email)) errors.email = "Please enter a valid email address";
  if (v.phone.trim() && !isValidPhone(v.phone)) errors.phone = "Please enter a valid phone number";
  return errors;
}

export function validateReview(rating: number, comment: string): { rating?: string; comment?: string } {
  const errors: { rating?: string; comment?: string } = {};
  if (rating < 1 || rating > 5) errors.rating = "Please select a rating";
  if (comment.trim().length < 10) errors.comment = "Comment must be at least 10 characters";
  return errors;
}
