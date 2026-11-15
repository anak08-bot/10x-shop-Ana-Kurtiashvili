import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { cartStorage } from "../models/storage";
import { Cart } from "../models/Cart";
import type { CartItem, CartState } from "../types/cart";
import type { Product } from "../types/product";
import { cartReducer, EMPTY_CART } from "./cart.reducer";

export type AddResult = { ok: true } | { ok: false; message: string };

interface CartContextValue {
  items: CartItem[];
  promoCode: string | null;
  cart: Cart; // totals
  itemCount: number;
  addItem: (product: Product, qty: number) => AddResult;
  addLines: (items: CartItem[]) => void;
  setQuantity: (productId: number, qty: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadInitialCart(): CartState {
  return cartStorage.get() ?? EMPTY_CART;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialCart);

  // The reducer is pure; persisting to localStorage is a side effect, so it lives here.
  useEffect(() => {
    cartStorage.set(state);
  }, [state]);

  const promoCode = state.promoCode ?? null;
  const cart = useMemo(() => new Cart(state.items, promoCode), [state.items, promoCode]);

  const addItem = useCallback(
    (product: Product, qty: number): AddResult => {
      if (product.stock < 1) return { ok: false, message: "This product is out of stock." };
      const inCart = state.items.find((i) => i.productId === product.id)?.quantity ?? 0;
      if (inCart + qty > product.stock) {
        const left = product.stock - inCart;
        return {
          ok: false,
          message: left > 0 ? `Only ${left} more available (${inCart} already in your cart).` : `You already have all ${product.stock} in stock in your cart.`,
        };
      }
      dispatch({ type: "ADD_ITEM", product, qty });
      return { ok: true };
    },
    [state.items],
  );

  const addLines = useCallback((items: CartItem[]) => dispatch({ type: "ADD_LINES", items }), []);
  const setQuantity = useCallback((productId: number, qty: number) => dispatch({ type: "SET_QTY", productId, qty }), []);
  const removeItem = useCallback((productId: number) => dispatch({ type: "REMOVE_ITEM", productId }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);
  const removePromo = useCallback(() => dispatch({ type: "REMOVE_PROMO" }), []);
  const applyPromo = useCallback((code: string): boolean => {
    if (!Cart.isValidPromo(code)) return false;
    dispatch({ type: "APPLY_PROMO", code });
    return true;
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      promoCode,
      cart,
      itemCount: cart.itemCount,
      addItem,
      addLines,
      setQuantity,
      removeItem,
      clearCart,
      applyPromo,
      removePromo,
    }),
    [state.items, promoCode, cart, addItem, addLines, setQuantity, removeItem, clearCart, applyPromo, removePromo],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
