'use client';
import { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const THEME_COOKIE = 'theme';
type Theme = 'light' | 'dark';

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    const cookie = Cookies.get(THEME_COOKIE) as Theme | undefined;
    return cookie || getSystemTheme();
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    Cookies.set(THEME_COOKIE, theme, { expires: 365 });
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
  }, []);

  return { theme, setTheme };
}
