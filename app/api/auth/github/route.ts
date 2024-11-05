import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // According to docs, we can specify up to 10 callback URLs
  // We'll use the first one as default and specify the exact one in redirect_uri
  const redirectUri = process.env.NODE_ENV === 'production'
    ? 'https://git2site.pro/api/auth/github/callback'
    : 'http://localhost:3000/api/auth/github/callback';
  
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Using redirect URI:', redirectUri);

  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    redirect_uri: redirectUri, // Explicitly specify which callback URL to use
    scope: 'read:user user:email repo',
    state: Math.random().toString(36).substring(7), // For CSRF protection
  })

  const authUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
  console.log('Redirecting to GitHub with URL:', authUrl);

  return redirect(authUrl);
}
