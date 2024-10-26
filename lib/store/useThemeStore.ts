import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Theme, themes } from '@/lib/themes';

type ThemeColors = typeof themes[Theme]['colors'];

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  customColors: ThemeColors;
  setCustomColors: (colors: ThemeColors) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'base',
      customColors: themes.base.colors,
      setTheme: (theme: Theme) => set({ 
        theme,
        customColors: themes[theme].colors
      }),
      setCustomColors: (colors: ThemeColors) => set({ customColors: colors }),
    }),
    {
      name: 'git2site-theme',
    }
  )
);
