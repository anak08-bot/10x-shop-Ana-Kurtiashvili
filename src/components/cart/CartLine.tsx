import { Link } from "react-router-dom";
import { Cart } from "../../models/Cart";
import type { CartItem } from "../../types/cart";
import { formatPrice } from "../../utils/format";
import { productUrl } from "../../utils/url";
import { Button } from "../ui/Button";
import { QuantityStepper } from "../ui/QuantityStepper";

interface CartLineProps {
  item: CartItem;
  onQuantity: (productId: number, qty: number) => void;
  onRemove: (productId: number) => void;
}

export function CartLine({ item, onQuantity, onRemove }: CartLineProps) {
  return (
    <li className="grid grid-cols-[5rem_minmax(0,1fr)] gap-x-4 gap-y-3 py-5 sm:grid-cols-[6rem_minmax(0,1fr)_auto]">
      <Link to={productUrl(item.productId)} className="row-span-2 size-20 overflow-hidden rounded-xl bg-tile sm:size-24 sm:row-span-1">
        <img src={item.thumbnail} alt="" width={96} height={96} loading="lazy" className="size-full object-contain mix-blend-multiply" />
      </Link>
      <div className="min-w-0">
        <Link to={productUrl(item.productId)} className="line-clamp-2 font-semibold hover:text-crimson-600 dark:hover:text-crimson-500">
          {item.title}
        </Link>
        <p className="mt-1 text-sm text-muted">{formatPrice(Cart.unitPrice(item))} each</p>
        {item.quantity >= item.stock && <p className="mt-1 text-xs font-medium text-gold-700 dark:text-gold-500">Maximum available quantity</p>}
      </div>
      <div className="col-span-2 col-start-1 flex flex-wrap items-center justify-between gap-3 sm:col-span-1 sm:col-start-3 sm:row-start-1 sm:flex-col sm:items-end">
        <QuantityStepper
          value={item.quantity}
          max={item.stock}
          label={`Quantity for ${item.title}`}
          onChange={(next) => onQuantity(item.productId, next)}
        />
        <div className="flex items-center gap-3">
          <span className="font-display text-lg font-semibold tabular-nums">{formatPrice(Cart.lineTotal(item))}</span>
          <Button variant="ghost" className="px-3 text-crimson-700 dark:text-crimson-300" onClick={() => onRemove(item.productId)} aria-label={`Remove ${item.title} from cart`}>
            Remove
          </Button>
        </div>
      </div>
    </li>
  );
}
