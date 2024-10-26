'use client';

import { themes } from '@/lib/themes';

interface StyledThemeProviderProps {
  theme: any;
  children: React.ReactNode;
}

export function StyledThemeProvider({ theme, children }: StyledThemeProviderProps) {
  return (
    <>
      <style jsx global>{`
        :root {
          --background: ${theme?.colors.background || themes.base.colors.background};
          --foreground: ${theme?.colors.foreground || themes.base.colors.foreground};
          --card: ${theme?.colors.card || themes.base.colors.card};
          --card-foreground: ${theme?.colors['card-foreground'] || themes.base.colors['card-foreground']};
          --primary: ${theme?.colors.primary || themes.base.colors.primary};
          --secondary: ${theme?.colors.secondary || themes.base.colors.secondary};
          --button: ${theme?.colors.button || themes.base.colors.button};
          --button-foreground: ${theme?.colors['button-foreground'] || themes.base.colors['button-foreground']};
        }
      `}</style>
      {children}
    </>
  );
}
