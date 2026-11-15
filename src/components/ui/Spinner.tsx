export function Spinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-16 text-muted">
      <span className="size-6 animate-spin rounded-full border-[3px] border-line border-t-crimson-600" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
