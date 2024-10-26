import { Button } from '@/components/ui/button';
import { themes, Theme } from '@/lib/themes';

interface ThemeSelectorProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Select Theme</h2>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(themes).map(([key, theme]) => (
          <Button
            key={key}
            onClick={() => onThemeChange(key as Theme)}
            variant={currentTheme === key ? 'default' : 'outline'}
          >
            {theme.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
