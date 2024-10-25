import type { GitHubProfile, GitHubRepository } from './github';

interface PortfolioResponse {
  success: boolean;
  username: string;
  profile: GitHubProfile;
  repositories: GitHubRepository[];
}

const API_BASE = '/api';

export async function generatePortfolio(username: string): Promise<PortfolioResponse> {
  const response = await fetch(`${API_BASE}/portfolio/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate portfolio');
  }

  return response.json();
}

export async function getPortfolio(username: string) {
  const response = await fetch(`${API_BASE}/repositories/${username}`);

  if (!response.ok) {
    throw new Error('Failed to fetch portfolio');
  }

  return response.json();
}