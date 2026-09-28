import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number; // 0 to 5
  totalReviews?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  totalReviews,
  size = 'md',
  showNumber = true,
}) => {
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base font-semibold',
  }[size];

  return (
    <div className="inline-flex items-center gap-1 text-amber-500">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const filled = starIndex <= Math.round(rating);
          return (
            <Star
              key={starIndex}
              className={`${iconSizes} ${
                filled
                  ? 'text-amber-500 fill-amber-400'
                  : 'text-sand-300 fill-sand-100'
              }`}
            />
          );
        })}
      </div>
      {showNumber && (
        <span className={`font-medium text-charcoal-800 ml-0.5 ${textSizes}`}>
          {rating.toFixed(1)}
        </span>
      )}
      {totalReviews !== undefined && (
        <span className="text-sand-600 text-xs ml-0.5">({totalReviews})</span>
      )}
    </div>
  );
};
