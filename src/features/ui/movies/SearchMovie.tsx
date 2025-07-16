import { useState, useEffect, useRef } from 'react';
import { getMoviesShort, MovieShort } from '../../api/movies/getMoviesShort';
import { useRouter } from 'next/navigation';

export const SearchMovie = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MovieShort[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!query) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await getMoviesShort(1, query);
        setResults(res.data.movies || []);
        setShowDropdown(true);
      } catch (e) {
        setResults([]);
        setShowDropdown(false);
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleSelect = (movieId: string) => {
    setShowDropdown(false);
    setQuery('');
    router.push(`/main/${movieId}`);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск фильмов..."
        className="w-full px-4 py-2 rounded border border-border dark:border-dark-border bg-secondary dark:bg-dark-secondary text-text dark:text-dark-text focus:outline-none focus:border-primary dark:focus:border-dark-primary shadow"
        onFocus={() => {
          if (Array.isArray(results) && results.length) setShowDropdown(true);
        }}
        onBlur={() => setTimeout(() => setShowDropdown(false), 300)}
      />
      {showDropdown && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-dark-bg border border-border dark:border-dark-border rounded shadow-lg z-50 max-h-72 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-text dark:text-dark-text">
              Загрузка...
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-text dark:text-dark-text">
              Ничего не найдено
            </div>
          ) : (
            results.map((movie) => (
              <div
                key={movie.id}
                className="flex items-center gap-3 px-4 py-2 hover:bg-accent/10 dark:hover:bg-dark-accent/20 cursor-pointer transition"
                onMouseDown={() => handleSelect(movie.id)}
              >
                {movie.imgUrl ? (
                  <img
                    src={movie.imgUrl}
                    alt={movie.title}
                    className="w-10 h-14 object-cover rounded"
                  />
                ) : (
                  <span className="w-10 h-14 flex items-center justify-center text-2xl text-accent dark:text-dark-accent bg-border dark:bg-dark-border rounded">
                    🎬
                  </span>
                )}
                <span className="font-medium text-text dark:text-dark-text line-clamp-1">
                  {movie.title}
                </span>
                {typeof movie.avgRating === 'number' && (
                  <span className="ml-auto text-xs flex items-center gap-1 text-yellow-300">
                    <span className="text-base text-yellow-300">★</span>{' '}
                    {movie.avgRating.toFixed(1)}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
