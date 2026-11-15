import { useEffect, useRef, useState } from "react";
import { SORT_OPTIONS } from "../../constants";
import { useDebounce } from "../../hooks/useDebounce";
import type { CatalogParams } from "../../types/catalog";
import type { Category } from "../../types/product";
import { isSortOption } from "../../utils/guards";
import { SearchIcon } from "../ui/icons";

interface CatalogToolbarProps {
  params: CatalogParams;
  categories: Category[];
  onChange: (patch: Partial<CatalogParams>, replace?: boolean) => void;
}

const FIELD =
  "min-h-11 w-full rounded-lg border border-line bg-card px-3.5 text-base text-ink outline-none transition-colors hover:border-ink/40 focus:border-ink focus:ring-2 focus:ring-crimson-500/25";

export function CatalogToolbar({ params, categories, onChange }: CatalogToolbarProps) {
  const [text, setText] = useState(params.q);
  const debounced = useDebounce(text, 400);
  const urlQ = useRef(params.q); // the q value currently in the URL
  const lastDebounced = useRef(debounced);

  // URL -> input (Back/Forward, "Clear filters")
  useEffect(() => {
    if (params.q !== urlQ.current) {
      urlQ.current = params.q;
      setText(params.q);
    }
  }, [params.q]);

  // input -> URL, only after the user stops typing
  useEffect(() => {
    if (debounced === lastDebounced.current) return;
    lastDebounced.current = debounced;
    const q = debounced.trim();
    if (q === urlQ.current) return;
    urlQ.current = q;
    onChange({ q }, true);
  }, [debounced, onChange]);

  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_14rem_14rem]">
      <div>
        <label htmlFor="catalog-search" className="sr-only">
          Search products
        </label>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id="catalog-search"
            type="search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search products"
            autoComplete="off"
            className={`${FIELD} pl-11`}
          />
        </div>
      </div>
      <div>
        <label htmlFor="catalog-category" className="sr-only">
          Category
        </label>
        <select id="catalog-category" value={params.q ? "" : params.category} onChange={(e) => onChange({ category: e.target.value })} className={FIELD}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="catalog-sort" className="sr-only">
          Sort by
        </label>
        <select
          id="catalog-sort"
          value={params.sort}
          onChange={(e) => {
            const next: string = e.target.value;
            if (isSortOption(next)) onChange({ sort: next });
          }}
          className={FIELD}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
