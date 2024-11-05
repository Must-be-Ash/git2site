import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Return the URL directly for the preview
    return NextResponse.json({
      previewUrl: url,
      isLoading: false,
      error: null
    });

  } catch (error: unknown) {
    console.error('Preview generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({
      previewUrl: null,
      isLoading: false,
      error: errorMessage
    });
  }
}
