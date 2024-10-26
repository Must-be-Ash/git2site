import React from 'react';
import { Theme } from '@/types/theme';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColorPicker } from './color-picker';

interface ThemeCustomizerProps {
  theme: Theme;
  onThemeChange: (property: keyof Theme | `colors.${keyof Theme['colors']}`, value: string) => void;
}

export function ThemeCustomizer({ theme, onThemeChange }: ThemeCustomizerProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="preset-theme">Preset Theme</Label>
        <Select
          value={theme.name}
          onValueChange={(value) => onThemeChange('name', value)}
        >
          <SelectTrigger id="preset-theme">
            <SelectValue placeholder="Select a preset theme" />
          </SelectTrigger>
          <SelectContent>
            {/* Add preset theme options here */}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="font-family">Font Family</Label>
        <Select
          value={theme.font}
          onValueChange={(value) => onThemeChange('font', value)}
        >
          <SelectTrigger id="font-family">
            <SelectValue placeholder="Select font family" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Inter, sans-serif">Inter</SelectItem>
            <SelectItem value="Roboto, sans-serif">Roboto</SelectItem>
            <SelectItem value="Merriweather, serif">Merriweather</SelectItem>
            <SelectItem value="Orbitron, sans-serif">Orbitron</SelectItem>
            <SelectItem value="Quicksand, sans-serif">Quicksand</SelectItem>
            <SelectItem value="Cabin, sans-serif">Cabin</SelectItem>
            <SelectItem value="Lato, sans-serif">Lato</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ColorPicker
        label="Background Color"
        value={theme.colors.background}
        onChange={(value) => onThemeChange('colors.background', value)}
      />

      <ColorPicker
        label="Text Color"
        value={theme.colors.foreground}
        onChange={(value) => onThemeChange('colors.foreground', value)}
      />

      <div>
        <Label htmlFor="card-style">Card Style</Label>
        <Select
          value={theme.cardStyle}
          onValueChange={(value) => onThemeChange('cardStyle', value)}
        >
          <SelectTrigger id="card-style">
            <SelectValue placeholder="Select card style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="bordered">Bordered</SelectItem>
            <SelectItem value="elevated">Elevated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ColorPicker
        label="Card Color"
        value={theme.colors.card}
        onChange={(value) => onThemeChange('colors.card', value)}
      />

      <div>
        <Label htmlFor="button-style">Button Style</Label>
        <Select
          value={theme.buttonStyle}
          onValueChange={(value) => onThemeChange('buttonStyle', value)}
        >
          <SelectTrigger id="button-style">
            <SelectValue placeholder="Select button style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
            <SelectItem value="ghost">Ghost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ColorPicker
        label="Button Color"
        value={theme.colors.button}
        onChange={(value) => onThemeChange('colors.button', value)}
      />

      <ColorPicker
        label="Button Icon Color"
        value={theme.colors['button-foreground']}
        onChange={(value) => onThemeChange('colors.button-foreground', value)}
      />

      <ColorPicker
        label="Accent Text Color"
        value={theme.colors.primary}
        onChange={(value) => onThemeChange('colors.primary', value)}
      />

      <ColorPicker
        label="Language Tag Color"
        value={theme.colors.tag || ''}
        onChange={(value) => onThemeChange('colors.tag', value)}
      />
    </div>
  );
}
