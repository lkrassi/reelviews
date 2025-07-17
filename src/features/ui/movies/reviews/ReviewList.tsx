import { FC } from 'react';
import { MovieReview } from '../../../api/movies/getMovieFull';
import { Review } from './Review';

interface ReviewListProps {
  reviews: MovieReview[];
  className?: string;
  onDeleteSuccess?: () => void;
}

export const ReviewList: FC<ReviewListProps> = ({
  reviews,
  className,
  onDeleteSuccess,
}) => {
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
      {safeReviews.map((review) => (
        <Review key={review.id} review={review} onDelete={onDeleteSuccess} />
      ))}
    </div>
  );
};
