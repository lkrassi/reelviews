'use client';

import { useTheme } from '../hooks/useTheme';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === 'dark';

  if (!mounted) return null;

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
