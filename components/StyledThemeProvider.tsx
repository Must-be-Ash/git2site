'use client';

import { themes, Theme, ThemeName, ThemeColors } from '@/lib/themes';

interface StyledThemeProviderProps {
  theme: Theme | ThemeName;
  colors: ThemeColors;
  children: React.ReactNode;
}

export function StyledThemeProvider({ theme, colors, children }: StyledThemeProviderProps) {
  const currentTheme = typeof theme === 'string' ? themes[theme as ThemeName] : theme;
  const mergedColors = { ...currentTheme.colors, ...colors };

  return (
    <>
      <style jsx global>{`
        :root {
          --background: ${mergedColors.background};
          --foreground: ${mergedColors.foreground};
          --card: ${mergedColors.card};
          --card-foreground: ${mergedColors['card-foreground']};
          --primary: ${mergedColors.primary};
          --secondary: ${mergedColors.secondary};
          --button: ${mergedColors.button};
          --button-foreground: ${mergedColors['button-foreground']};
          --font-sans: ${currentTheme.font};
        }
      `}</style>
      {children}
    </>
  );
}
