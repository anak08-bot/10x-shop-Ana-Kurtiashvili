import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "../utils/cn";

export type ToastKind = "success" | "error" | "info";

interface ToastMessage {
  id: number;
  text: string;
  kind: ToastKind;
}

interface ToastContextValue {
  showToast: (text: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const KIND_STYLES: Record<ToastKind, string> = {
  success: "border-gold-500 bg-gold-50 text-gold-700 dark:bg-gold-700/30 dark:text-gold-100",
  error: "border-crimson-400 bg-crimson-50 text-crimson-800 dark:bg-crimson-500/15 dark:text-crimson-200",
  info: "border-line bg-card text-ink",
};

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), 3200);
    return () => window.clearTimeout(timer); // cleanup: no timer fires after the toast is gone
  }, [toast.id, onDismiss]);

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg",
        KIND_STYLES[toast.kind],
      )}
    >
      <span>{toast.text}</span>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss message"
        className="-mr-2 flex size-8 items-center justify-center rounded-lg text-lg leading-none hover:bg-black/10 dark:hover:bg-white/10"
      >
        ×
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((text: string, kind: ToastKind = "success") => {
    const id = nextId.current++;
    setToasts((prev) => [...prev.slice(-2), { id, text, kind }]); // keep at most 3 on screen
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
