import { useState, type FormEvent } from "react";
import { cn } from "../../utils/cn";
import { formatDate } from "../../utils/format";
import { validateReview } from "../../utils/validation";
import type { Review } from "../../types/product";
import { Button } from "../ui/Button";
import { StarIcon } from "../ui/icons";
import { StarRating } from "../ui/StarRating";

interface ReviewsPanelProps {
  reviews: Review[];
  author: string; // name the new review will be posted under
  onAdd: (review: Pick<Review, "rating" | "comment">) => void;
}

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];
const MAX_COMMENT = 500;
const STARS = [5, 4, 3, 2, 1] as const;

function initials(name: string): string {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
  return letters || "G";
}

/** Big average, star count and a bar per star level. */
function RatingSummary({ reviews }: { reviews: Review[] }) {
  const total = reviews.length;
  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / total;
  const counts = STARS.map((star) => reviews.filter((r) => Math.round(r.rating) === star).length);

  return (
    <div className="grid gap-6 rounded-xl border border-line bg-card p-6 sm:grid-cols-[12rem_minmax(0,1fr)] sm:p-8">
      <div className="flex flex-col items-center justify-center gap-1.5 text-center sm:border-r sm:border-line sm:pr-6">
        <p className="font-display text-6xl font-semibold leading-none">{average.toFixed(1)}</p>
        <StarRating value={average} size={18} />
        <p className="text-sm text-muted">
          Based on {total} {total === 1 ? "review" : "reviews"}
        </p>
      </div>
      <ul aria-label="Rating breakdown" className="space-y-2.5 self-center">
        {STARS.map((star, i) => (
          <li key={star} className="flex items-center gap-3 text-sm">
            <span className="w-12 shrink-0 tabular-nums text-muted">{star} star</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-sunken">
              <div className="h-full rounded-full bg-gold-500" style={{ width: `${(counts[i] / total) * 100}%` }} />
            </div>
            <span className="w-6 text-right tabular-nums text-muted">{counts[i]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <li className="flex gap-4 rounded-xl border border-line bg-card p-5">
      <span
        aria-hidden="true"
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-crimson-700 text-sm font-semibold tracking-wide text-white dark:bg-crimson-600"
      >
        {initials(review.reviewerName)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <p className="font-semibold">{review.reviewerName}</p>
          <time dateTime={review.date} className="text-xs text-muted">
            {formatDate(review.date)}
          </time>
        </div>
        <div className="mt-1">
          <StarRating value={review.rating} size={15} />
        </div>
        <p className="mt-2.5 text-[15px] leading-relaxed">{review.comment}</p>
      </div>
    </li>
  );
}

export function ReviewsPanel({ reviews, author, onAdd }: ReviewsPanelProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const errors = validateReview(rating, comment);
  const shown = hover || rating;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    if (errors.rating || errors.comment) return;
    onAdd({ rating, comment: comment.trim() });
    setRating(0);
    setHover(0);
    setComment("");
    setSubmitted(false);
  }

  return (
    <div className="space-y-8">
      {reviews.length > 0 && <RatingSummary reviews={reviews} />}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <div>
          {reviews.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line px-6 py-12 text-center">
              <p className="font-display text-xl font-semibold">No reviews yet</p>
              <p className="mt-1 text-sm text-muted">Be the first to share what you think of this product.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {reviews.map((r, i) => (
                <ReviewCard key={`${r.date}-${r.reviewerName}-${i}`} review={r} />
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-xl border border-line bg-card p-6 lg:sticky lg:top-24">
          <div>
            <p className="eyebrow text-gold-600 dark:text-gold-400">Your opinion</p>
            <h3 className="mt-1 font-display text-2xl font-semibold">Write a review</h3>
            <p className="mt-1 text-sm text-muted">
              Posting as <strong className="font-semibold text-ink">{author}</strong>
            </p>
          </div>

          <fieldset>
            <legend className="mb-1 text-sm font-semibold">Your rating</legend>
            <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} star${n > 1 ? "s" : ""}, ${RATING_LABELS[n]}`}
                  aria-pressed={n === rating}
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHover(n)}
                  onFocus={() => setHover(n)}
                  onBlur={() => setHover(0)}
                  className={cn(
                    "flex size-11 items-center justify-center rounded-full transition-all hover:scale-110",
                    n <= shown ? "text-gold-500" : "text-ink/25",
                  )}
                >
                  <StarIcon filled={n <= shown} width={28} height={28} />
                </button>
              ))}
              <span className="ml-2 min-w-20 text-sm font-medium text-muted" aria-live="polite">
                {RATING_LABELS[shown] || "Tap a star"}
              </span>
            </div>
            {submitted && errors.rating && <p className="mt-1 text-sm font-medium text-crimson-700 dark:text-crimson-300">{errors.rating}</p>}
          </fieldset>

          <div>
            <label htmlFor="review-comment" className="mb-1.5 block text-sm font-semibold">
              Your review
            </label>
            <textarea
              id="review-comment"
              rows={5}
              maxLength={MAX_COMMENT}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like? How is the quality? Would you recommend it?"
              aria-invalid={submitted && errors.comment ? true : undefined}
              className={cn(
                "w-full resize-y rounded-lg border bg-page px-3.5 py-3 text-base outline-none transition-colors placeholder:text-muted/70 hover:border-ink/40 focus:border-ink focus:ring-2 focus:ring-crimson-500/25",
                submitted && errors.comment ? "border-crimson-500" : "border-line",
              )}
            />
            <div className="mt-1.5 flex items-start justify-between gap-3 text-xs">
              {submitted && errors.comment ? (
                <p className="text-sm font-medium text-crimson-700 dark:text-crimson-300">{errors.comment}</p>
              ) : (
                <p className="text-muted">At least 10 characters.</p>
              )}
              <span className="shrink-0 tabular-nums text-muted">
                {comment.length}/{MAX_COMMENT}
              </span>
            </div>
          </div>

          <Button type="submit" fullWidth>
            Post review
          </Button>
        </form>
      </div>
    </div>
  );
}
