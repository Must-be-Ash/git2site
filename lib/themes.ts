export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  'card-foreground': string;
  primary: string;
  secondary: string;
  button: string;
  'button-foreground': string;
  nav?: string;
  'nav-foreground'?: string;
  tag?: string;
  'tag-foreground'?: string;
  'primary-foreground'?: string;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
  font: string;
  buttonStyle: 'default' | 'outline' | 'ghost';
  cardStyle: 'default' | 'bordered' | 'elevated';
}

export type ThemeName = 'base' | 'eighties' | 'arcade' | 'vintage' | 'windows98' | 'sinCity' | 'modern';

export const themes: Record<ThemeName, Theme> = {
  base: {
    name: 'Base',
    colors: {
      background: '#ffffff',
      foreground: '#000000',
      card: '#f0f0f0',
      'card-foreground': '#000000',
      primary: '#3b82f6',
      secondary: '#10b981',
      button: '#3b82f6',
      'button-foreground': '#ffffff',
    },
    font: 'Inter, sans-serif',
    buttonStyle: 'default',
    cardStyle: 'default',
  },
  eighties: {
    name: '80s',
    colors: {
      background: 'linear-gradient(to bottom, #ff00ff, #00ffff)',
      foreground: '#ffffff',
      card: 'rgba(0, 0, 0, 0.7)',
      'card-foreground': '#00ffff',
      nav: '#000000',
      'nav-foreground': '#ff00ff',
      button: '#ff00ff',
      'button-foreground': '#000000',
      tag: '#00ffff',
      'tag-foreground': '#000000',
      primary: '#ff00ff',
      'primary-foreground': '#000000',
      secondary: '#00ffff',
    },
    font: 'VT323, monospace',
    buttonStyle: 'default',
    cardStyle: 'default',
  },
  arcade: {
    name: 'Arcade',
    colors: {
      background: '#000000',
      foreground: '#33ff33',
      card: '#111111',
      'card-foreground': '#33ff33',
      nav: '#33ff33',
      'nav-foreground': '#000000',
      button: '#ff3333',
      'button-foreground': '#ffffff',
      tag: '#3333ff',
      'tag-foreground': '#ffffff',
      primary: '#ff3333',
      'primary-foreground': '#ffffff',
      secondary: '#3333ff',
    },
    font: '"Press Start 2P", cursive',
    buttonStyle: 'default',
    cardStyle: 'default',
  },
  vintage: {
    name: 'Vintage',
    colors: {
      background: '#f4e9d8',
      foreground: '#3a3a3a',
      card: '#ffffff',
      'card-foreground': '#3a3a3a',
      nav: '#3a3a3a',
      'nav-foreground': '#f4e9d8',
      button: '#8b4513',
      'button-foreground': '#f4e9d8',
      tag: '#d2b48c',
      'tag-foreground': '#3a3a3a',
      primary: '#8b4513',
      'primary-foreground': '#f4e9d8',
      secondary: '#d2b48c',
    },
    font: '"Courier New", monospace',
    buttonStyle: 'default',
    cardStyle: 'default',
  },
  windows98: {
    name: 'Windows 98',
    colors: {
      background: '#008080',
      foreground: '#ffffff',
      card: '#c0c0c0',
      'card-foreground': '#000000',
      nav: '#000080',
      'nav-foreground': '#ffffff',
      button: '#c0c0c0',
      'button-foreground': '#000000',
      tag: '#ffffff',
      'tag-foreground': '#000000',
      primary: '#000080',
      'primary-foreground': '#ffffff',
      secondary: '#c0c0c0',
    },
    font: '"MS Sans Serif", sans-serif',
    buttonStyle: 'default',
    cardStyle: 'default',
  },
  sinCity: {
    name: 'Sin City',
    colors: {
      background: '#000000',
      foreground: '#ffffff',
      card: '#1a1a1a',
      'card-foreground': '#ffffff',
      nav: '#1a1a1a',
      'nav-foreground': '#ffffff',
      button: '#ff4500',
      'button-foreground': '#000000',
      tag: '#00ff00',
      'tag-foreground': '#000000',
      primary: '#ff4500',
      'primary-foreground': '#000000',
      secondary: '#00ff00',
    },
    font: '"Oswald", sans-serif',
    buttonStyle: 'default',
    cardStyle: 'default',
  },
  modern: {
    name: 'Modern',
    colors: {
      background: '#ffffff',
      foreground: '#000000',
      card: '#f8f8f8',
      'card-foreground': '#000000',
      nav: '#000000',
      'nav-foreground': '#ffffff',
      button: '#ff6600',
      'button-foreground': '#ffffff',
      tag: '#e0e0e0',
      'tag-foreground': '#000000',
      primary: '#ff6600',
      'primary-foreground': '#ffffff',
      secondary: '#e0e0e0',
    },
    font: '"Inter", sans-serif',
    buttonStyle: 'default',
    cardStyle: 'default',
  },
};

export const getTheme = (themeName: ThemeName): Theme => themes[themeName];
