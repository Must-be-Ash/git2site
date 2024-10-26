import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Theme } from '@/types/theme';

interface ThemeSelectorProps {
  currentTheme: string;
  presetThemes: Record<string, Theme>;
  onThemeChange: (themeName: string) => void;
}

export function ThemeSelector({ currentTheme, presetThemes, onThemeChange }: ThemeSelectorProps) {
  return (
    <Select onValueChange={onThemeChange} defaultValue={currentTheme}>
      <SelectTrigger>
        <SelectValue placeholder="Select a preset theme" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(presetThemes).map(([key, theme]) => (
          <SelectItem key={key} value={key}>
            {theme.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
