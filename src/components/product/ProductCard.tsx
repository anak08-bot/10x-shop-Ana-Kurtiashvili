import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import { prettifySlug } from "../../utils/format";
import { productUrl } from "../../utils/url";
import { Button } from "../ui/Button";
import { GiltFrame } from "../ui/GiltFrame";
import { StarIcon } from "../ui/icons";
import { PriceBlock } from "./PriceBlock";
import { StockBadge } from "./StockBadge";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const outOfStock = product.stock === 0;
  return (
    <article className="group relative h-full">
      {/* The whole card is a gilded painting: frame -> canvas (the product) -> brass placard (the details). */}
      <GiltFrame className="flex h-full flex-col" canvasClassName="flex flex-1 flex-col">
        <div className="painting aspect-square">
          <img
            src={product.thumbnail}
            alt=""
            width={300}
            height={300}
            loading="lazy"
            className="relative z-0 size-full object-contain p-5 mix-blend-multiply drop-shadow-[0_6px_6px_rgba(60,30,0,0.25)] transition-transform duration-500 group-hover:scale-105"
          />
          {product.stock <= 5 && (
            <span className="absolute left-2 top-2 z-10 [&>span]:border [&>span]:border-gold-500 [&>span]:bg-crimson-800 [&>span]:text-gold-100 [&>span]:shadow-md">
              <StockBadge stock={product.stock} />
            </span>
          )}
        </div>
        <div className="placard flex flex-1 flex-col gap-2.5">
          <p className="eyebrow truncate text-center text-gold-700 dark:text-gold-400">
            {prettifySlug(product.category)}
            {product.brand ? ` · ${product.brand}` : ""}
          </p>
          <h3 className="placard-title line-clamp-2 min-h-[2.5rem]">
            {/* The link stretches over the whole card; the button below sits above it. */}
            <Link to={productUrl(product.id)} className="after:absolute after:inset-0 after:z-[5] after:content-[''] hover:text-crimson-600 dark:hover:text-gold-400">
              {product.title}
            </Link>
          </h3>
          <div className="flex justify-center">
            <PriceBlock price={product.price} discountPercentage={product.discountPercentage} />
          </div>
          <div className="flex min-h-6 items-center justify-center">
            <span className="inline-flex items-center gap-1 text-sm font-medium text-muted">
              <StarIcon filled width={14} height={14} className="text-gold-500" />
              {product.rating.toFixed(1)}
            </span>
          </div>
          <Button
            variant="secondary"
            className="relative z-10 mt-auto"
            fullWidth
            disabled={outOfStock}
            onClick={() => onAdd(product)}
            aria-label={outOfStock ? `${product.title} is out of stock` : `Add ${product.title} to cart`}
          >
            {outOfStock ? "Out of stock" : "Add to cart"}
          </Button>
        </div>
      </GiltFrame>
    </article>
  );
}
