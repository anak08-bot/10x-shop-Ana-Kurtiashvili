import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { StorageService } from "../models/StorageService";

/** useState that survives a reload. `guard` must be a stable (module-level) function. */
export function useLocalStorage<T>(
  key: string,
  initial: T,
  guard: (value: unknown) => value is T,
): [T, Dispatch<SetStateAction<T>>] {
  const service = useMemo(() => new StorageService<T>(key, guard), [key, guard]);
  const [value, setValue] = useState<T>(() => service.get() ?? initial);
  useEffect(() => {
    service.set(value);
  }, [service, value]);
  return [value, setValue];
}
