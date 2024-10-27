import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { themes, Theme } from '@/lib/themes';

type ThemeColorProperty = 
  | "colors.background"
  | "colors.foreground"
  | "colors.card"
  | "colors.card-foreground"
  | "colors.primary"
  | "colors.primary-foreground"
  | "colors.secondary"
  | "colors.button"
  | "colors.button-foreground"
  | "colors.tag";

interface ThemeSelectorProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const handleThemeSelect = (themeName: string) => {
    const selectedTheme = themes[themeName as keyof typeof themes];
    if (selectedTheme) {
      onThemeChange(selectedTheme);
    }
  };

  return (
    <Select 
      value={currentTheme.name.toLowerCase()}
      onValueChange={handleThemeSelect} 
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a preset theme">
          {currentTheme.name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(themes).map(([key, theme]) => (
          <SelectItem key={key} value={key.toLowerCase()}>
            {theme.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface ThemeCustomizerProps {
  theme: Theme;
  onThemeChange: (property: ThemeColorProperty, value: string) => void;
}
