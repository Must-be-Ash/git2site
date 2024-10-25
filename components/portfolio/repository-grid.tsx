import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, GitFork, ExternalLink } from 'lucide-react';

export function RepositoryGrid({ repositories }: { repositories: any[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {repositories.map((repo) => (
        <Card key={repo.name} className="flex flex-col overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold truncate">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  {repo.name}
                </a>
              </h3>
              {repo.isFeatured && (
                <Badge variant="secondary">Featured</Badge>
              )}
            </div>
            {repo.description && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {repo.description}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {repo.language && (
                <Badge variant="outline">{repo.language}</Badge>
              )}
              {repo.topics?.slice(0, 3).map((topic: string) => (
                <Badge key={topic} variant="secondary">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
          <div className="mt-auto border-t p-4 flex items-center gap-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Star className="mr-1 h-4 w-4" />
              {repo.stars}
            </div>
            {repo.homepage && (
              <a
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center text-sm text-muted-foreground hover:text-primary"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}