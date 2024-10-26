import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ColorPickerProps {
  colors: Record<string, string>;
  onColorChange: (key: string, value: string) => void;
}

export function ColorPicker({ colors, onColorChange }: ColorPickerProps) {
  return (
    <div className="space-y-4 mt-4">
      <h2 className="text-xl font-semibold">Customize Colors</h2>
      {Object.entries(colors).map(([key, value]) => (
        <div key={key} className="flex items-center space-x-2">
          <Label htmlFor={key}>{key}</Label>
          <Input
            type="color"
            id={key}
            value={value}
            onChange={(e) => onColorChange(key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
