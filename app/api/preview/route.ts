import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Return an iframe-based preview
    return NextResponse.json({
      preview: {
        type: 'iframe',
        url: url
      }
    });

  } catch (error: unknown) {
    console.error('Preview generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to generate preview', details: errorMessage },
      { status: 500 }
    );
  }
}
