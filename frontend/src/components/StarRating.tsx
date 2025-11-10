import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  editable?: boolean;
  onChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showNumber = false,
  editable = false,
  onChange,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const iconSize = sizeClasses[size];

  const handleClick = (index: number) => {
    if (editable && onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const isFilled = index < Math.floor(rating);
        const isHalf = !isFilled && index < rating;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(index)}
            disabled={!editable}
            className={`${editable ? "cursor-pointer hover:scale-110" : "cursor-default"
              } transition-transform`}
          >
            <Star
              className={`${iconSize} ${isFilled
                ? "fill-yellow-400 text-yellow-400"
                : isHalf
                  ? "fill-yellow-200 text-yellow-400"
                  : "text-gray-300"
                }`}
            />
          </button>
        );
      })}
      {showNumber && (
        <span className="ml-2 text-sm font-medium text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
