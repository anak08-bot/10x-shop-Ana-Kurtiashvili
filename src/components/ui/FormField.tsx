import { useId, useState, type ChangeEventHandler, type FocusEventHandler, type HTMLInputTypeAttribute } from "react";
import { cn } from "../../utils/cn";

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  type?: HTMLInputTypeAttribute;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
  hint?: string;
  disabled?: boolean;
}

/** Label + input + inline error. Passwords get a show/hide toggle. */
export function FormField({
  label,
  name,
  value,
  onChange,
  onBlur,
  type = "text",
  error,
  autoComplete,
  placeholder,
  hint,
  disabled,
}: FormFieldProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={isPassword && visible ? "text" : type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={autoComplete}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "min-h-11 w-full rounded-lg border bg-card px-3.5 text-base text-ink outline-none transition-colors placeholder:text-muted/70 hover:border-ink/40 focus:border-ink focus:ring-2 focus:ring-crimson-500/25 disabled:cursor-not-allowed disabled:opacity-60",
            error ? "border-crimson-500" : "border-line",
            isPassword && "pr-16",
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-1 my-1 rounded-lg px-3 text-xs font-semibold text-muted hover:bg-sunken hover:text-ink"
          >
            {visible ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-crimson-700 dark:text-crimson-300">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
