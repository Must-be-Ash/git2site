'use client';

import { useState, useEffect } from 'react';

export function usePreview(url: string) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPreview() {
      if (!url) return;
      
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        });

        if (!response.ok) {
          throw new Error('Failed to generate preview');
        }

        const data = await response.json();
        setPreviewUrl(data.preview);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate preview');
        setPreviewUrl(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPreview();
  }, [url]);

  return { previewUrl, isLoading, error };
}
