import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { CartTotals } from "../components/cart/CartTotals";
import { Button, buttonClasses } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { CrownIcon } from "../components/ui/icons";
import { FormField } from "../components/ui/FormField";
import { Cart } from "../models/Cart";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";
import { useRoyal } from "../context/RoyalContext";
import type { Order, ShippingInfo } from "../types/order";
import { formatPrice } from "../utils/format";
import { createOrder } from "../utils/orders";
import { validateShipping } from "../utils/validation";

type Status = "idle" | "submitting" | "error";
type Touched = Partial<Record<keyof ShippingInfo, boolean>>;

export default function CheckoutPage() {
  const { items, cart, clearCart } = useCart();
  const { user } = useAuth();
  const { orders, addOrder } = useOrders();
  const { celebratePurchase } = useRoyal();

  // Controlled form: every input's value lives in React state.
  const [values, setValues] = useState<ShippingInfo>(() => ({
    fullName: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
    email: user?.email ?? "",
    address: "",
    city: "",
  }));
  const [touched, setTouched] = useState<Touched>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [placed, setPlaced] = useState<Order | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const errors = validateShipping(values);
  const hasErrors = Object.keys(errors).length > 0;
  const errorFor = (name: keyof ShippingInfo) => (touched[name] || submitted ? errors[name] : undefined);

  const bind = (name: keyof ShippingInfo) => ({
    name,
    value: values[name],
    error: errorFor(name),
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValues((v) => ({ ...v, [name]: value }));
    },
    onBlur: () => setTouched((t) => ({ ...t, [name]: true })),
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // no page reload
    if (status === "submitting") return;
    setSubmitted(true);
    if (hasErrors) {
      formRef.current?.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    setStatus("submitting");
  }

  // Order placement is simulated: a short delay, then a local order. The timer is cleared on unmount.
  useEffect(() => {
    if (status !== "submitting") return;
    const timer = window.setTimeout(() => {
      try {
        const order = createOrder(cart, items, values, orders);
        addOrder(order);
        clearCart();
        setPlaced(order);
        setStatus("idle");
        celebratePurchase(order.total); // the crown leaps onto the screen
      } catch {
        setStatus("error"); // the form values stay exactly as the user typed them
      }
    }, 700);
    return () => window.clearTimeout(timer);
  }, [status, cart, items, values, orders, addOrder, clearCart, celebratePurchase]);

  if (placed) {
    return (
      <Card className="mx-auto max-w-xl p-6 text-center sm:p-10">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full border-2 border-gold-500 bg-linear-to-b from-crimson-600 to-crimson-900 text-gold-300 shadow-lg shadow-crimson-900/40">
          <CrownIcon className="size-9" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-semibold sm:text-4xl">Thank you, Your Majesty! Your order has been placed.</h1>
        <p className="mt-2 text-muted">
          Order {placed.number} · Total {formatPrice(placed.total)}
        </p>
        <p className="mt-1 text-sm text-muted">
          We will send it to {placed.shipping.address}, {placed.shipping.city}.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to={`/orders/${placed.id}`} className={buttonClasses("primary")}>
            View order
          </Link>
          <Link to="/" className={buttonClasses("secondary")}>
            Continue shopping
          </Link>
        </div>
      </Card>
    );
  }

  if (items.length === 0) {
    return <Navigate to="/cart" replace state={{ notice: "Your cart is empty. Add something before checking out." }} />;
  }

  const busy = status === "submitting";

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">Checkout</h1>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <form ref={formRef} onSubmit={handleSubmit} noValidate>
          <Card className="p-5 sm:p-7">
            <fieldset disabled={busy} className="space-y-4">
              <legend className="mb-2 font-display text-xl font-semibold">Delivery details</legend>
              <FormField label="Full name" autoComplete="name" {...bind("fullName")} />
              <FormField label="Email" type="email" autoComplete="email" {...bind("email")} />
              <FormField label="Address" autoComplete="street-address" {...bind("address")} />
              <FormField label="City" autoComplete="address-level2" {...bind("city")} />
            </fieldset>
            {status === "error" && (
              <p role="alert" className="mt-4 rounded-xl bg-crimson-50 px-4 py-3 text-sm font-medium text-crimson-800 dark:bg-crimson-500/10 dark:text-crimson-200">
                We could not place your order. Your details are still here, please try again.
              </p>
            )}
            <Button type="submit" fullWidth className="mt-6" disabled={busy}>
              {busy ? "Placing order…" : `Place order · ${formatPrice(cart.total())}`}
            </Button>
          </Card>
        </form>

        <Card className="space-y-5 p-5 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-semibold">Order summary</h2>
          <ul className="divide-y divide-line">
            {items.map((item) => (
              <li key={item.productId} className="flex items-center gap-3 py-3 first:pt-0">
                <img src={item.thumbnail} alt="" width={48} height={48} loading="lazy" className="size-12 shrink-0 rounded-lg bg-tile object-contain mix-blend-multiply" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-muted">Qty {item.quantity}</p>
                </div>
                <span className="text-sm font-semibold tabular-nums">{formatPrice(Cart.lineTotal(item))}</span>
              </li>
            ))}
          </ul>
          <CartTotals cart={cart} />
        </Card>
      </div>
    </div>
  );
}
