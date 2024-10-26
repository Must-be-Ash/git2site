"use client";

import { Sidebar } from '@/components/dashboard/sidebar';
import { ThemeSelector } from '@/components/dashboard/theme-selector';
import { RefreshPortfolio } from '@/components/dashboard/refresh-portfolio';
import { useTheme } from '@/lib/hooks/useTheme';

export default function DashboardPage() {
  const { theme, changeTheme } = useTheme();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid gap-6">
          <ThemeSelector currentTheme={theme} onThemeChange={changeTheme} />
          <RefreshPortfolio />
        </div>
      </main>
    </div>
  );
}
