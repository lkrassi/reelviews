'use client';
import { useEffect, useState } from 'react';
import { getMovieFull, MovieFullParams } from '../../api/movies/getMovieFull';
import { useParams } from 'next/navigation';
import { getReviewsById } from '../../api/movies/getMovieReviews';
import { MovieReview } from '../../api/movies/getMovieFull';
import { ReviewList } from './reviews/ReviewList';
import Img from '../../../../public/bao.png';
import { motion } from 'framer-motion';
import { fadeInUp, fadeIn, staggerContainer } from '../../model/animations';
import { AddReview } from './reviews/AddReview';
import { useNotifications } from '@/widgets';

export const MovieFull = () => {
  const { id } = useParams<{ id: string }>();
  const [movieData, setMovieData] = useState<{
    movie: MovieFullParams;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [allReviews, setAllReviews] = useState<MovieReview[] | null>(null);
  const [allReviewsLoading, setAllReviewsLoading] = useState(false);
  const [allReviewsError, setAllReviewsError] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    (async () => {
      try {
        const res = await getMovieFull(id);
        if (!ignore) setMovieData(res.data);
      } catch (e: any) {
        if (!ignore) {
          addNotification({
            type: 'error',
            message: 'Ошибка загрузки фильма',
          });
        }
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
      addNotification({
        type: 'error',
        message: 'Ошибка загрузки рецензий',
      });
    } finally {
      setAllReviewsLoading(false);
    }
  };

  if (loading)
    return <div className="text-center py-8 dark:text-white">Загрузка...</div>;
  if (!movieData) return null;
  const { movie } = movieData;

  return (
    <motion.div
      className="max-w-6xl mx-auto px-2 md:px-6 py-8 flex flex-col gap-10"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex flex-col md:flex-row gap-8 items-center md:items-start"
        variants={fadeInUp}
      >
        <motion.div
          className="relative w-full md:w-56 h-80 rounded-2xl overflow-hidden shadow-lg border border-border dark:border-dark-border bg-border dark:bg-dark-border flex items-center justify-center"
          variants={fadeIn}
        >
          {movie.imgUrl ? (
            <>
              <img
                src={movie.imgUrl}
                alt={movie.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            </>
          ) : (
            <span className="text-6xl text-accent dark:text-dark-accent opacity-60">
              🎬
            </span>
          )}

          {typeof movie.avgRating === 'number' && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 dark:bg-dark-border/80 text-yellow-300 text-sm font-bold px-3 py-1 rounded-full shadow backdrop-blur-sm z-10">
              <span className="text-lg">★</span> {movie.avgRating.toFixed(1)}
            </div>
          )}
        </motion.div>
        <motion.div className="flex-1 flex flex-col gap-3" variants={fadeInUp}>
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary dark:text-dark-primary mb-1 drop-shadow">
            {movie.title}
          </h1>
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="bg-accent/80 dark:bg-dark-accent/80 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm backdrop-blur-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
      <motion.div
        className="mt-10 rounded-2xl shadow p-6 border border-border dark:border-dark-border bg-white dark:bg-dark-bg"
        variants={fadeInUp}
      >
        <h2 className="text-2xl font-bold mb-6 text-primary dark:text-dark-primary tracking-tight">
          Отзывы
        </h2>
        <ReviewList
          reviews={allReviews || movie.reviews || []}
          onDeleteSuccess={async () => {
            try {
              const res = await getMovieFull(movie.id);
              setMovieData(res.data);
              setAllReviews(null);
            } catch {}
          }}
        />
        {movie.reviews && movie.reviews.length >= 50 && !allReviews && (
          <button
            className="mt-6 px-6 py-2 rounded-full bg-accent text-white dark:bg-dark-accent font-semibold text-base shadow hover:scale-105 hover:opacity-90 transition-all duration-200 disabled:opacity-60"
            onClick={handleShowAllReviews}
            disabled={allReviewsLoading}
          >
            {allReviewsLoading ? 'Загрузка...' : 'Показать все рецензии'}
          </button>
        )}
        <div className="mt-10">
          <AddReview
            movieId={movie.id}
            onSuccess={async () => {
              try {
                const res = await getMovieFull(movie.id);
                setMovieData(res.data);
                setAllReviews(null);
              } catch {}
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};
