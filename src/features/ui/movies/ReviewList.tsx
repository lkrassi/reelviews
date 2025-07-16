import { FC } from 'react';
import { MovieReview } from '../../api/movies/getMovieFull';

interface ReviewListProps {
  reviews: MovieReview[];
  className?: string;
}

export const ReviewList: FC<ReviewListProps> = ({ reviews, className }) => {
  const safeReviews = (reviews || []).filter(Boolean);
  if (!safeReviews.length) {
    return (
      <div className="text-text dark:text-dark-text opacity-60">
        Нет отзывов
      </div>
    );
  }
  return (
    <div className={`flex flex-col gap-4 ${className || ''}`}>
      {safeReviews.map((review) => {
        if (!review) return null;
        return (
          <div
            key={review.id}
            className="bg-secondary dark:bg-dark-secondary rounded-lg p-4 shadow border border-border dark:border-dark-border"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-accent dark:text-dark-accent text-base">
                ★ {review.rating}
              </span>
              <span className="text-xs text-text dark:text-dark-text opacity-60">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="text-text dark:text-dark-text text-sm">
              {review.description}
            </div>
          </div>
        );
      })}
    </div>
  );
};
