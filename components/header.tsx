import Link from 'next/link';
import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center space-x-2">
          <Github className="h-6 w-6" />
          <span className="text-xl font-bold">Git2Site</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="outline" asChild>
            <Link href="https://github.com/yourusername/git2site" target="_blank">
              <Github className="mr-2 h-4 w-4" />
              Star on GitHub
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}