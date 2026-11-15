import { useState, type FormEvent } from "react";
import { Button } from "../ui/Button";

interface PromoFormProps {
  appliedCode: string | null;
  onApply: (code: string) => boolean;
  onRemove: () => void;
}

export function PromoForm({ appliedCode, onApply, onRemove }: PromoFormProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (onApply(code)) {
      setCode("");
      setError("");
    } else {
      setError("Invalid promo code");
    }
  }

  if (appliedCode) {
    return (
      <p className="flex items-center justify-between gap-3 rounded-lg bg-gold-50 px-3 py-2.5 text-sm font-medium text-gold-700 dark:bg-gold-500/20 dark:text-gold-100">
        <span>Promo {appliedCode} applied</span>
        <button type="button" onClick={onRemove} className="font-semibold underline underline-offset-2 hover:no-underline">
          Remove
        </button>
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="promo-code" className="mb-1.5 block text-sm font-semibold">
        Promo code
      </label>
      <div className="flex gap-2">
        <input
          id="promo-code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError("");
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "promo-error" : undefined}
          autoComplete="off"
          className="min-h-11 min-w-0 flex-1 rounded-lg border border-line bg-card px-3.5 uppercase outline-none transition-colors placeholder:normal-case hover:border-ink/40 focus:border-ink focus:ring-2 focus:ring-crimson-500/25 aria-[invalid=true]:border-crimson-500"
        />
        <Button type="submit" variant="secondary" disabled={code.trim() === ""}>
          Apply
        </Button>
      </div>
      {error && (
        <p id="promo-error" className="mt-1.5 text-sm font-medium text-crimson-700 dark:text-crimson-300">
          {error}
        </p>
      )}
    </form>
  );
}
