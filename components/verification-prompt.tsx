"use client";

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function VerificationPrompt({ username }: { username: string }) {
  const handleVerify = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/github/callback`;
    const scope = 'read:user';
    
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${username}`;
    
    window.location.href = githubAuthUrl;
  };

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
      <p className="font-bold">Verify Your Account</p>
      <p>To edit your portfolio, please verify your GitHub account:</p>
      <Button onClick={handleVerify} className="mt-2">
        Verify with GitHub
      </Button>
    </div>
  );
}
