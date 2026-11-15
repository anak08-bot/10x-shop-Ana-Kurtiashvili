import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

/** One leafy gold corner. Mirrored into the other three corners by CSS. */
function Corner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  return (
    <svg viewBox="0 0 40 40" className={`gilt-corner gilt-corner--${position}`} aria-hidden="true">
      <path
        d="M3 3 Q22 2 37 9 Q24 12 15 15 Q12 24 9 37 Q2 22 3 3 Z"
        fill="#f3dc8f"
        stroke="#4d3309"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M7 8 Q20 8 30 11 M8 7 Q8 20 11 30" fill="none" stroke="#8a6320" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="13" cy="13" r="4.2" fill="#a60f27" stroke="#4d3309" strokeWidth="1.2" />
      <circle cx="11.9" cy="11.9" r="1.2" fill="#ffb3bf" />
    </svg>
  );
}

interface GiltFrameProps {
  children: ReactNode;
  className?: string;
  /** Extra classes for the inner canvas (the "painting" area). */
  canvasClassName?: string;
  /** Turn off the lift-on-hover effect (for frames that are not clickable). */
  still?: boolean;
}

/** A carved, gilded Renaissance picture frame around any content. */
export function GiltFrame({ children, className, canvasClassName, still }: GiltFrameProps) {
  return (
    <div className={cn("gilt-frame", still && "gilt-frame--flat", className)}>
      <Corner position="tl" />
      <Corner position="tr" />
      <Corner position="bl" />
      <Corner position="br" />
      <div className={cn("gilt-frame__canvas", canvasClassName)}>{children}</div>
    </div>
  );
}
