import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ordersStorage } from "../models/storage";
import type { Order } from "../types/order";

interface OrdersContextValue {
  orders: Order[]; // newest first
  addOrder: (order: Order) => void;
  clearOrders: () => void;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => ordersStorage.get() ?? []);

  useEffect(() => {
    if (orders.length > 0) ordersStorage.set(orders);
    else ordersStorage.remove();
  }, [orders]);

  const addOrder = useCallback((order: Order) => setOrders((prev) => [order, ...prev]), []);
  const clearOrders = useCallback(() => setOrders([]), []);
  const value = useMemo(() => ({ orders, addOrder, clearOrders }), [orders, addOrder, clearOrders]);
  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders(): OrdersContextValue {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used inside <OrdersProvider>");
  return ctx;
}
