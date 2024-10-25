import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Theme, themes } from '@/lib/themes';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  customColors: {
    primary: string;
    secondary: string;
    background: string;
  };
  setCustomColors: (colors: ThemeState['customColors']) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'minimal',
      customColors: themes.minimal.colors,
      setTheme: (theme: Theme) => set({ 
        theme,
        customColors: themes[theme].colors
      }),
      setCustomColors: (colors: ThemeState['customColors']) => set({ customColors: colors }),
    }),
    {
      name: 'git2site-theme',
    }
  )
);
