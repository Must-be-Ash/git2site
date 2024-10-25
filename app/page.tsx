import { GithubForm } from '@/components/github-form';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Git2Site</h1>
          <p className="text-lg text-muted-foreground">
            Transform your GitHub repositories into a beautiful portfolio website instantly
          </p>
        </div>
        <GithubForm />
      </div>
    </main>
  );
}