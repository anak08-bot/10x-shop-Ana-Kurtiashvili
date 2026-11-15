import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Card } from "./Card";
import { LogoMark } from "./icons";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

/** Centered card used by the Login and Register pages. */
export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="mx-auto w-full max-w-md py-4 sm:py-10">
      <Link to="/" className="mb-5 inline-flex min-h-11 items-center text-sm font-medium text-muted hover:text-ink">
        ← Back to catalog
      </Link>
      <Card className="p-6 shadow-xl shadow-black/10 sm:p-9">
        <LogoMark className="mb-5 size-10 text-gold-500" />
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">{title}</h1>
        <p className="mt-2 text-muted">{subtitle}</p>
        <div className="mt-7">{children}</div>
      </Card>
      <p className="mt-5 text-center text-sm text-muted">{footer}</p>
    </div>
  );
}
