import { cn } from "../../utils/cn";

export function StockBadge({ stock }: { stock: number }) {
  const [text, style] =
    stock === 0
      ? ["Out of stock", "bg-crimson-100 text-crimson-800 dark:bg-crimson-500/20 dark:text-crimson-100"]
      : stock <= 5
        ? [`Only ${stock} left!`, "bg-gold-100 text-gold-700 dark:bg-gold-500/20 dark:text-gold-100"]
        : ["In stock", "bg-sunken text-muted"];
  return <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold", style)}>{text}</span>;
}
