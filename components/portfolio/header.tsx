import { Github, Globe, MapPin, Twitter } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export function PortfolioHeader({ user }: { user: any }) {
  return (
    <header className="border-b bg-card">
      <div className="container px-4 py-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-24 w-24 rounded-full"
            />
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="mt-1 text-xl text-muted-foreground">@{user.username}</p>
              {user.bio && (
                <p className="mt-2 max-w-2xl text-muted-foreground">{user.bio}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-4">
                {user.location && (
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4" />
                    {user.location}
                  </div>
                )}
                {user.blog && (
                  <a
                    href={user.blog}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-muted-foreground hover:text-primary"
                  >
                    <Globe className="mr-1 h-4 w-4" />
                    Website
                  </a>
                )}
                {user.twitter && (
                  <a
                    href={`https://twitter.com/${user.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-muted-foreground hover:text-primary"
                  >
                    <Twitter className="mr-1 h-4 w-4" />
                    @{user.twitter}
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <a
              href={`https://github.com/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-muted-foreground hover:text-primary"
            >
              <Github className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}