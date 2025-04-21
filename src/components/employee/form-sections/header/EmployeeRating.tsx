import { Star } from "lucide-react";

interface EmployeeRatingProps {
  rating: number;
}

export function EmployeeRating({ rating }: EmployeeRatingProps) {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star 
          key={`full-${i}`} 
          className="h-4 w-4 fill-yellow-400 text-yellow-400" 
        />
      );
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative w-4 h-4">
          <Star className="absolute h-4 w-4 text-yellow-400" />
          <div className="absolute overflow-hidden w-[50%]">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }
    
    // Add empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star 
          key={`empty-${i}`} 
          className="h-4 w-4 text-gray-300" 
        />
      );
    }
    
    return stars;
  };

  return (
    <div className="flex items-center mt-1 space-x-0.5">
      {renderStars()}
      <span className="ml-2 text-sm text-gray-500">
        ({rating.toFixed(1)})
      </span>
    </div>
  );
}