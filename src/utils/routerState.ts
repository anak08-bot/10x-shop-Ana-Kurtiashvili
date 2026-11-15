import { isRecord } from "./guards";

/** Router `location.state` is `unknown`: read it through guards, never with casts. */
export function getFrom(state: unknown): string | null {
  if (isRecord(state) && typeof state.from === "string" && state.from.startsWith("/") && !state.from.startsWith("//")) {
    return state.from;
  }
  return null;
}

export function getNotice(state: unknown): string | null {
  return isRecord(state) && typeof state.notice === "string" ? state.notice : null;
}
