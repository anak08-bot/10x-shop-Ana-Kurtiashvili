import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { STORAGE_KEYS } from "../../constants";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import type { Product, Review } from "../../types/product";
import { cn } from "../../utils/cn";
import { prettifySlug, round2 } from "../../utils/format";
import { isReviewsMap, type ReviewsMap } from "../../utils/guards";
import { Button } from "../ui/Button";
import { QuantityStepper } from "../ui/QuantityStepper";
import { StarRating } from "../ui/StarRating";
import { PriceBlock } from "./PriceBlock";
import { ProductGallery } from "./ProductGallery";
import { RelatedProducts } from "./RelatedProducts";
import { ReviewsPanel } from "./ReviewsPanel";
import { StockBadge } from "./StockBadge";

type Tab = "description" | "reviews";
type Feedback = { kind: "success" | "error"; text: string };

export function ProductDetails({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>("description");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [localReviews, setLocalReviews] = useLocalStorage<ReviewsMap>(STORAGE_KEYS.reviews, {}, isReviewsMap);

  const reviewerName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || user?.username || "Guest";
  const key = String(product.id);
  const images = product.images.length > 0 ? product.images : [product.thumbnail];
  const outOfStock = product.stock === 0;

  // Local reviews first (newest on top), then the ones that came from the API.
  const reviews = useMemo<Review[]>(() => [...(localReviews[key] ?? []), ...product.reviews], [localReviews, key, product.reviews]);
  const averageRating = useMemo(
    () => (reviews.length > 0 ? round2(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) : product.rating),
    [reviews, product.rating],
  );

  function handleBack() {
    // "default" means this page was opened directly, so there is nothing to go back to.
    if (location.key !== "default") navigate(-1);
    else navigate("/");
  }

  function handleAdd() {
    const result = addItem(product, qty);
    if (result.ok) {
      setFeedback({ kind: "success", text: `Added ${qty} to your cart.` });
      showToast("Added to cart ✓");
    } else {
      setFeedback({ kind: "error", text: result.message });
      showToast(result.message, "error");
    }
  }

  function handleAddReview(input: Pick<Review, "rating" | "comment">) {
    const review: Review = { ...input, date: new Date().toISOString(), reviewerName };
    setLocalReviews((prev) => ({ ...prev, [key]: [review, ...(prev[key] ?? [])] }));
    showToast("Review added ✓");
  }

  const tabButton = (id: Tab, label: string) => (
    <button
      type="button"
      role="tab"
      id={`tab-${id}`}
      aria-selected={tab === id}
      aria-controls={`panel-${id}`}
      onClick={() => setTab(id)}
      className={cn(
        "min-h-11 border-b-2 px-4 text-sm font-semibold transition-colors hover:text-crimson-600",
        tab === id ? "border-crimson-600 text-crimson-600 dark:border-crimson-500 dark:text-crimson-500" : "border-transparent text-muted",
      )}
    >
      {label}
    </button>
  );

  return (
    <div>
      <button type="button" onClick={handleBack} className="mb-5 inline-flex min-h-11 items-center text-sm font-semibold text-muted hover:text-ink">
        ← Back to catalog
      </button>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={images} title={product.title} />

        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium text-muted">
              {product.brand && <span>{product.brand}, </span>}
              <Link to={`/?category=${encodeURIComponent(product.category)}`} className="underline underline-offset-2 hover:text-ink">
                {prettifySlug(product.category)}
              </Link>
            </p>
            <h1 className="mt-1 font-display text-3xl font-semibold leading-tight sm:text-4xl">{product.title}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <StarRating value={averageRating} />
            <span className="font-semibold">{averageRating.toFixed(1)}</span>
            <span className="text-muted">
              ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
            </span>
          </div>

          <PriceBlock price={product.price} discountPercentage={product.discountPercentage} size="lg" />
          <StockBadge stock={product.stock} />

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <QuantityStepper value={qty} max={product.stock} disabled={outOfStock} onChange={setQty} />
            <Button onClick={handleAdd} disabled={outOfStock} className="flex-1 sm:flex-none sm:px-10">
              {outOfStock ? "Out of stock" : "Add to cart"}
            </Button>
          </div>
          {feedback && (
            <p
              role="status"
              className={cn("text-sm font-medium", feedback.kind === "success" ? "text-gold-700 dark:text-gold-100" : "text-crimson-700 dark:text-crimson-300")}
            >
              {feedback.text}{" "}
              {feedback.kind === "success" && (
                <Link to="/cart" className="underline underline-offset-2">
                  View cart
                </Link>
              )}
            </p>
          )}
        </div>
      </div>

      <section className="mt-12">
        <div role="tablist" aria-label="Product information" className="flex border-b border-line">
          {tabButton("description", "Description")}
          {tabButton("reviews", `Reviews (${reviews.length})`)}
        </div>
        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="pt-6">
          {tab === "description" ? <p className="max-w-prose leading-relaxed">{product.description}</p> : <ReviewsPanel reviews={reviews} author={reviewerName} onAdd={handleAddReview} />}
        </div>
      </section>

      <RelatedProducts product={product} />
    </div>
  );
}
