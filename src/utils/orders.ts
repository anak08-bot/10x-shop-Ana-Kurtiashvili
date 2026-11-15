import type { Cart } from "../models/Cart";
import type { Order, OrderStatus, ShippingInfo } from "../types/order";

/** Status is never stored: it is computed from the time passed since the order was placed. */
export function getOrderStatus(order: Order, now: Date): OrderStatus {
  const minutes = (now.getTime() - new Date(order.placedAt).getTime()) / 60000;
  if (minutes < 1) return "Processing";
  if (minutes <= 3) return "Shipped";
  return "Delivered";
}

export function createOrder(cart: Cart, items: Order["items"], shipping: ShippingInfo, existing: readonly Order[]): Order {
  return {
    id: Date.now(),
    number: `10X-${String(existing.length + 1).padStart(5, "0")}`,
    items: items.map((i) => ({ ...i })),
    shipping: { ...shipping },
    subtotal: cart.subtotal(),
    discount: cart.discount(),
    shippingCost: cart.shipping(),
    total: cart.total(),
    placedAt: new Date().toISOString(),
  };
}
