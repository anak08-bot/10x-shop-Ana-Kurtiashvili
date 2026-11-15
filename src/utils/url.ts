import { PAGE_SIZE } from "../constants";
import type { CatalogParams, SortOption } from "../types/catalog";
import { isSortOption } from "./guards";

const SORT_QUERY: Record<Exclude<SortOption, "">, { sortBy: string; order: "asc" | "desc" }> = {
  "price-asc": { sortBy: "price", order: "asc" },
  "price-desc": { sortBy: "price", order: "desc" },
  "rating-desc": { sortBy: "rating", order: "desc" },
  "title-asc": { sortBy: "title", order: "asc" },
};

export const CATEGORIES_URL = "/products/categories";

/** Search and category are mutually exclusive in the DummyJSON API: search wins. */
export function buildProductsUrl(params: CatalogParams): string {
  const query = new URLSearchParams();
  const q = params.q.trim();
  let path = "/products";
  if (q) {
    path = "/products/search";
    query.set("q", q);
  } else if (params.category) {
    path = `/products/category/${encodeURIComponent(params.category)}`;
  }
  query.set("limit", String(PAGE_SIZE));
  query.set("skip", String((params.page - 1) * PAGE_SIZE));
  if (params.sort) {
    const { sortBy, order } = SORT_QUERY[params.sort];
    query.set("sortBy", sortBy);
    query.set("order", order);
  }
  return `${path}?${query.toString()}`;
}

export function productUrl(id: number): string {
  return `/products/${id}`;
}

export function categoryProductsUrl(slug: string, limit: number): string {
  return `/products/category/${encodeURIComponent(slug)}?limit=${limit}`;
}

/** Positive integer from a route param, otherwise null ("abc", "-1", "1.5" -> null). */
export function parseId(raw: string | undefined): number | null {
  if (raw === undefined || !/^[1-9]\d*$/.test(raw)) return null;
  const n = Number(raw);
  return Number.isSafeInteger(n) ? n : null;
}

export function parseCatalogParams(sp: URLSearchParams): CatalogParams {
  const rawSort = sp.get("sort");
  const rawPage = Number(sp.get("page"));
  return {
    q: sp.get("q") ?? "",
    category: sp.get("category") ?? "",
    sort: isSortOption(rawSort) ? rawSort : "",
    page: Number.isInteger(rawPage) && rawPage >= 1 ? rawPage : 1,
  };
}

/** Only non-default values go into the URL, so the default catalog URL is just "/". */
export function toSearchParams(p: CatalogParams): URLSearchParams {
  const sp = new URLSearchParams();
  if (p.q.trim()) sp.set("q", p.q.trim());
  if (p.category) sp.set("category", p.category);
  if (p.sort) sp.set("sort", p.sort);
  if (p.page > 1) sp.set("page", String(p.page));
  return sp;
}
