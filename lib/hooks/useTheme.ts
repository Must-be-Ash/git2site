"use client";

import { useState, useEffect } from 'react';
import { Theme, themes, ThemeName } from '@/lib/themes';

export function useTheme() {
  const [themeName, setThemeName] = useState<ThemeName>('base');

  useEffect(() => {
    const theme = themes[themeName];
    document.body.className = `theme-${themeName}`;
    Object.entries(theme.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
    document.documentElement.style.setProperty('--font-sans', theme.font);
  }, [themeName]);

  const changeTheme = (newThemeName: ThemeName) => {
    setThemeName(newThemeName);
  };

  return { theme: themes[themeName], changeTheme };
}
