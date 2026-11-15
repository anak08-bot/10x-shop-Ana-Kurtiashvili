import type { CartItem, CartState } from "../types/cart";
import type { SortOption } from "../types/catalog";
import type { Order, ShippingInfo } from "../types/order";
import type { Review } from "../types/product";
import type { Theme } from "../types/theme";
import type { AuthUser, StoredAccount } from "../types/user";

// JSON has no types: everything read from localStorage is `unknown` until a guard narrows it.

export function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const isStr = (v: unknown): v is string => typeof v === "string";

export function isTheme(v: unknown): v is Theme {
  return v === "light" || v === "dark";
}

const SORTS: readonly string[] = ["", "price-asc", "price-desc", "rating-desc", "title-asc"];
export function isSortOption(v: unknown): v is SortOption {
  return isStr(v) && SORTS.includes(v);
}

export function isCartItem(v: unknown): v is CartItem {
  return (
    isRecord(v) &&
    isNum(v.productId) &&
    isStr(v.title) &&
    isStr(v.thumbnail) &&
    isNum(v.price) &&
    isNum(v.discountPercentage) &&
    isNum(v.stock) &&
    isNum(v.quantity) &&
    v.quantity >= 1
  );
}

export function isCartState(v: unknown): v is CartState {
  return (
    isRecord(v) &&
    Array.isArray(v.items) &&
    v.items.every(isCartItem) &&
    (v.promoCode === undefined || v.promoCode === null || isStr(v.promoCode))
  );
}

function isShippingInfo(v: unknown): v is ShippingInfo {
  return isRecord(v) && isStr(v.fullName) && isStr(v.email) && isStr(v.address) && isStr(v.city);
}

export function isOrder(v: unknown): v is Order {
  return (
    isRecord(v) &&
    isNum(v.id) &&
    isStr(v.number) &&
    Array.isArray(v.items) &&
    v.items.every(isCartItem) &&
    isShippingInfo(v.shipping) &&
    isNum(v.subtotal) &&
    isNum(v.discount) &&
    isNum(v.shippingCost) &&
    isNum(v.total) &&
    isStr(v.placedAt)
  );
}

export function isOrderList(v: unknown): v is Order[] {
  return Array.isArray(v) && v.every(isOrder);
}

function isReview(v: unknown): v is Review {
  return isRecord(v) && isNum(v.rating) && isStr(v.comment) && isStr(v.date) && isStr(v.reviewerName);
}

/** productId -> reviews written locally */
export type ReviewsMap = Record<string, Review[]>;

export function isReviewsMap(v: unknown): v is ReviewsMap {
  return isRecord(v) && Object.values(v).every((list) => Array.isArray(list) && list.every(isReview));
}

function isStoredAccount(v: unknown): v is StoredAccount {
  return (
    isRecord(v) &&
    isStr(v.username) &&
    isStr(v.firstName) &&
    isStr(v.lastName) &&
    isStr(v.email) &&
    isStr(v.phone)
  );
}

export function isAuthUser(v: unknown): v is AuthUser {
  return isStoredAccount(v) && isRecord(v) && v.isLoggedIn === true;
}

export type AccountsMap = Record<string, StoredAccount>;

export function isAccountsMap(v: unknown): v is AccountsMap {
  return isRecord(v) && Object.values(v).every(isStoredAccount);
}

export interface RoyalState {
  since: string; // ISO date of the first purchase (the coronation)
  purchases: number;
}

export function isRoyalState(v: unknown): v is RoyalState {
  if (typeof v !== "object" || v === null) return false;
  const r = v as Record<string, unknown>;
  return typeof r.since === "string" && typeof r.purchases === "number" && Number.isFinite(r.purchases) && r.purchases >= 1;
}
