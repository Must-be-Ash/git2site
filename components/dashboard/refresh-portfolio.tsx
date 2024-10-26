"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from 'lucide-react';

interface RefreshPortfolioProps {
  onRefresh: () => void;
  isGenerating: boolean;
  progress: number;
}

export function RefreshPortfolio({ onRefresh, isGenerating, progress }: RefreshPortfolioProps) {
  return (
    <Button onClick={onRefresh} disabled={isGenerating}>
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Generating... ({progress})
        </>
      ) : (
        <>
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate Portfolio
        </>
      )}
    </Button>
  );
}
