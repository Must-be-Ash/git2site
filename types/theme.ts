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
  font: string;
  buttonStyle: 'default' | 'outline' | 'ghost';
  cardStyle: 'default' | 'bordered' | 'elevated';
  colors: ThemeColors;
}
