import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import Link from 'next/link';
import { Github, Globe, Linkedin, Twitter, Mail } from 'lucide-react';
import { Theme } from '@/types/theme';
import { Project } from '@/types/project';

interface PortfolioPreviewProps {
  projects: Project[];
  theme: Theme;
  profile: {
    name: string;
    bio: string;
    avatarUrl: string;
  };
  socialLinks: {
    linkedinUrl?: string;
    twitterUrl?: string;
    emailAddress?: string;
  };
  personalDomain?: string;
}

export function PortfolioPreview({ projects, theme, profile, socialLinks, personalDomain }: PortfolioPreviewProps) {
  return (
    <div className="flex-1 overflow-auto p-8" style={{
      backgroundColor: theme.colors.background,
      color: theme.colors.foreground,
      fontFamily: theme.font,
    }}>
      <div className="mb-8 text-center">
        {profile.avatarUrl && (
          <Image
            src={profile.avatarUrl}
            alt={profile.name}
            width={100}
            height={100}
            className="rounded-full mx-auto mb-4"
          />
        )}
        <h1 className="text-3xl font-bold mb-2" style={{ color: theme.colors.primary }}>{profile.name}</h1>
        <p className="text-lg mb-4" style={{ color: theme.colors.primary }}>{profile.bio}</p>
        
        {/* Social Links */}
        <div className="mt-4 flex justify-center gap-4">
          {socialLinks.linkedinUrl && (
            <Button variant={theme.buttonStyle} size="icon" asChild style={{
              backgroundColor: theme.colors.button,
              color: theme.colors['button-foreground'],
              borderColor: theme.colors.button,
            }}>
              <Link href={socialLinks.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
                <Linkedin className="w-5 h-5" />
              </Link>
            </Button>
          )}
          {socialLinks.twitterUrl && (
            <Button variant={theme.buttonStyle} size="icon" asChild style={{
              backgroundColor: theme.colors.button,
              color: theme.colors['button-foreground'],
              borderColor: theme.colors.button,
            }}>
              <Link href={socialLinks.twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter Profile">
                <Twitter className="w-5 h-5" />
              </Link>
            </Button>
          )}
          {socialLinks.emailAddress && (
            <Button variant={theme.buttonStyle} size="icon" asChild style={{
              backgroundColor: theme.colors.button,
              color: theme.colors['button-foreground'],
              borderColor: theme.colors.button,
            }}>
              <Link href={`mailto:${socialLinks.emailAddress}`} aria-label="Email">
                <Mail className="w-5 h-5" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden flex flex-col" style={{
            backgroundColor: theme.colors.card,
            color: theme.colors.foreground,
            borderColor: theme.colors.primary,
            ...(theme.cardStyle === 'bordered' ? { border: '1px solid' } : {}),
            ...(theme.cardStyle === 'elevated' ? { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' } : {}),
          }}>
            <CardHeader className="p-0">
              <div className="relative w-full h-48">
                <Image
                  src={project.thumbnailUrl}
                  alt={`${project.name} thumbnail`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </CardHeader>
            <CardContent className="p-6 flex-grow">
              <h2 className="text-2xl font-bold mb-2">{project.name}</h2>
              <p className="mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.languages.map((lang: string) => (
                  <span key={lang} className="text-xs px-2 py-1 rounded" style={{
                    backgroundColor: theme.colors.tag,
                    color: theme.colors.primary,
                  }}>
                    {lang}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex justify-end gap-2">
              <Button variant={theme.buttonStyle} size="icon" asChild style={{
                backgroundColor: theme.colors.button,
                color: theme.colors['button-foreground'],
                borderColor: theme.colors.button,
              }}>
                <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="View GitHub repository">
                  <Github className="w-5 h-5" />
                </Link>
              </Button>
              {project.websiteUrl && (
                <Button variant={theme.buttonStyle} size="icon" asChild style={{
                  backgroundColor: theme.colors.button,
                  color: theme.colors['button-foreground'],
                  borderColor: theme.colors.button,
                }}>
                  <Link href={project.websiteUrl} target="_blank" rel="noopener noreferrer" aria-label="Visit project website">
                    <Globe className="w-5 h-5" />
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {personalDomain && (
        <div className="mt-4 text-center">
          <Link href={personalDomain} target="_blank" rel="noopener noreferrer" className="text-accent-foreground hover:underline">
            {personalDomain}
          </Link>
        </div>
      )}
    </div>
  );
}
