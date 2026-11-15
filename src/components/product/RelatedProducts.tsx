import { RELATED_FETCH_LIMIT, RELATED_SHOWN } from "../../constants";
import { useAddToCart } from "../../hooks/useAddToCart";
import { useFetch } from "../../hooks/useFetch";
import type { Product, ProductsResponse } from "../../types/product";
import { categoryProductsUrl } from "../../utils/url";
import { Skeleton } from "../ui/StateMessages";
import { ProductGrid } from "./ProductGrid";

export function RelatedProducts({ product }: { product: Product }) {
  const { state } = useFetch<ProductsResponse>(categoryProductsUrl(product.category, RELATED_FETCH_LIMIT));
  const addToCart = useAddToCart();

  if (state.status === "loading" || state.status === "idle") {
    return (
      <div className="grid gap-5 min-[560px]:grid-cols-2 lg:grid-cols-4" aria-hidden="true">
        {[0, 1, 2, 3].map((n) => (
          <Skeleton key={n} className="h-72" />
        ))}
      </div>
    );
  }
  if (state.status === "error") return null; // related products are a bonus: never block the page

  const related = state.data.products.filter((p) => p.id !== product.id).slice(0, RELATED_SHOWN);
  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="mt-14">
      <h2 id="related-heading" className="mb-5 font-display text-2xl font-semibold">
        You may also like
      </h2>
      <ProductGrid products={related} onAdd={(p) => addToCart(p)} />
    </section>
  );
}
