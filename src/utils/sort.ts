import type { SortOption } from "../types/catalog";
import type { Product } from "../types/product";

/**
 * Client-side fallback sort for the current page. The API already sorts, but
 * if an endpoint ever ignores sortBy/order the page is still in the right order.
 */
export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const list = [...products];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "rating-desc":
      return list.sort((a, b) => b.rating - a.rating);
    case "title-asc":
      return list.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return list;
  }
}
