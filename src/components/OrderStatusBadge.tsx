import type { OrderStatus } from "../types/order";
import { cn } from "../utils/cn";

const STYLES: Record<OrderStatus, string> = {
  Processing: "bg-sunken text-muted",
  Shipped: "bg-navy-800/10 text-navy-800 dark:bg-white/10 dark:text-ivory",
  Delivered: "bg-gold-500 text-navy-950",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={cn("inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-wide", STYLES[status])}>{status}</span>;
}
