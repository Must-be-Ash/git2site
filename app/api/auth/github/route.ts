import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Get the actual host from the request
  const host = request.headers.get('host') || '';
  const isProduction = !host.includes('localhost') && !host.includes('vercel.app');
  
  // Use the exact same domain as registered in GitHub OAuth App
  const redirectUri = isProduction
    ? 'https://www.git2site.pro/api/auth/github/callback'
    : 'http://localhost:3000/api/auth/github/callback';
  
  console.log('Host:', host);
  console.log('Environment:', process.env.NODE_ENV);
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
