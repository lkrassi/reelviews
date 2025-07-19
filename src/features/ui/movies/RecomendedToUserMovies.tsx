'use client';

import { useEffect, useState, FC } from 'react';
import {
  getUserRecommendations,
  RecommendationMovie,
} from '../../api/movies/getUserRecommendations';
import { useRouter } from 'next/navigation';
import { SearchMovie } from './SearchMovie';
import { MovieCard } from './MovieCard';

interface UserRecommendationsState {
  movies: RecommendationMovie[];
  loading: boolean;
  error: string | null;
}

export const RecomendedToUserMovies: FC = () => {
  const [state, setState] = useState<UserRecommendationsState>({
    movies: [],
    loading: true,
    error: null,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const accessToken = localStorage.getItem('accessToken') || '';
        const requestId = crypto.randomUUID();
        const res = await getUserRecommendations(accessToken, requestId);
        setState({
          movies: res.data.movies || [],
          loading: false,
          error: null,
        });
      } catch (e: any) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: e?.message || 'Ошибка загрузки рекомендаций',
        }));
      }
    };
    fetchData();
  }, []);

  if (state.loading)
    return (
      <div className="text-center py-8">
        Загрузка персональных рекомендаций...
      </div>
    );
  if (state.error)
    return <div className="text-center py-8 text-red-500">{state.error}</div>;
  if (!state.movies.length)
    return <div className="text-center py-8">Нет рекомендаций</div>;

  return (
    <div className="flex flex-col gap-8 px-2 md:px-8 py-8">
      <h2 className="text-2xl text-center font-bold mb-6 text-primary dark:text-dark-primary tracking-tight">
        Персональные рекомендации
      </h2>
      <SearchMovie />
      <div className="grid grid-cols-1 max-sm:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-5 gap-8 overflow-x-hidden">
        {state.movies.map((rec) => (
          <MovieCard
            key={rec.id}
            movie={{
              id: rec.id,
              title: rec.title,
              imgUrl: rec.imgUrl,
              genres: rec.genres || [],
              avgRating: rec.avgRating,
            }}
            onClick={() => router.push(`/main/${rec.id}`)}
          />
        ))}
      </div>
    </div>
  );
};
