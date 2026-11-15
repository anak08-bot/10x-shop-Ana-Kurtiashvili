import { Link } from "react-router-dom";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { buttonClasses } from "../components/ui/Button";
import { EmptyState } from "../components/ui/StateMessages";
import { useOrders } from "../context/OrdersContext";
import { useNow } from "../hooks/useNow";
import { formatDate, formatPrice } from "../utils/format";
import { getOrderStatus } from "../utils/orders";

export default function OrdersPage() {
  const { orders } = useOrders();
  const now = useNow(30_000); // statuses are re-calculated every 30 s, no reload needed

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">Your orders</h1>
      {orders.length === 0 ? (
        <EmptyState title="You have no orders yet.">
          <Link to="/" className={buttonClasses("primary")}>
            Browse products
          </Link>
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => {
            const count = order.items.reduce((n, i) => n + i.quantity, 0);
            return (
              <li key={order.id}>
                <Link
                  to={`/orders/${order.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-card p-5 transition-shadow hover:shadow-lg"
                >
                  <div>
                    <p className="font-display text-lg font-semibold">#{order.number}</p>
                    <p className="text-sm text-muted">
                      {formatDate(order.placedAt)} · {count} {count === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <OrderStatusBadge status={getOrderStatus(order, now)} />
                    <span className="font-display text-lg font-semibold tabular-nums">{formatPrice(order.total)}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
