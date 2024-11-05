'use client';

import { useState, useEffect } from 'react';

interface PreviewState {
  previewUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export function usePreview(websiteUrl?: string): PreviewState {
  const [state, setState] = useState<PreviewState>({
    previewUrl: null,
    isLoading: false,
    error: null
  });

  useEffect(() => {
    if (!websiteUrl) {
      setState({ previewUrl: null, isLoading: false, error: null });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    fetch('/api/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: websiteUrl })
    })
      .then(res => res.json())
      .then(data => {
        setState({
          previewUrl: data.previewUrl,
          isLoading: false,
          error: data.error
        });
      })
      .catch(error => {
        setState({
          previewUrl: null,
          isLoading: false,
          error: error.message
        });
      });
  }, [websiteUrl]);

  return state;
}

export default usePreview;
