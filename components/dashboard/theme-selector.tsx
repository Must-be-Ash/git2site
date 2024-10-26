import { Button } from '@/components/ui/button';
import { themes, Theme } from '@/lib/themes';

interface ThemeSelectorProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Select Theme</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(themes).map(([key, theme]) => (
          <Button
            key={key}
            onClick={() => onThemeChange(key as Theme)}
            variant={currentTheme === key ? 'default' : 'outline'}
            className="h-20 flex flex-col items-center justify-center"
          >
            <div className="w-8 h-8 rounded-full mb-2" style={{ backgroundColor: theme.colors.primary }}></div>
            <span>{theme.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
