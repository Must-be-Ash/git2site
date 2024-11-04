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
      setPreviewUrl('/placeholder-project.png');
      return;
    }

    const generatePreview = async () => {
      try {
        setIsLoading(true);

        // Use our own preview API endpoint
        const response = await fetch('/api/preview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate preview');
        }

        const data = await response.json();
        
        if (data.preview) {
          setPreviewUrl(data.preview);
          console.log('Preview generated successfully for:', url);
        } else {
          // If preview generation fails, try to get og:image
          const ogResponse = await fetch(`/api/og-image?url=${encodeURIComponent(url)}`);
          const ogData = await ogResponse.json();
          
          if (ogData.imageUrl) {
            setPreviewUrl(ogData.imageUrl);
            console.log('Using og:image for:', url);
          } else {
            setPreviewUrl('/placeholder-project.png');
            console.log('Using placeholder for:', url);
          }
        }

        setError(null);
      } catch (err) {
        console.error('Preview generation error:', err);
        setError(err instanceof Error ? err : new Error('Failed to generate preview'));
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
