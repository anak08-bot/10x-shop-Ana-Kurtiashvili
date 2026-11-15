/** The only gate to localStorage. Reads are validated by a type guard, so corrupt JSON can never crash the app. */
export class StorageService<T> {
  constructor(
    private readonly key: string,
    private readonly guard: (value: unknown) => value is T,
  ) {}

  get(): T | null {
    try {
      const raw = window.localStorage.getItem(this.key);
      if (raw === null) return null;
      const parsed: unknown = JSON.parse(raw);
      return this.guard(parsed) ? parsed : null;
    } catch {
      return null; // storage blocked or invalid JSON
    }
  }

  set(value: T): void {
    try {
      window.localStorage.setItem(this.key, JSON.stringify(value));
    } catch {
      // storage full or blocked (private mode) - the app keeps working in memory
    }
  }

  remove(): void {
    try {
      window.localStorage.removeItem(this.key);
    } catch {
      // nothing to do
    }
  }
}
