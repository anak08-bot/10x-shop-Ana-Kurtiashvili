import { isApiError } from "../api/ApiError";

/** Turns anything thrown (unknown) into a message that is safe to show. */
export function describeError(e: unknown): string {
  if (isApiError(e)) {
    if (e.status >= 500) return "The server had a problem. Please try again in a moment.";
    return e.message;
  }
  return "Something went wrong. Please try again.";
}
