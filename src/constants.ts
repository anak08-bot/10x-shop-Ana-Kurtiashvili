import type { SortOption } from "./types/catalog";

export const API_BASE_URL = "https://dummyjson.com";
export const PAGE_SIZE = 12;
export const RELATED_FETCH_LIMIT = 5;
export const RELATED_SHOWN = 4;

export const STORAGE_KEYS = {
  cart: "shop_cart",
  orders: "shop_orders",
  reviews: "shop_reviews",
  theme: "shop_theme",
  user: "shop_user",
  accounts: "shop_accounts",
  royal: "shop_royal",
} as const;

export const SORT_OPTIONS: ReadonlyArray<{ value: SortOption; label: string }> = [
  { value: "", label: "Default" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating-desc", label: "Rating: high to low" },
  { value: "title-asc", label: "Name A→Z" },
];
