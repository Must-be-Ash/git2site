import Image from 'next/image';
import Link from 'next/link';
import { Github, Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";

interface RepositoryCardProps {
  repo: any;
  themeColors: any;
  cardStyle: 'default' | 'bordered' | 'elevated';
  buttonStyle: 'default' | 'outline' | 'ghost';
  languageTagColor: string;
  languageTagTextColor: string;
  borderColor: string;
}

const cardStyles = {
  default: {},
  bordered: { border: '1px solid' },
  elevated: { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' },
};

export default function RepositoryCard({ 
  repo, 
  themeColors, 
  cardStyle, 
  buttonStyle, 
  languageTagColor, 
  languageTagTextColor,
  borderColor
}: RepositoryCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col" style={{
      backgroundColor: themeColors.card,
      color: themeColors['card-foreground'],
      borderRadius: '12px',
      borderColor: borderColor,
      ...cardStyles[cardStyle],
    }}>
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={repo.thumbnailUrl || '/placeholder-image.jpg'}
            alt={`Preview of ${repo.name}`}
            layout="fill"
            objectFit="cover"
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <h2 className="text-2xl font-bold mb-2">{repo.name}</h2>
        <p className="mb-4">{repo.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {repo.language && (
            <span className="text-xs px-2 py-1 rounded" style={{
              backgroundColor: languageTagColor,
              color: languageTagTextColor,
            }}>
              {repo.language}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-end gap-2">
        <Button variant={buttonStyle} size="icon" asChild style={{
          backgroundColor: themeColors.button,
          color: themeColors['button-foreground'],
          borderColor: themeColors.button,
        }}>
          <Link href={repo.url} target="_blank" rel="noopener noreferrer" aria-label="View GitHub repository">
            <Github className="w-5 h-5" />
          </Link>
        </Button>
        {repo.homepage && (
          <Button variant={buttonStyle} size="icon" asChild style={{
            backgroundColor: themeColors.button,
            color: themeColors['button-foreground'],
            borderColor: themeColors.button,
          }}>
            <Link href={repo.homepage} target="_blank" rel="noopener noreferrer" aria-label="Visit project website">
              <Globe className="w-5 h-5" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
