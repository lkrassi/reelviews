import { useState } from 'react';
import { addReview } from '../../../api/movies/reviews/addReview';
import { useNotifications } from '@/widgets';

interface AddReviewProps {
  movieId: string;
  onSuccess?: () => void;
}

export const AddReview = ({ movieId, onSuccess }: AddReviewProps) => {
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { addNotification } = useNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const userStr = localStorage.getItem('user');
      const accessToken = localStorage.getItem('accessToken');
      if (!userStr || !accessToken)
        throw new Error('Пользователь не авторизован');
      const user = JSON.parse(userStr);
      const requestId = crypto.randomUUID();
      await addReview(accessToken, requestId, {
        createdAt: new Date().toISOString(),
        description,
        movieId,
        rating,
        userId: user.id,
      });
      setDescription('');
      setRating(5);
      setSuccess(true);
      if (onSuccess) {
        onSuccess();
        addNotification({
          type: 'success',
          message: 'Рецензия добавлена',
        });
      }
    } catch (e: any) {
      addNotification({
        type: 'error',
        message: 'Ошибка отправки рецензии',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:gap-4 p-2 sm:p-4 border border-border dark:border-dark-border rounded-md max-w-md w-full mx-auto bg-white dark:bg-dark-bg"
    >
      <textarea
        className="border rounded p-2 resize-none text-sm sm:text-base min-h-[80px] dark:text-white dark:placeholder:text-white placeholder:opacity-85 placeholder:text-black border-border dark:border-dark-border focus:border-primary dark:focus:border-dark-primary"
        placeholder="Ваша рецензия..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        required
      />
      <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3">
        <label className="text-sm sm:text-base dark:text-white">Оценка:</label>
        <div className="flex gap-1 flex-wrap justify-center items-center">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
            <button
              type="button"
              key={num}
              onClick={() => setRating(num)}
              className={`w-10 h-10 sm:w-8 sm:h-8 rounded-[50%] flex items-center justify-center text-xs sm:text-sm font-bold transition-colors focus:bg-yellow-300 focus:text-white outline-0
                ${
                  num <= rating
                    ? 'bg-yellow-400 text-white border-yellow-400'
                    : 'bg-gray-200 text-gray-500 border-gray-300'
                }
                ${!loading ? 'hover:bg-yellow-300 hover:text-white' : ''}`}
              disabled={loading}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="bg-btn dark:bg-dark-btn text-white rounded px-4 py-2 font-semibold hover:bg-hover dark:hover:bg-dark-hover"
        disabled={loading}
      >
        {loading ? 'Отправка...' : 'Добавить рецензию'}
      </button>
    </form>
  );
};
