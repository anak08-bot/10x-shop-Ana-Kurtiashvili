import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

/** Surface wrapper: anything placed inside is rendered through `children`. */
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("royal-panel", className)}>{children}</div>;
}
