export type SortOption = "" | "price-asc" | "price-desc" | "rating-desc" | "title-asc";

/** Everything the catalog needs to build a request. It lives in the URL (?q=&category=&sort=&page=). */
export interface CatalogParams {
  q: string;
  category: string;
  sort: SortOption;
  page: number;
}
