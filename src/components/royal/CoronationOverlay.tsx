import { useEffect, useRef, useState, type CSSProperties } from "react";
import { formatPrice } from "../../utils/format";
import { RoyalCrown } from "../ui/icons";

interface CoronationOverlayProps {
  first: boolean;
  total: number;
  onClose: () => void;
}

const BIT_COUNT = 44;
const AUTO_CLOSE_MS = 11000;
const FADE_OUT_MS = 450;

/** Deterministic pseudo-random spread, so the confetti looks scattered but renders the same every time. */
const spread = (i: number, mod: number, mul: number) => (i * mul) % mod;

/** Full-screen celebration after a purchase: a crown leaps onto the screen and gold rains down. */
export function CoronationOverlay({ first, total, onClose }: CoronationOverlayProps) {
  const [leaving, setLeaving] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  function dismiss() {
    if (leaving) return;
    setLeaving(true);
    closeTimer.current = window.setTimeout(onClose, FADE_OUT_MS);
  }

  // Keep the latest dismiss() reachable from timers and key handlers.
  const dismissRef = useRef(dismiss);
  useEffect(() => {
    dismissRef.current = dismiss;
  });

  useEffect(() => {
    buttonRef.current?.focus();
    const auto = window.setTimeout(() => dismissRef.current(), AUTO_CLOSE_MS);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismissRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(auto);
      window.clearTimeout(closeTimer.current);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div
      className={leaving ? "coronation coronation--out" : "coronation"}
      role="dialog"
      aria-modal="true"
      aria-labelledby="coronation-title"
      onClick={dismiss}
    >
      <div className="coronation__rays" aria-hidden="true" />

      {Array.from({ length: BIT_COUNT }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={i % 5 === 0 ? "coronation__bit coronation__bit--ruby" : "coronation__bit"}
          style={
            {
              "--l": `${spread(i, 97, 23) + 1}%`,
              "--s": `${6 + spread(i, 7, 3)}px`,
              "--t": `${3.6 + spread(i, 5, 7) * 0.45}s`,
              "--d": `${1.1 + spread(i, 13, 5) * 0.28}s`,
              "--r": `${360 + spread(i, 9, 4) * 90}deg`,
              "--sway": `${spread(i, 61, 11) - 30}px`,
            } as CSSProperties
          }
        />
      ))}

      <div className="coronation__stage" aria-hidden="true">
        <span className="coronation__ring" />
        <span className="coronation__ring coronation__ring--2" />
        <RoyalCrown className="coronation__crown" />
      </div>

      <p className="coronation__eyebrow">{first ? "A royal decree" : "The court rejoices"}</p>
      <h2 id="coronation-title" className="coronation__title gold-text">
        {first ? "Congratulations!" : "Welcome back, Your Majesty!"}
      </h2>
      <p className="coronation__sub">
        {first
          ? "Your purchase is complete, and you are hereby crowned a Royal Member of the 10X court."
          : "Another fine acquisition for the royal collection."}{" "}
        <span className="whitespace-nowrap">Total {formatPrice(total)}.</span>
      </p>

      <div className="coronation__action">
        <button
          ref={buttonRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            dismiss();
          }}
          className="inline-flex min-h-11 items-center justify-center rounded-sm border border-gold-400 bg-linear-to-b from-crimson-600 to-crimson-800 px-8 font-display text-xs font-semibold uppercase tracking-[0.2em] text-gold-100 shadow-lg shadow-black/40 transition-colors hover:from-crimson-500 hover:to-crimson-700"
        >
          Enter the court
        </button>
      </div>
    </div>
  );
}
