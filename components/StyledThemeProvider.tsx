'use client';

import { themes, Theme } from '@/lib/themes';

interface StyledThemeProviderProps {
  theme: Theme;
  children: React.ReactNode;
}

export function StyledThemeProvider({ theme, children }: StyledThemeProviderProps) {
  const currentTheme = themes[theme] || themes.base;

  return (
    <>
      <style jsx global>{`
        :root {
          --background: ${currentTheme.colors.background};
          --foreground: ${currentTheme.colors.foreground};
          --card: ${currentTheme.colors.card};
          --card-foreground: ${currentTheme.colors['card-foreground']};
          --primary: ${currentTheme.colors.primary};
          --secondary: ${currentTheme.colors.secondary};
          --button: ${currentTheme.colors.button};
          --button-foreground: ${currentTheme.colors['button-foreground']};
          --font-sans: ${currentTheme.font};
        }
      `}</style>
      {children}
    </>
  );
}
