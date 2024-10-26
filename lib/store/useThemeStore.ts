import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeName, ThemeColors, themes } from '@/lib/themes';

interface ThemeState {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  customColors: ThemeColors;
  setCustomColors: (colors: ThemeColors) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'base',
      customColors: themes.base.colors,
      setTheme: (theme: ThemeName) => set({ 
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
