
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RatingSelectorProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

export function RatingSelector({ rating, onRatingChange }: RatingSelectorProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          variant="ghost"
          size="sm"
          className="p-0 h-auto"
          onClick={() => onRatingChange(star)}
        >
          <Star
            className={`h-4 w-4 ${
              star <= rating ? "text-warning fill-warning" : "text-muted"
            }`}
          />
        </Button>
      ))}
    </div>
  );
}
