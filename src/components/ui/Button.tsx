import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-6 font-display text-xs font-semibold uppercase tracking-[0.14em] transition-all disabled:cursor-not-allowed disabled:opacity-45";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "border border-gold-500 bg-linear-to-b from-crimson-600 to-crimson-800 text-gold-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] hover:from-crimson-500 hover:to-crimson-700 hover:shadow-[0_0_18px_-2px_rgba(212,175,95,0.6)] active:from-crimson-700 active:to-crimson-900 disabled:hover:from-crimson-600 disabled:hover:to-crimson-800 disabled:hover:shadow-none",
  secondary:
    "border border-gold-600/70 bg-transparent text-ink hover:border-gold-500 hover:bg-linear-to-b hover:from-gold-200 hover:to-gold-400 hover:text-navy-950 disabled:hover:border-gold-600/70 disabled:hover:bg-none disabled:hover:text-ink",
  ghost: "text-ink hover:bg-sunken",
  danger:
    "border border-line text-crimson-700 hover:border-crimson-700 hover:bg-crimson-50 dark:text-crimson-300 dark:hover:border-crimson-400 dark:hover:bg-crimson-500/10",
};

/** Class names shared by <Button> and by <Link> elements that should look like buttons. */
export function buttonClasses(variant: ButtonVariant = "primary", fullWidth = false, extra?: string): string {
  return cn(BASE, VARIANTS[variant], fullWidth && "w-full", extra);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

export function Button({ variant = "primary", fullWidth, className, type = "button", children, ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClasses(variant, fullWidth, className)} {...rest}>
      {children}
    </button>
  );
}
