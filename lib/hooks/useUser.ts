"use client";

import useSWR from 'swr';
import { useRouter } from 'next/navigation';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch user data');
  return res.json();
};

export function useUser() {
  const { data: user, error, mutate } = useSWR('/api/user', fetcher);
  const router = useRouter();

  const loading = !user && !error;
  const loggedOut = error && error.status === 403;

  if (loggedOut && typeof window !== 'undefined' && window.location.pathname !== '/login') {
    router.push('/login');
  }

  return {
    user,
    loading,
    loggedOut,
    mutate,
  };
}
