'use client';

import { MovieCard } from './MovieCard';
import { RecommendedMovie } from '../../api/movies/getMovieFull';
import { useRouter } from 'next/navigation';

interface RecommendedToFilmMoviesProps {
  recommendations: RecommendedMovie[];
}

export const RecommendedToFilmMovies = ({
  recommendations,
}: RecommendedToFilmMoviesProps) => {
  const router = useRouter();

  const handleMovieClick = (movieId: string) => {
    router.push(`/main/${movieId}`);
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-text dark:text-dark-text text-lg">
          Рекомендации не найдены
        </p>
      </div>
    );
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl text-center font-bold text-text dark:text-dark-text mb-6">
        Рекомендуемые фильмы
      </h2>
      <div className="grid grid-cols-1 max-sm:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-5 gap-8 overflow-x-hidden">
        {recommendations.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={{
              id: movie.id,
              title: movie.title,
              imgUrl: movie.imgUrl,
              genres: movie.genres || [],
              avgRating: movie.avgRating,
            }}
            onClick={() => handleMovieClick(movie.id)}
          />
        ))}
      </div>
    </section>
  );
};
