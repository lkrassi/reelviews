'use client';
import { useEffect, useState } from 'react';
import { getMovieFull, MovieFullParams } from '../../api/movies/getMovieFull';
import { useParams } from 'next/navigation';
import { getReviewsById } from '../../api/movies/getMovieReviews';
import { MovieReview } from '../../api/movies/getMovieFull';
import { ReviewList } from './ReviewList';

export const MovieFull = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieFullParams | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allReviews, setAllReviews] = useState<MovieReview[] | null>(null);
  const [allReviewsLoading, setAllReviewsLoading] = useState(false);
  const [allReviewsError, setAllReviewsError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await getMovieFull(id);
        if (!ignore) setMovie(res.data.movie);
      } catch (e: any) {
        if (!ignore) setError(e?.meta?.message || 'Ошибка загрузки фильма');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [id]);

  const handleShowAllReviews = async () => {
    if (!id) return;
    setAllReviewsLoading(true);
    setAllReviewsError(null);
    try {
      let page = 1;
      let all: MovieReview[] = [];
      let hasMore = true;
      while (hasMore) {
        const res = await getReviewsById(page, id, crypto.randomUUID());
        if (!res.data.reviews || res.data.reviews.length === 0) {
          hasMore = false;
          break;
        }
        all = all.concat(res.data.reviews.filter(Boolean));
        hasMore = res.pagination.page < res.pagination.pages;
        page++;
      }
      setAllReviews(all);
    } catch (e: any) {
      setAllReviewsError(e?.meta?.message || 'Ошибка загрузки рецензий');
    } finally {
      setAllReviewsLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Загрузка...</div>;
  if (error)
    return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!movie) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="w-48 h-72 bg-border dark:bg-dark-border rounded-lg flex items-center justify-center overflow-hidden">
          {movie.imgUrl ? (
            <img
              src={movie.imgUrl}
              alt={movie.title}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <span className="text-5xl text-accent dark:text-dark-accent">
              🎬
            </span>
          )}
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-primary dark:text-dark-primary mb-2">
            {movie.title}
          </h1>
          {movie.genres && movie.genres.length > 0 && (
            <div className="text-sm text-text dark:text-dark-text opacity-70 mb-1">
              Жанры: {movie.genres.join(', ')}
            </div>
          )}
          {typeof movie.avgRating === 'number' && (
            <div className="text-lg text-accent dark:text-dark-accent mb-1 flex items-center gap-1">
              <span className="text-2xl">★</span> {movie.avgRating.toFixed(1)}
            </div>
          )}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4 text-primary dark:text-dark-primary">
          Отзывы
        </h2>
        <ReviewList reviews={allReviews || movie.reviews || []} />
        {movie.reviews && movie.reviews.length >= 50 && !allReviews && (
          <button
            className="mb-4 px-4 py-2 rounded bg-accent text-white dark:bg-dark-accent hover:opacity-90 transition disabled:opacity-60"
            onClick={handleShowAllReviews}
            disabled={allReviewsLoading}
          >
            {allReviewsLoading ? 'Загрузка...' : 'Показать все рецензии'}
          </button>
        )}
        {allReviewsError && (
          <div className="text-red-500 mb-2">{allReviewsError}</div>
        )}
      </div>
    </div>
  );
};
