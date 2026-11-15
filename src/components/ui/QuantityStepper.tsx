interface QuantityStepperProps {
  value: number;
  min?: number;
  max: number;
  onChange: (next: number) => void;
  label?: string;
  disabled?: boolean;
}

export function QuantityStepper({ value, min = 1, max, onChange, label = "Quantity", disabled }: QuantityStepperProps) {
  const btn =
    "flex size-11 items-center justify-center text-lg font-semibold transition-colors hover:bg-sunken disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent";
  return (
    <div role="group" aria-label={label} className="inline-flex items-center overflow-hidden rounded-full border border-line bg-card">
      <button type="button" className={btn} aria-label="Decrease quantity" disabled={disabled || value <= min} onClick={() => onChange(value - 1)}>
        −
      </button>
      <output aria-live="polite" className="min-w-10 text-center font-semibold tabular-nums">
        {value}
      </output>
      <button type="button" className={btn} aria-label="Increase quantity" disabled={disabled || value >= max} onClick={() => onChange(value + 1)}>
        +
      </button>
    </div>
  );
}
