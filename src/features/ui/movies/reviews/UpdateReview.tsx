import { updateReview } from '../../../api/movies/reviews/updateReview';
import { useModal } from '@/widgets/hooks/useModal';
import { useNotifications } from '@/widgets';
import { motion } from 'framer-motion';
import { updateTextFade } from '../../../model/animations';
import { useState } from 'react';

interface UpdateReviewProps {
  reviewId: string;
  initialDescription: string;
  initialRating: number;
  onSuccess?: () => void;
}

export const UpdateReview = ({
  reviewId,
  initialDescription,
  initialRating,
  onSuccess,
}: UpdateReviewProps) => {
  const { openModal, closeModal } = useModal();
  const { addNotification } = useNotifications();
  const [hovered, setHovered] = useState(false);

  const handleOpen = () => {
    let description = initialDescription;
    let rating = initialRating;
    let localLoading = false;

    const modalContent = () => (
      <form
        className="flex flex-col gap-4 p-4"
        onSubmit={async (e) => {
          e.preventDefault();
          localLoading = true;
          try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) throw new Error('Нет токена');
            const requestId = crypto.randomUUID();
            await updateReview(accessToken, requestId, {
              id: reviewId,
              description,
              rating,
            });
            closeModal();
            if (onSuccess) onSuccess();
          } catch (e: any) {
            addNotification({
              type: 'error',
              message: 'Ошибка обновления',
            });
          } finally {
            localLoading = false;
          }
        }}
      >
        <textarea
          className="border rounded p-2 mt-5 resize-none text-sm sm:text-base min-h-[80px] dark:text-white placeholder:dark:text-white border-border dark:border-dark-border focus:border-primary dark:focus:border-dark-primary"
          defaultValue={description}
          onChange={(e) => (description = e.target.value)}
          required
        />
        <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3">
          <label className="text-sm sm:text-base dark:text-white">
            Оценка:
          </label>
          <div className="flex gap-1 flex-wrap justify-center items-center">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
              <button
                type="button"
                key={num}
                onClick={() => {
                  rating = num;
                  openModal(modalContent());
                }}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center text-xs sm:text-sm font-bold transition-colors focus:bg-yellow-300 focus:text-white outline-0
                  ${
                    num <= rating
                      ? 'bg-yellow-400 text-white border-yellow-400'
                      : 'bg-gray-200 text-gray-500 border-gray-300'
                  }
                  hover:bg-yellow-300 hover:text-white`}
                disabled={localLoading}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="bg-btn dark:bg-dark-btn text-white rounded px-4 py-2 font-semibold hover:bg-hover dark:hover:bg-dark-hover"
          disabled={localLoading}
        >
          {localLoading ? 'Сохранение...' : 'Сохранить'}
        </button>
      </form>
    );

    openModal(modalContent());
  };

  return (
    <span
      className="flex flex-col items-center group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <button
        onClick={handleOpen}
        aria-label="Редактировать рецензию"
        className="rounded transition-transform hover:scale-105 focus:scale-105 active:scale-95 text-blue-600"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 16 16"
          fill="none"
          className="text-blue-600 align-middle"
        >
          <path
            fill="currentColor"
            d="M7.46 2a5.52 5.52 0 0 0-3.91 1.61a5.44 5.44 0 0 0-1.54 2.97a.503.503 0 0 1-.992-.166a6.514 6.514 0 0 1 6.44-5.41a6.55 6.55 0 0 1 4.65 1.93l1.89 2.21v-2.64a.502.502 0 0 1 1.006 0v4a.5.5 0 0 1-.503.5h-3.99a.5.5 0 0 1-.503-.5c0-.275.225-.5.503-.5h2.91l-2.06-2.4a5.53 5.53 0 0 0-3.9-1.6zm1.09 12a5.52 5.52 0 0 0 3.91-1.61A5.44 5.44 0 0 0 14 9.42a.504.504 0 0 1 .992.166a6.514 6.514 0 0 1-6.44 5.41a6.55 6.55 0 0 1-4.65-1.93l-1.89-2.21v2.64a.501.501 0 0 1-.858.353a.5.5 0 0 1-.148-.354v-4c0-.276.225-.5.503-.5H5.5c.278 0 .503.224.503.5s-.225.5-.503.5H2.59l2.06 2.4a5.53 5.53 0 0 0 3.9 1.6z"
          />
        </svg>
      </button>
      <motion.span
        className="text-blue-600 text-xs font-semibold select-none pointer-events-none ml-1"
        variants={updateTextFade}
        initial="hidden"
        animate={hovered ? 'visible' : 'hidden'}
      >
        Изменить
      </motion.span>
    </span>
  );
};
