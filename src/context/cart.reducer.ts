import { Cart } from "../models/Cart";
import type { CartItem, CartState } from "../types/cart";
import type { Product } from "../types/product";

export type CartAction =
  | { type: "ADD_ITEM"; product: Product; qty: number }
  | { type: "ADD_LINES"; items: CartItem[] } // used by "Reorder"
  | { type: "SET_QTY"; productId: number; qty: number }
  | { type: "REMOVE_ITEM"; productId: number }
  | { type: "CLEAR" }
  | { type: "APPLY_PROMO"; code: string }
  | { type: "REMOVE_PROMO" };

export const EMPTY_CART: CartState = { items: [], promoCode: null };

function toCartItem(product: Product, quantity: number): CartItem {
  return {
    productId: product.id,
    title: product.title,
    thumbnail: product.thumbnail,
    price: product.price,
    discountPercentage: product.discountPercentage,
    stock: product.stock,
    quantity,
  };
}

/** Adds `line` to the list. The result never exceeds the stock; returns the same array if nothing can be added. */
function addLine(items: CartItem[], line: CartItem): CartItem[] {
  const existing = items.find((i) => i.productId === line.productId);
  if (existing) {
    const quantity = Math.min(existing.quantity + line.quantity, line.stock);
    if (quantity === existing.quantity) return items;
    return items.map((i) => (i.productId === line.productId ? { ...i, quantity, stock: line.stock } : i));
  }
  if (line.stock < 1 || line.quantity < 1) return items;
  return [...items, { ...line, quantity: Math.min(line.quantity, line.stock) }];
}

/** Pure function: no localStorage, no side effects. Every branch returns a NEW object (immutable updates). */
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const items = addLine(state.items, toCartItem(action.product, action.qty));
      return items === state.items ? state : { ...state, items };
    }
    case "ADD_LINES": {
      const items = action.items.reduce(addLine, state.items);
      return items === state.items ? state : { ...state, items };
    }
    case "SET_QTY": {
      if (!Number.isInteger(action.qty) || action.qty < 1) return state;
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === action.productId ? { ...i, quantity: Math.min(action.qty, i.stock) } : i,
        ),
      };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.productId !== action.productId) };
    case "CLEAR":
      return { items: [], promoCode: null };
    case "APPLY_PROMO":
      return Cart.isValidPromo(action.code) ? { ...state, promoCode: Cart.PROMO_CODE } : state;
    case "REMOVE_PROMO":
      return { ...state, promoCode: null };
    default: {
      const _exhaustive: never = action; // compile error if a new action type is not handled
      return _exhaustive;
    }
  }
}
