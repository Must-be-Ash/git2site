export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  'card-foreground': string;
  primary: string;
  secondary: string;
  button: string;
  'button-foreground': string;
  tag: string;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
  font: string;
  buttonStyle: 'default' | 'outline' | 'ghost';
  cardStyle: 'default' | 'bordered' | 'elevated';
}

export const themes = {
  base: {
    name: 'Default',
    buttonStyle: 'default',
    cardStyle: 'default',
    font: 'Inter, sans-serif',
    colors: {
      background: '#ffffff',
      foreground: '#000000',
      card: '#ffffff',
      'card-foreground': '#000000',
      primary: '#3b82f6',
      secondary: '#6b7280',
      button: '#3b82f6',
      'button-foreground': '#ffffff',
      tag: '#e5e7eb',
    },
  },
  dark: {
    name: 'Dark',
    buttonStyle: 'outline',
    cardStyle: 'bordered',
    font: 'Roboto, sans-serif',
    colors: {
      background: '#1f2937',
      foreground: '#ffffff',
      card: '#374151',
      'card-foreground': '#ffffff',
      primary: '#10b981',
      secondary: '#6b7280',
      button: '#10b981',
      'button-foreground': '#ffffff',
      tag: '#1f2937',
    },
  },
  vintage: {
    name: 'Vintage',
    buttonStyle: 'ghost',
    cardStyle: 'elevated',
    font: 'Merriweather, serif',
    colors: {
      background: '#fef3c7',
      foreground: '#292524',
      card: '#fff7ed',
      'card-foreground': '#292524',
      primary: '#d97706',
      secondary: '#78716c',
      button: '#d97706',
      'button-foreground': '#292524',
      tag: '#fef3c7',
    },
  },
  neon: {
    name: 'Neon',
    buttonStyle: 'default',
    cardStyle: 'bordered',
    font: 'Orbitron, sans-serif',
    colors: {
      background: '#0f172a',
      foreground: '#f0abfc',
      card: '#1e293b',
      'card-foreground': '#f0abfc',
      primary: '#f0abfc',
      secondary: '#94a3b8',
      button: '#f0abfc',
      'button-foreground': '#0f172a',
      tag: '#1e293b',
    },
  },
  pastel: {
    name: 'Pastel',
    buttonStyle: 'ghost',
    cardStyle: 'default',
    font: 'Quicksand, sans-serif',
    colors: {
      background: '#fdf2f8',
      foreground: '#831843',
      card: '#fce7f3',
      'card-foreground': '#831843',
      primary: '#fb7185',
      secondary: '#be185d',
      button: '#fb7185',
      'button-foreground': '#831843',
      tag: '#fdf2f8',
    },
  },
  forest: {
    name: 'Forest',
    buttonStyle: 'outline',
    cardStyle: 'elevated',
    font: 'Cabin, sans-serif',
    colors: {
      background: '#14532d',
      foreground: '#dcfce7',
      card: '#166534',
      'card-foreground': '#dcfce7',
      primary: '#22c55e',
      secondary: '#86efac',
      button: '#22c55e',
      'button-foreground': '#dcfce7',
      tag: '#14532d',
    },
  },
  ocean: {
    name: 'Ocean',
    buttonStyle: 'default',
    cardStyle: 'bordered',
    font: 'Lato, sans-serif',
    colors: {
      background: '#f0f9ff',
      foreground: '#0c4a6e',
      card: '#e0f2fe',
      'card-foreground': '#0c4a6e',
      primary: '#0ea5e9',
      secondary: '#38bdf8',
      button: '#0ea5e9',
      'button-foreground': '#f0f9ff',
      tag: '#f0f9ff',
    },
  },
} as const;

export type ThemeName = keyof typeof themes;

export const defaultTheme: Theme = themes.base;

export const getTheme = (themeName: ThemeName): Theme => themes[themeName];
