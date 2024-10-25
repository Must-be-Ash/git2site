export const themes = {
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      background: '#ffffff',
    },
  },
  dark: {
    id: 'dark',
    name: 'Dark Mode',
    colors: {
      primary: '#3b82f6',
      secondary: '#94a3b8',
      background: '#0f172a',
    },
  },
  gradient: {
    id: 'gradient',
    name: 'Gradient',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      background: '#f8fafc',
    },
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    colors: {
      primary: '#0891b2',
      secondary: '#0d9488',
      background: '#f8fafc',
    },
  },
};

export type Theme = keyof typeof themes;
export type ThemeColors = typeof themes[Theme]['colors'];