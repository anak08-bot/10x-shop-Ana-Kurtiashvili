import { useCallback } from "react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import type { Product } from "../types/product";

/** Adds a product and tells the user what happened. Returns true on success. */
export function useAddToCart(): (product: Product, qty?: number) => boolean {
  const { addItem } = useCart();
  const { showToast } = useToast();
  return useCallback(
    (product: Product, qty = 1): boolean => {
      const result = addItem(product, qty);
      if (result.ok) showToast("Added to cart ✓");
      else showToast(result.message, "error");
      return result.ok;
    },
    [addItem, showToast],
  );
}
