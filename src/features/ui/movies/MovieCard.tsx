'use client';

import { useState } from 'react';
import { MovieShort } from '../../api/movies/getMoviesShort';
import { motion, AnimatePresence } from 'framer-motion';
import { movieCardPop } from '../../model/animations';

export const MovieCard = ({
  movie,
  onClick,
}: {
  movie: MovieShort;
  onClick: () => void;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <motion.div
      className="group relative rounded-2xl shadow-lg bg-border overflow-hidden cursor-pointer min-h-[340px] flex flex-col justify-end transition-transform duration-200 hover:scale-[1.03]"
      onClick={onClick}
      style={{ aspectRatio: '2/3' }}
      variants={movieCardPop}
      whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)' }}
      whileTap={{ scale: 0.97 }}
      exit={{ opacity: 0, scale: 0.8, y: 40, transition: { duration: 0.25 } }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
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
      )}
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
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 bottom-8 text-white text-base px-7 py-3 rounded-xl z-50 pointer-events-none whitespace-nowrap font-bold tracking-wide"
            initial={{ opacity: 0, y: 20, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.85 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 18,
              mass: 0.7,
            }}
            style={{ filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.25))' }}
          >
            {movie.title}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute inset-0 z-30 transition-opacity duration-200 opacity-0 group-active:opacity-20 bg-black" />
    </motion.div>
  );
};
