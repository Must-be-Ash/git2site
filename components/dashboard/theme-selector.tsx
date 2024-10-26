import { Button } from '@/components/ui/button';
import { themes, ThemeName } from '@/lib/themes';

interface ThemeSelectorProps {
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Select Theme</h2>
      <div className="grid grid-cols-3 gap-4">
        {(Object.keys(themes) as ThemeName[]).map((key) => (
          <Button
            key={key}
            onClick={() => onThemeChange(key)}
            variant={currentTheme === key ? 'default' : 'outline'}
          >
            {themes[key].name}
          </Button>
        ))}
      </div>
    </div>
  );
}
