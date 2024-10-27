'use client';

import { useState, useEffect } from 'react';

interface PreviewResult {
  previewUrl: string | null;
  isLoading: boolean;
  error: Error | null;
}

export function usePreview(url?: string): PreviewResult {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!url) {
      setIsLoading(false);
      // Use placeholder image when no URL is provided
      setPreviewUrl('/placeholder-project.png');
      return;
    }

    const generatePreview = async () => {
      try {
        setIsLoading(true);
        // For GitHub URLs, use placeholder image
        if (url.includes('github.com')) {
          setPreviewUrl('/placeholder-project.png');
        } else {
          // For other URLs, try to use them directly
          setPreviewUrl(url);
        }
        setError(null);
      } catch (err) {
        console.error('Preview generation error:', err);
        setError(err instanceof Error ? err : new Error('Failed to generate preview'));
        // Use placeholder image on error
        setPreviewUrl('/placeholder-project.png');
      } finally {
        setIsLoading(false);
      }
    };

    generatePreview();
  }, [url]);

  return { previewUrl, isLoading, error };
}

export default usePreview;
