          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-sm text-gray-500">
              Failed to load preview
            </div>
          ) : previewUrl ? (
            <Image
              src={previewUrl}
              alt={`Preview of ${repo.name}`}
              layout="fill"
              objectFit="cover"
              className="transition-opacity hover:opacity-80"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-sm text-gray-500">
              No preview available
            </div>
          )}


# code insperation:

## Page Preview Service

// app/api/preview/route.ts
import puppeteer from 'puppeteer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: 'new',
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630 });
    
    // Navigate to the page
    await page.goto(url, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    // Take screenshot
    const screenshot = await page.screenshot({
      type: 'png',
      encoding: 'base64'
    });

    await browser.close();

    // Return the base64 image
    return NextResponse.json({ 
      preview: `data:image/png;base64,${screenshot}`
    });

  } catch (error) {
    console.error('Preview generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate preview' }, 
      { status: 500 }
    );
  }
}

## Preview Hook


// hooks/usePreview.ts
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

## Repository Card Component

// components/repository-card.tsx
import { usePreview } from '@/hooks/usePreview';

interface RepositoryCardProps {
  repository: {
    name: string;
    url: string;
    description: string;
  };
}

export function RepositoryCard({ repository }: RepositoryCardProps) {
  const { previewUrl, isLoading, error } = usePreview(repository.url);

  return (
    <div className="rounded-lg overflow-hidden shadow-lg">
      <div className="aspect-video relative overflow-hidden bg-gray-100">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
            Failed to load preview
          </div>
        ) : previewUrl ? (
          <img
            src={previewUrl}
            alt={`Preview of ${repository.name}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
            No preview available
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{repository.name}</h3>
        <p className="text-sm text-gray-600">{repository.description}</p>
      </div>
    </div>
  );
}