import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Prevent multiple redirects by checking if we're already in the OAuth flow
  const url = new URL(request.url);
  if (url.searchParams.has('code')) {
    return redirect(url.toString());
  }
  
  const redirectUri = 'https://www.git2site.pro/api/auth/github/callback';
  
  console.log('Starting GitHub OAuth flow');
  console.log('Using redirect URI:', redirectUri);

  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    redirect_uri: redirectUri,
    scope: 'read:user user:email repo',
    state: Math.random().toString(36).substring(7),
  })

  const authUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
  return redirect(authUrl);
}
