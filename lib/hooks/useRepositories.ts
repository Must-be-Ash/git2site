"use client";

import useSWR from 'swr';
import { usePortfolioStore } from '@/lib/store/usePortfolioStore';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch repositories');
  return res.json();
};

export function useRepositories(username?: string) {
  const setRepositories = usePortfolioStore((state) => state.setRepositories);
  
  const { data, error, mutate } = useSWR(
    username ? `/api/repositories/${username}` : null,
    fetcher,
    {
      onSuccess: (data) => {
        setRepositories(data);
      },
    }
  );

  return {
    repositories: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}