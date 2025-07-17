import { FC } from 'react';
import { MovieReview } from '../../../api/movies/getMovieFull';
import { DeleteReview } from './DeleteReview';
import { UpdateReview } from './UpdateReview';

interface ReviewProps {
  review: MovieReview;
  onDelete?: () => void;
}

export const Review: FC<ReviewProps> = ({ review, onDelete }) => {
  if (!review) return null;

  let isMyReview = false;
  if (typeof window !== 'undefined') {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        isMyReview = user.id === review.userId;
      }
    } catch {}
  }

  return (
    <div className="rounded-lg p-4 w-full flex justify-between shadow border border-border dark:border-dark-border bg-white dark:bg-dark-bg">
      <div className="self-start">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base text-yellow-300">★ {review.rating}</span>
          <span className="text-xs text-text dark:text-dark-text opacity-60">
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="text-text dark:text-dark-text text-sm mb-2">
          {review.description}
        </div>
      </div>
      {isMyReview && (
        <div className="mt-3">
          <UpdateReview
            reviewId={review.id}
            initialDescription={review.description}
            initialRating={review.rating}
            onSuccess={onDelete}
          />
          <DeleteReview reviewId={review.id} onSuccess={onDelete} />
        </div>
      )}
    </div>
  );
};
