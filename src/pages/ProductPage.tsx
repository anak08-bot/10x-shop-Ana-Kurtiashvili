import { useParams } from "react-router-dom";
import { ProductDetails } from "../components/product/ProductDetails";
import { ErrorMessage, Skeleton } from "../components/ui/StateMessages";
import { useFetch } from "../hooks/useFetch";
import type { Product } from "../types/product";
import { parseId, productUrl } from "../utils/url";
import NotFoundPage from "./NotFoundPage";

export default function ProductPage() {
  const { id } = useParams();
  const productId = parseId(id);
  // An invalid id ("abc", "0") never reaches the network: path = null skips the request.
  const { state, retry } = useFetch<Product>(productId === null ? null : productUrl(productId));

  if (productId === null) return <NotFoundPage />;
  if (state.status === "error") {
    return state.httpStatus === 404 ? <NotFoundPage /> : <ErrorMessage message={state.message} onRetry={retry} />;
  }
  // `data.id !== productId` covers the one render between "id changed" and "new request started".
  if (state.status !== "success" || state.data.id !== productId) {
    return (
      <div aria-busy="true" role="status" className="grid gap-8 lg:grid-cols-2">
        <span className="sr-only">Loading product…</span>
        <Skeleton className="aspect-square" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-12 w-1/2" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }
  // key = id: switching to another product (e.g. from "related") resets quantity, gallery and tabs.
  return <ProductDetails key={state.data.id} product={state.data} />;
}
