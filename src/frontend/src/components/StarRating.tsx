import { Star } from "lucide-react";

interface StarRatingProps {
  rating: bigint;
  size?: "sm" | "md";
}

export default function StarRating({ rating, size = "sm" }: StarRatingProps) {
  const numRating = Number(rating) / 10;
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < Math.floor(numRating)) return "full";
    if (i < numRating) return "half";
    return "empty";
  });
  const iconSize = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {stars.map((type, i) => (
        <Star
          key={`star-${i}-${type}`}
          className={`${iconSize} ${type !== "empty" ? "fill-orange-brand text-orange-brand" : "text-gray-300"}`}
        />
      ))}
      <span
        className={`ml-1 ${size === "sm" ? "text-xs" : "text-sm"} text-muted-foreground`}
      >
        {numRating.toFixed(1)}
      </span>
    </div>
  );
}
