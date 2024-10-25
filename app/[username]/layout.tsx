import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Portfolio',
  description: 'View user portfolio',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
