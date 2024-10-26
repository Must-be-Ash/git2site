'use client'

import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from '@/components/ui/badge';
import { Star, ExternalLink, Github, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePreview } from '@/hooks/usePreview';

interface Repository {
  id: string;
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  stars: number;
  language: string | null;
  topics: string[];
  isPublic: boolean;
  isFeatured: boolean;
}

function RepositoryCard({ repo }: { repo: Repository }) {
  const { previewUrl, isLoading, error } = usePreview(repo.homepage || repo.url);

  return (
    <Card key={repo.id} className="overflow-hidden flex flex-col">
      <CardHeader className="p-0">
        <Link href={repo.homepage || repo.url} target="_blank" rel="noopener noreferrer">
          <div className="relative w-full h-48">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-sm text-gray-500">
                Failed to load preview
              </div>
            ) : previewUrl ? (
              <Image
                src={previewUrl}
                alt={`Preview of ${repo.name}`}
                layout="fill"
                objectFit="cover"
                className="transition-opacity hover:opacity-80"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-sm text-gray-500">
                No preview available
              </div>
            )}
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <h2 className="text-2xl font-bold mb-2">
          <Link href={repo.homepage || repo.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            {repo.name}
          </Link>
        </h2>
        <p className="text-muted-foreground mb-4">{repo.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {repo.language && (
            <Badge variant="secondary">{repo.language}</Badge>
          )}
          {repo.topics?.slice(0, 3).map((topic: string) => (
            <Badge key={topic} variant="outline">
              {topic}
            </Badge>
          ))}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Star className="mr-1 h-4 w-4" />
          {repo.stars}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-end gap-2">
        <Button variant="default" size="icon" asChild className="bg-primary hover:bg-primary/90">
          <Link href={repo.url} target="_blank" rel="noopener noreferrer" aria-label="View GitHub repository">
            <Github className="w-5 h-5" />
          </Link>
        </Button>
        {repo.homepage && (
          <Button variant="default" size="icon" asChild className="bg-primary hover:bg-primary/90">
            <Link href={repo.homepage} target="_blank" rel="noopener noreferrer" aria-label="Visit project website">
              <Globe className="w-5 h-5" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export function RepositoryGrid({ repositories }: { repositories: Repository[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {repositories.map((repo) => (
        <RepositoryCard key={repo.id} repo={repo} />
      ))}
    </div>
  );
}
