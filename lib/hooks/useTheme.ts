"use client";

import { useState, useEffect } from 'react';
import { Theme, themes } from '@/lib/themes';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('base');

  useEffect(() => {
    document.body.className = `theme-${theme}`;
    Object.entries(themes[theme].colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
    document.documentElement.style.setProperty('--font-sans', themes[theme].font);
  }, [theme]);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return { theme, changeTheme };
}
