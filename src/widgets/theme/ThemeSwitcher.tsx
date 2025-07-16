'use client';

import { useTheme } from '../hooks/useTheme';
import Image from 'next/image';

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const isDark = theme === 'dark';
  return (
    <button
      aria-label={isDark ? 'Светлая тема' : 'Тёмная тема'}
      className="!bg-transparent"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? (
        <Image src="/sun.svg" alt="Светлая тема" width={24} height={24} />
      ) : (
        <Image src="/moon.svg" alt="Тёмная тема" width={24} height={24} />
      )}
    </button>
  );
};
