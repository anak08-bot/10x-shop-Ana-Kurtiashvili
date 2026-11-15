import { StarIcon } from "./icons";

export function StarRating({ value, size = 16 }: { value: number; size?: number }) {
  const rounded = Math.round(value);
  return (
    <span className="inline-flex text-gold-500" role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} filled={n <= rounded} width={size} height={size} />
      ))}
    </span>
  );
}
