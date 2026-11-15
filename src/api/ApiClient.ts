import { isRecord } from "../utils/guards";
import { ApiError } from "./ApiError";

export class ApiClient {
  constructor(private readonly baseUrl: string) {}

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    let res: Response;
    try {
      // No custom headers on GET: it keeps the request "simple" (no CORS preflight).
      res = await fetch(this.baseUrl + path, { ...init, headers: { Accept: "application/json" } });
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === "AbortError") throw e; // cancelled on purpose
      throw new ApiError(0, "Network error. Check your connection and try again.");
    }
    if (!res.ok) throw new ApiError(res.status, await ApiClient.readMessage(res));
    const data: unknown = await res.json();
    return data as T;
  }

  private static async readMessage(res: Response): Promise<string> {
    try {
      const body: unknown = await res.json();
      if (isRecord(body) && typeof body.message === "string") return body.message;
    } catch {
      // response body was not JSON - use the generic text below
    }
    return `Request failed with status ${res.status}`;
  }

  get<T>(path: string, signal?: AbortSignal): Promise<T> {
    return this.request<T>(path, { signal });
  }
}
