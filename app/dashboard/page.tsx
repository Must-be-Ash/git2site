"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeSelector } from '@/components/dashboard/theme-selector';
import { ColorPicker } from '@/components/dashboard/color-picker';
import { Button } from '@/components/ui/button';
import { themes, Theme } from '@/lib/themes';
import { toast } from 'sonner';

type ThemeColors = typeof themes.base.colors;

export default function DashboardPage() {
  const [theme, setTheme] = useState<Theme>('base');
  const [customColors, setCustomColors] = useState<ThemeColors>(themes.base.colors);
  const [username, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Fetch user's current theme and colors
    fetchUserPreferences();
  }, []);

  const fetchUserPreferences = async () => {
    const response = await fetch('/api/user/preferences');
    if (response.ok) {
      const data = await response.json();
      setTheme(data.theme.id);
      setCustomColors(data.theme.colors);
      setUsername(data.username);
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setCustomColors(themes[newTheme].colors as ThemeColors);
  };

  const handleColorChange = (colorKey: string, value: string) => {
    setCustomColors(prev => ({ ...prev, [colorKey]: value }));
  };

  const handleSave = async () => {
    const response = await fetch('/api/user/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: { id: theme, colors: customColors } }),
    });

    if (response.ok) {
      toast.success('Preferences saved successfully');
    } else {
      toast.error('Failed to save preferences');
    }
  };

  const handlePreview = () => {
    if (username) {
      router.push(`/${username}`);
    } else {
      toast.error('Username not found');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customize Your Portfolio</h1>
      <ThemeSelector currentTheme={theme} onThemeChange={handleThemeChange} />
      <ColorPicker colors={customColors} onColorChange={handleColorChange} />
      <div className="mt-4 space-x-2">
        <Button onClick={handleSave}>Save Changes</Button>
        <Button onClick={handlePreview}>Preview</Button>
      </div>
    </div>
  );
}
