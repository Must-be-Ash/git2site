"use client";

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

export function RefreshPortfolio() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Call your API to refresh the portfolio
      const response = await fetch('/api/portfolio/refresh', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to refresh portfolio');
      toast.success('Portfolio refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh portfolio');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Refresh Portfolio</h2>
      <Button onClick={handleRefresh} disabled={isRefreshing}>
        {isRefreshing ? 'Refreshing...' : 'Refresh Portfolio'}
      </Button>
    </div>
  );
}
