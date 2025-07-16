'use client';
import { useEffect, useState } from 'react';
import {
  getMoviesShort,
  MovieShort,
  GetMoviesShortResponse,
} from '../../api/movies/getMoviesShort';
import { Pagination } from '@/widgets/pagination/Pagination';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { movieGridStagger, movieCardPop } from '../../model/animations';

export const MovieShortGrid = () => {
  const [movies, setMovies] = useState<MovieShort[]>([]);
  const [page, setPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res: GetMoviesShortResponse = await getMoviesShort(pendingPage);
        if (!ignore) {
          setMovies(res.data.movies);
          setTotalPages(res.pagination.pages || 1);
          setPage(pendingPage);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch (e: any) {
        if (!ignore) setError(e?.meta?.message || 'Ошибка загрузки фильмов');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [pendingPage]);

  return (
    <div className="flex flex-col gap-8 px-2 md:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2 text-primary dark:text-dark-primary text-center">
        Фильмы
      </h1>
      {loading && <div className="text-center py-8">Загрузка...</div>}
      {error && <div className="text-center text-red-500 py-8">{error}</div>}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-5 gap-8 overflow-x-hidden"
        style={{ scrollbarWidth: 'none' }}
        variants={movieGridStagger}
        initial="hidden"
        animate="visible"
      >
        {movies.map((movie) => (
          <motion.div
            key={movie.id}
            className="group relative rounded-2xl shadow-lg bg-border overflow-hidden cursor-pointer min-h-[340px] flex flex-col justify-end  transition-transform duration-200 hover:scale-[1.03]"
            onClick={() => router.push(`/main/${movie.id}`)}
            style={{ aspectRatio: '2/3' }}
            variants={movieCardPop}
            whileHover={{
              scale: 1.04,
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)',
            }}
            whileTap={{ scale: 0.97 }}
          >
            {movie.imgUrl ? (
              <img
                src={movie.imgUrl}
                alt={movie.title}
                className="absolute inset-0 w-full h-full object-cover object-center z-0 transition-transform duration-300 group-hover:scale-105 group-hover:brightness-75"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-border dark:bg-dark-border z-0">
                <span className="text-6xl text-accent dark:text-dark-accent opacity-60">
                  🎬
                </span>
              </div>
            )}{' '}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10 pointer-events-none" />
            {movie.genres && movie.genres.length > 0 && (
              <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1">
                {movie.genres.slice(0, 2).map((genre) => (
                  <span
                    key={genre}
                    className="bg-accent/80 dark:bg-dark-accent/80 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm backdrop-blur-sm"
                  >
                    {genre}
                  </span>
                ))}
                {movie.genres.length > 2 && (
                  <span className="bg-accent/60 dark:bg-dark-accent/60 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm backdrop-blur-sm">
                    +{movie.genres.length - 2}
                  </span>
                )}
              </div>
            )}
            {typeof movie.avgRating === 'number' && (
              <div className="absolute top-3 right-3 z-20 flex items-center gap-1 text-md text-yellow-300">
                <span className="text-base text-yellow-300">★</span>{' '}
                {movie.avgRating.toFixed(1)}
              </div>
            )}
            <div className="relative z-20 w-full px-3 pb-4 pt-8 flex flex-col justify-end mt-auto bg-bg dark:bg-dark-bg">
              <div className="text-lg font-bold text-text dark:text-dark-text line-clamp-2 text-shadow-md">
                {movie.title}
              </div>
            </div>
            <div className="absolute inset-0 z-30 transition-opacity duration-200 opacity-0 group-active:opacity-20 bg-black" />
          </motion.div>
        ))}
      </motion.div>
      <div className="flex justify-center mt-8">
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPendingPage}
        />
      </div>
    </div>
  );
};
