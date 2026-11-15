import { cn } from "../../utils/cn";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

function pageList(page: number, total: number): Array<number | "gap"> {
  const wanted = new Set([1, total, page - 1, page, page + 1]);
  const pages = [...wanted].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: Array<number | "gap"> = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) out.push("gap");
    out.push(p);
  });
  return out;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const btn =
    "flex size-11 items-center justify-center rounded-full border text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-2">
      <button type="button" className={cn(btn, "border-line bg-card hover:bg-sunken")} aria-label="Previous page" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        ‹
      </button>
      {pageList(page, totalPages).map((p, i) =>
        p === "gap" ? (
          <span key={`gap-${i}`} className="px-1 text-muted" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
            onClick={() => onChange(p)}
            className={cn(btn, p === page ? "border-crimson-700 bg-crimson-700 text-white dark:border-crimson-600 dark:bg-crimson-600" : "border-line bg-card hover:bg-sunken")}
          >
            {p}
          </button>
        ),
      )}
      <button type="button" className={cn(btn, "border-line bg-card hover:bg-sunken")} aria-label="Next page" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        ›
      </button>
    </nav>
  );
}
