import { useCallback, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CatalogToolbar } from "../components/product/CatalogToolbar";
import { Pagination } from "../components/product/Pagination";
import { ProductGrid } from "../components/product/ProductGrid";
import { buttonClasses } from "../components/ui/Button";
import { PalaceHall } from "../components/royal/PalaceHall";
import { EmptyState, ErrorMessage, Skeleton } from "../components/ui/StateMessages";
import { PAGE_SIZE } from "../constants";
import { useAddToCart } from "../hooks/useAddToCart";
import { useFetch } from "../hooks/useFetch";
import type { CatalogParams } from "../types/catalog";
import type { Category, ProductsResponse } from "../types/product";
import { sortProducts } from "../utils/sort";
import { buildProductsUrl, CATEGORIES_URL, parseCatalogParams, toSearchParams } from "../utils/url";

export default function CatalogPage() {
  // The URL is the single source of truth for q / category / sort / page.
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useMemo(() => parseCatalogParams(searchParams), [searchParams]);

  const { state, retry } = useFetch<ProductsResponse>(buildProductsUrl(params));
  const { state: categoriesState } = useFetch<Category[]>(CATEGORIES_URL);
  const addToCart = useAddToCart();

  const updateParams = useCallback(
    (patch: Partial<CatalogParams>, replace = false) => {
      setSearchParams(
        (prev) => {
          const next: CatalogParams = { ...parseCatalogParams(prev), ...patch };
          if (patch.q) next.category = ""; // search and category exclude each other
          if (patch.category) next.q = "";
          if (patch.page === undefined) next.page = 1; // any filter change goes back to page 1
          return toSearchParams(next);
        },
        { replace },
      );
    },
    [setSearchParams],
  );

  const products = useMemo(
    () => (state.status === "success" ? sortProducts(state.data.products, params.sort) : []),
    [state, params.sort],
  );

  const hasFilters = params.q !== "" || params.category !== "" || params.sort !== "" || params.page > 1;
  const showHero = !hasFilters;
  const total = state.status === "success" ? state.data.total : 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const firstShown = (params.page - 1) * PAGE_SIZE + 1;
  const lastShown = Math.min(params.page * PAGE_SIZE, total);

  return (
    <div className="space-y-6">
      {showHero && (
        <section className="gilt-frame gilt-frame--flat" aria-labelledby="hero-title">
          <div className="gilt-frame__canvas relative isolate flex min-h-[26rem] items-center justify-center overflow-hidden bg-navy-950 px-6 py-16 text-center text-ivory sm:min-h-[32rem] sm:px-12">
            <PalaceHall className="absolute inset-0 -z-20 size-full" />
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_45%,rgba(18,6,10,0.93),rgba(18,6,10,0.7)_50%,rgba(18,6,10,0.15))]" aria-hidden="true" />
            <div className="max-w-3xl rounded-sm border border-gold-500/50 bg-navy-950/80 px-6 py-9 shadow-2xl shadow-black/50 backdrop-blur-[3px] sm:px-14">
              <p className="eyebrow text-gold-400">Welcome to the royal court</p>
              <h2 id="hero-title" className="gold-text mt-4 font-display text-4xl font-bold leading-[1.1] sm:text-6xl">
                Treasures fit for a King.
              </h2>
              <div className="royal-divider mt-6" aria-hidden="true">
                <span>✦</span>
              </div>
              <p className="mx-auto mt-5 max-w-xl font-serif text-xl italic text-ivory/85 sm:text-2xl">
                Stroll the gilded halls, choose your finest pieces and be crowned a Royal Member with your first purchase.
              </p>
              <a href="#collection" className="mt-8 inline-flex min-h-11 items-center justify-center rounded-sm border border-gold-400 bg-linear-to-b from-crimson-600 to-crimson-800 px-8 font-display text-xs font-semibold uppercase tracking-[0.2em] text-gold-100 shadow-lg shadow-black/40 transition-colors hover:from-crimson-500 hover:to-crimson-700">
                Enter the collection
              </a>
            </div>
          </div>
        </section>
      )}

      <div className="flex flex-wrap items-end justify-between gap-2">
        <h1 id="collection" className="scroll-mt-28 font-display text-3xl font-semibold sm:text-4xl">The Royal Collection</h1>
        {state.status === "success" && (
          <p className="text-sm text-muted" aria-live="polite">
            {total} {total === 1 ? "product" : "products"}
          </p>
        )}
      </div>

      <CatalogToolbar
        params={params}
        categories={categoriesState.status === "success" ? categoriesState.data : []}
        onChange={updateParams}
      />

      {state.status === "loading" && (
        <div aria-busy="true">
          <p role="status" className="mb-4 text-sm font-medium text-muted">
            Loading products…
          </p>
          <div className="grid grid-cols-1 gap-5 min-[560px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-hidden="true">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        </div>
      )}

      {state.status === "error" && <ErrorMessage message={state.message} onRetry={retry} />}

      {state.status === "success" && products.length === 0 && (
        <EmptyState title="No products found.">
          <p>Try a different search or remove a filter.</p>
          <Link to="/" className={buttonClasses("secondary")}>
            Clear filters
          </Link>
        </EmptyState>
      )}

      {state.status === "success" && products.length > 0 && (
        <>
          <ProductGrid products={products} onAdd={(p) => addToCart(p)} />
          <p className="text-center text-sm text-muted">
            Showing {firstShown}–{lastShown} of {total}
          </p>
          <Pagination
            page={params.page}
            totalPages={totalPages}
            onChange={(page) => {
              updateParams({ page });
              window.scrollTo(0, 0);
            }}
          />
        </>
      )}
    </div>
  );
}
