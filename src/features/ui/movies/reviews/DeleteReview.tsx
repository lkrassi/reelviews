import { useState } from 'react';
import { deleteReview } from '../../../api/movies/reviews/deleteReview';
import { useNotifications } from '@/widgets';
import { motion } from 'framer-motion';
import { deleteTextFade } from '../../../model/animations';

interface DeleteReviewProps {
  reviewId: string;
  onSuccess?: () => void;
}

export const DeleteReview = ({ reviewId, onSuccess }: DeleteReviewProps) => {
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotifications();
  const [hovered, setHovered] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) throw new Error('Нет токена');
      const requestId = crypto.randomUUID();
      await deleteReview(accessToken, requestId, reviewId);
      if (onSuccess) {
        onSuccess();
        addNotification({
          type: 'success',
          message: 'Рецензия удалена',
        });
      }
    } catch (e: any) {
      addNotification({
        type: 'error',
        message: 'Ошибка удаления',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex flex-col group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <button
        onClick={handleDelete}
        disabled={loading}
        aria-label="Удалить рецензию"
        className="rounded transition-transform hover:scale-103 focus:scale-103 active:scale-97"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 256 256"
          className="text-red-600"
        >
          <path
            fill="currentColor"
            d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16ZM96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Zm48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Z"
          />
        </svg>
      </button>
      <motion.span
        className="text-red-600 text-xs text-center font-semibold select-none pointer-events-none"
        variants={deleteTextFade}
        initial="hidden"
        animate={hovered ? 'visible' : 'hidden'}
      >
        Удалить
      </motion.span>
    </motion.div>
  );
};
