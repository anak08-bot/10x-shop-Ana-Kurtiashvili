import { Component, type ErrorInfo, type ReactNode } from "react";

interface State {
  hasError: boolean;
}

/** Catches render errors anywhere below it, so one bug never leaves a blank white page. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div role="alert" className="flex min-h-screen flex-col items-center justify-center gap-4 bg-page px-6 text-center text-ink">
        <h1 className="font-display text-3xl font-semibold">Something went wrong.</h1>
        <p className="max-w-md text-muted">An unexpected error stopped this page from working. Reloading usually fixes it.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="min-h-11 rounded-full bg-crimson-700 px-6 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-crimson-800"
        >
          Reload
        </button>
      </div>
    );
  }
}
