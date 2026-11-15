import { useCallback, useEffect, useState } from "react";
import { api } from "../api";
import { isApiError } from "../api/ApiError";
import type { AsyncState } from "../types/api";
import { describeError } from "../utils/errors";

/**
 * GET `path` from the API. Pass null to skip the request.
 * Each new path cancels the previous request (AbortController), so a slow old
 * response can never overwrite a newer one.
 */
export function useFetch<T>(path: string | null): { state: AsyncState<T>; retry: () => void } {
  const [state, setState] = useState<AsyncState<T>>({ status: path === null ? "idle" : "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (path === null) {
      setState({ status: "idle" });
      return;
    }
    const controller = new AbortController();
    setState({ status: "loading" });
    api
      .get<T>(path, controller.signal)
      .then((data) => setState({ status: "success", data }))
      .catch((e: unknown) => {
        if (controller.signal.aborted) return; // cancelled: a newer request is in charge
        setState({
          status: "error",
          message: describeError(e),
          httpStatus: isApiError(e) ? e.status : undefined,
        });
      });
    return () => controller.abort();
  }, [path, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { state, retry };
}
