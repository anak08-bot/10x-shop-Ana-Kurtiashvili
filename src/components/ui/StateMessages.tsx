import type { ReactNode } from "react";
import { Button } from "./Button";

export function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="mx-auto max-w-md rounded-2xl border border-crimson-300 bg-crimson-50 p-6 text-center dark:border-crimson-400/40 dark:bg-crimson-500/10">
      <p className="font-display text-lg font-semibold text-crimson-800 dark:text-crimson-200">We couldn’t load this</p>
      <p className="mt-1 text-sm text-crimson-700 dark:text-crimson-300">{message}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-dashed border-line px-6 py-12 text-center">
      <p className="font-display text-xl font-semibold">{title}</p>
      {children && <div className="mt-4 flex flex-col items-center gap-3 text-sm text-muted">{children}</div>}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-sunken ${className}`} />;
}
