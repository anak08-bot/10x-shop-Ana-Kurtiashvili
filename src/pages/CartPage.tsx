import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartLine } from "../components/cart/CartLine";
import { CartTotals } from "../components/cart/CartTotals";
import { PromoForm } from "../components/cart/PromoForm";
import { Button, buttonClasses } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/StateMessages";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { getNotice } from "../utils/routerState";

export default function CartPage() {
  const { items, cart, promoCode, setQuantity, removeItem, clearCart, applyPromo, removePromo } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const notice = getNotice(useLocation().state);

  function handleRemove(productId: number) {
    removeItem(productId);
    showToast("Removed from cart", "info");
  }

  function handleClear() {
    if (window.confirm("Clear the cart? This cannot be undone.")) clearCart();
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">Your cart</h1>

      {notice && (
        <p role="status" className="rounded-xl bg-gold-100 px-4 py-3 text-sm font-medium text-gold-700 dark:bg-gold-500/15 dark:text-gold-500">
          {notice}
        </p>
      )}

      {items.length === 0 ? (
        <EmptyState title="Your cart is empty.">
          <p>Add a few things you like and they will show up here.</p>
          <Link to="/" className={buttonClasses("primary")}>
            Browse products
          </Link>
        </EmptyState>
      ) : (
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <section aria-label="Items in your cart">
            <ul className="divide-y divide-line rounded-2xl border border-line bg-card px-4 sm:px-6">
              {items.map((item) => (
                <CartLine key={item.productId} item={item} onQuantity={setQuantity} onRemove={handleRemove} />
              ))}
            </ul>
            <Button variant="danger" className="mt-4" onClick={handleClear}>
              Clear cart
            </Button>
          </section>

          <Card className="space-y-5 p-5 lg:sticky lg:top-24">
            <h2 className="font-display text-xl font-semibold">Order summary</h2>
            <CartTotals cart={cart} />
            <PromoForm appliedCode={promoCode} onApply={applyPromo} onRemove={removePromo} />
            <Button fullWidth onClick={() => navigate("/checkout")}>
              Proceed to checkout
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
