import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { CheckIcon } from "../components/ui/icons";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";
import { useToast } from "../context/ToastContext";
import { useNow } from "../hooks/useNow";
import { Cart } from "../models/Cart";
import type { OrderStatus } from "../types/order";
import { cn } from "../utils/cn";
import { formatDateTime, formatPrice } from "../utils/format";
import { isRecord } from "../utils/guards";
import { getOrderStatus } from "../utils/orders";
import { parseId } from "../utils/url";
import NotFoundPage from "./NotFoundPage";

const STEPS: readonly OrderStatus[] = ["Processing", "Shipped", "Delivered"];

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { orders } = useOrders();
  const { addLines } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const now = useNow(30_000);

  const orderId = parseId(id);
  const order = orderId === null ? undefined : orders.find((o) => o.id === orderId);
  if (!order) return <NotFoundPage />;

  const status = getOrderStatus(order, now);
  const currentStep = STEPS.indexOf(status);
  const justPlaced = isRecord(location.state) && location.state.justPlaced === true;

  function handleReorder() {
    if (!order) return;
    addLines(order.items);
    showToast("Items added to cart ✓");
    navigate("/cart");
  }

  return (
    <div className="space-y-6">
      <Link to="/orders" className="inline-flex min-h-11 items-center text-sm font-semibold text-muted hover:text-ink">
        ← All orders
      </Link>

      {justPlaced && (
        <p role="status" className="rounded-xl bg-gold-50 px-4 py-3 font-medium text-gold-700 dark:bg-gold-500/20 dark:text-gold-100">
          Thank you! Your order has been placed.
        </p>
      )}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Order #{order.number}</h1>
          <p className="text-sm text-muted">Placed {formatDateTime(order.placedAt)}</p>
        </div>
        <OrderStatusBadge status={status} />
      </div>

      <Card className="p-5">
        <ol className="grid grid-cols-3 gap-2" aria-label="Order progress">
          {STEPS.map((step, i) => {
            const done = i <= currentStep;
            return (
              <li key={step} className="flex flex-col items-center gap-2 text-center text-sm">
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full border-2",
                    done ? "border-crimson-700 bg-crimson-700 text-white dark:border-crimson-600 dark:bg-crimson-600" : "border-line text-muted",
                  )}
                >
                  {done ? <CheckIcon width={18} height={18} /> : null}
                </span>
                <span className={done ? "font-semibold" : "text-muted"}>{step}</span>
              </li>
            );
          })}
        </ol>
      </Card>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[30rem] text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr>
                <th className="p-4 font-semibold">Item</th>
                <th className="p-4 font-semibold">Qty</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {order.items.map((item) => (
                <tr key={item.productId}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={item.thumbnail} alt="" width={40} height={40} loading="lazy" className="size-10 rounded-lg bg-tile object-contain mix-blend-multiply" />
                      <span className="font-semibold">{item.title}</span>
                    </div>
                  </td>
                  <td className="p-4 tabular-nums">{item.quantity}</td>
                  <td className="p-4 tabular-nums">{formatPrice(Cart.unitPrice(item))}</td>
                  <td className="p-4 text-right font-semibold tabular-nums">{formatPrice(Cart.lineTotal(item))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <div className="space-y-6">
          <Card className="space-y-1 p-5 text-sm">
            <h2 className="mb-2 font-display text-lg font-semibold">Delivery</h2>
            <p className="font-semibold">{order.shipping.fullName}</p>
            <p>{order.shipping.address}</p>
            <p>{order.shipping.city}</p>
            <p className="text-muted">{order.shipping.email}</p>
          </Card>
          <Card className="space-y-2 p-5 text-sm">
            <h2 className="mb-2 font-display text-lg font-semibold">Totals</h2>
            <div className="flex justify-between"><span className="text-muted">Subtotal</span><span className="tabular-nums">{formatPrice(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="flex justify-between"><span className="text-muted">Discount</span><span className="tabular-nums">−{formatPrice(order.discount)}</span></div>}
            <div className="flex justify-between"><span className="text-muted">Shipping</span><span className="tabular-nums">{order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}</span></div>
            <div className="flex justify-between border-t border-line pt-3 text-base font-bold"><span>Total</span><span className="tabular-nums">{formatPrice(order.total)}</span></div>
          </Card>
          <Button fullWidth onClick={handleReorder}>
            Reorder
          </Button>
        </div>
      </div>
    </div>
  );
}
