'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Github, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function GithubForm() {
  const [githubUrl, setGithubUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const username = extractGithubUsername(githubUrl);
      if (!username) {
        throw new Error('Invalid GitHub URL or username');
      }

      const response = await fetch('/api/portfolio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate portfolio');
      }

      const data = await response.json();
      toast.success('Portfolio generated successfully!');
      router.push(`/${username}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate portfolio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="text"
          placeholder="Enter GitHub profile URL or username (e.g., Must-be-Ash)"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={loading || !githubUrl.trim()}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Github className="mr-2 h-4 w-4" />
              Generate Portfolio
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function extractGithubUsername(input: string): string | null {
  try {
    if (!input) return null;
    
    // Remove any trailing slashes and query parameters
    input = input.replace(/\/+$/, '').split('?')[0];
    
    // Handle direct username input
    if (/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(input)) {
      return input;
    }

    // Handle GitHub URLs
    const url = new URL(input);
    if (!url.hostname.includes('github.com')) return null;
    
    const parts = url.pathname.split('/').filter(Boolean);
    return parts[0] || null;
  } catch {
    // If URL parsing fails, try treating the input as a username
    const username = input.trim().split('/')[0].replace('@', '');
    if (username && /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(username)) {
      return username;
    }
    return null;
  }
}