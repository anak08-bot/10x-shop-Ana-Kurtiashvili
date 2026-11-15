import type { Product } from "../../types/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  onAdd: (product: Product) => void;
}

/** Mobile-first grid: 1 column, 2 on small tablets, 3 on tablets, 4 on desktop. */
export function ProductGrid({ products, onAdd }: ProductGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-5 min-[560px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} onAdd={onAdd} />
        </li>
      ))}
    </ul>
  );
}
