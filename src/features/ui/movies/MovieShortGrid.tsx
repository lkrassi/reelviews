'use client';
import { useEffect, useState } from 'react';
import {
  getMoviesShort,
  MovieShort,
  GetMoviesShortResponse,
} from '../../api/movies/getMoviesShort';
import { Pagination } from '@/widgets/pagination/Pagination';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { movieGridStagger } from '../../model/animations';
import { MovieCard } from './MovieCard';
import { SearchMovie } from './SearchMovie';
import { useNotifications } from '@/widgets';

export const MovieShortGrid = () => {
  const [movies, setMovies] = useState<MovieShort[]>([]);
  const [page, setPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addNotification } = useNotifications();

  useEffect(() => {
    let ignore = false;
    setLoading(true);
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
        if (!ignore) {
          addNotification({
            type: 'error',
            message: 'Ошибка загрузки фильмов',
          });
        }
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
      <SearchMovie />

      {loading && <div className="text-center py-8">Загрузка...</div>}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-5 gap-8 overflow-x-hidden"
        style={{ scrollbarWidth: 'none' }}
        variants={movieGridStagger}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => router.push(`/main/${movie.id}`)}
            />
          ))}
        </AnimatePresence>
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
