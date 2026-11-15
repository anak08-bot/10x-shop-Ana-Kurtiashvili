import { Cart } from "../../models/Cart";
import { formatPrice } from "../../utils/format";

function Row({ label, value, strong, accent }: { label: string; value: string; strong?: boolean; accent?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between gap-4 ${strong ? "border-t border-line pt-3 text-lg font-bold" : "text-sm"}`}>
      <dt className={strong ? "" : "text-muted"}>{label}</dt>
      <dd className={`tabular-nums ${accent ? "font-semibold text-gold-700 dark:text-gold-100" : ""}`}>{value}</dd>
    </div>
  );
}

/** Subtotal / Discount / Shipping / Total, shared by the Cart and Checkout pages. */
export function CartTotals({ cart }: { cart: Cart }) {
  const missing = cart.amountToFreeShipping();
  return (
    <div>
      <dl className="space-y-2.5">
        <Row label="Subtotal" value={formatPrice(cart.subtotal())} />
        {cart.hasPromo && <Row label={`Discount (${Cart.PROMO_CODE} −${Cart.PROMO_RATE * 100}%)`} value={`−${formatPrice(cart.discount())}`} accent />}
        <Row label="Shipping" value={cart.shipping() === 0 ? "Free" : formatPrice(cart.shipping())} accent={cart.shipping() === 0} />
        <Row label="Total" value={formatPrice(cart.total())} strong />
      </dl>
      {missing > 0 && (
        <p className="mt-3 rounded-lg bg-gold-100 px-3 py-2 text-xs font-medium text-gold-700 dark:bg-gold-500/15 dark:text-gold-500">
          Add {formatPrice(missing)} more for free shipping.
        </p>
      )}
    </div>
  );
}
