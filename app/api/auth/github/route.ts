import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Hardcode the production redirect URI
  const redirectUri = 'https://www.git2site.pro/api/auth/github/callback';
  
  // Log the redirect URI we're using
  console.log('Using redirect URI:', redirectUri);

  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    redirect_uri: redirectUri,
    scope: 'read:user user:email repo',
    state: Math.random().toString(36).substring(7),
  })

  const authUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
  console.log('Redirecting to GitHub with URL:', authUrl);

  return redirect(authUrl);
}
