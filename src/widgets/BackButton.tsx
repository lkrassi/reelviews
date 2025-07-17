'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { backTextFade } from '../features/model/animations';

export const BackButton = () => {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 px-3 py-2 text-text dark:text-dark-text rounded font-semibold transition group"
      type="button"
      aria-label="Назад"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        fill="none"
        viewBox="0 0 24 24"
        className="inline align-middle"
      >
        <path
          fill="currentColor"
          d="M15.7 5.3a1 1 0 0 1 0 1.4L10.42 12l5.3 5.3a1 1 0 0 1-1.42 1.4l-6-6a1 1 0 0 1 0-1.4l6-6a1 1 0 0 1 1.4 0Z"
        />
      </svg>
      <motion.span
        className="text-text dark:text-dark-text text-xs font-semibold select-none pointer-events-none ml-1"
        variants={backTextFade}
        initial="hidden"
        animate={hovered ? 'visible' : 'hidden'}
      >
        Назад
      </motion.span>
    </button>
  );
};
