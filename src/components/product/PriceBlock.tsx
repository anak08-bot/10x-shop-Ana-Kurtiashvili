import { cn } from "../../utils/cn";
import { discountedPrice, formatDiscount, formatPrice } from "../../utils/format";

interface PriceBlockProps {
  price: number;
  discountPercentage: number;
  size?: "md" | "lg";
}

export function PriceBlock({ price, discountPercentage, size = "md" }: PriceBlockProps) {
  const hasDiscount = discountPercentage >= 1;
  return (
    <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
      <span className={cn("font-display font-semibold tabular-nums", size === "lg" ? "text-3xl" : "text-xl")}>
        {formatPrice(discountedPrice(price, discountPercentage))}
      </span>
      {hasDiscount && (
        <>
          <span className="text-sm text-muted line-through tabular-nums">{formatPrice(price)}</span>
          <span className="rounded-full bg-crimson-600 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-white">
            {formatDiscount(discountPercentage)}
          </span>
        </>
      )}
    </div>
  );
}
