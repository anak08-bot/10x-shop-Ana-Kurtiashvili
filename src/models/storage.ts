import { STORAGE_KEYS } from "../constants";
import type { CartState } from "../types/cart";
import type { Order } from "../types/order";
import type { Theme } from "../types/theme";
import type { AuthUser } from "../types/user";
import {
  isAccountsMap,
  isAuthUser,
  isCartState,
  isOrderList,
  isReviewsMap,
  isRoyalState,
  isTheme,
  type AccountsMap,
  type ReviewsMap,
  type RoyalState,
} from "../utils/guards";
import { StorageService } from "./StorageService";

export const cartStorage = new StorageService<CartState>(STORAGE_KEYS.cart, isCartState);
export const ordersStorage = new StorageService<Order[]>(STORAGE_KEYS.orders, isOrderList);
export const themeStorage = new StorageService<Theme>(STORAGE_KEYS.theme, isTheme);
export const userStorage = new StorageService<AuthUser>(STORAGE_KEYS.user, isAuthUser);
export const accountsStorage = new StorageService<AccountsMap>(STORAGE_KEYS.accounts, isAccountsMap);
export const reviewsStorage = new StorageService<ReviewsMap>(STORAGE_KEYS.reviews, isReviewsMap);
export const royalStorage = new StorageService<RoyalState>(STORAGE_KEYS.royal, isRoyalState);
