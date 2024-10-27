import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import Link from 'next/link';
import { Github, Globe, Linkedin, Twitter, Mail } from 'lucide-react';
import { Theme } from '@/types/theme';
import { Project } from '@/types/project';
import { Portfolio } from '@/types/portfolio';

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
  portfolioData?: Portfolio;
}

export function PortfolioPreview({ projects, theme, profile, socialLinks, personalDomain, portfolioData }: PortfolioPreviewProps) {
  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {portfolioData ? (
          <>
            {/* Profile Section */}
            <div className="mb-8 text-center">
              {portfolioData.sections.profile.data?.avatar && (
                <Image
                  src={portfolioData.sections.profile.data.avatar}
                  alt={portfolioData.sections.profile.data.name}
                  width={100}
                  height={100}
                  className="rounded-full mx-auto mb-4"
                />
              )}
              <h1 className="text-3xl font-bold mb-2" style={{ color: theme.colors.primary }}>
                {portfolioData.sections.profile.data?.name}
              </h1>
              <p className="text-lg mb-4" style={{ color: theme.colors.primary }}>
                {portfolioData.sections.profile.data?.bio}
              </p>
              
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

            {/* Skills Section */}
            {portfolioData.sections.skills.data && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {portfolioData.sections.skills.data.map((skill, index) => (
                    <span key={index} className="px-2 py-1 rounded" style={{
                      backgroundColor: theme.colors.tag,
                      color: theme.colors.primary,
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Section */}
            {portfolioData.sections.projects.data && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {portfolioData.sections.projects.data.map((project, index) => (
                  <Card key={index} className="overflow-hidden flex flex-col" style={{
                    backgroundColor: theme.colors.card,
                    color: theme.colors.foreground,
                    borderColor: theme.colors.primary,
                    ...(theme.cardStyle === 'bordered' ? { border: '1px solid' } : {}),
                    ...(theme.cardStyle === 'elevated' ? { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' } : {}),
                  }}>
                    <CardHeader className="p-0">
                      <div className="relative w-full h-48">
                        <Image
                          src={project.image}
                          alt={`${project.name} thumbnail`}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 flex-grow">
                      <h2 className="text-2xl font-bold mb-2">{project.name}</h2>
                      <p className="mb-4">{project.description}</p>
                    </CardContent>
                    <CardFooter className="p-6 pt-0 flex justify-end">
                      <Button variant={theme.buttonStyle} asChild style={{
                        backgroundColor: theme.colors.button,
                        color: theme.colors['button-foreground'],
                        borderColor: theme.colors.button,
                      }}>
                        <Link href={project.url} target="_blank" rel="noopener noreferrer">
                          View Project
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            {/* Repositories Section */}
            {portfolioData.sections.repositories.data && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">GitHub Repositories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portfolioData.sections.repositories.data.map((repo, index) => (
                    <Card key={index} className="p-4" style={{
                      backgroundColor: theme.colors.card,
                      color: theme.colors.foreground,
                      borderColor: theme.colors.primary,
                    }}>
                      <h3 className="text-xl font-bold mb-2">{repo.name}</h3>
                      <p className="mb-2">{repo.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{ color: theme.colors.primary }}>{repo.language}</span>
                        <div>
                          <span className="mr-2">⭐ {repo.stars}</span>
                          <span>🍴 {repo.forks}</span>
                        </div>
                      </div>
                      <Button variant={theme.buttonStyle} className="mt-2" asChild style={{
                        backgroundColor: theme.colors.button,
                        color: theme.colors['button-foreground'],
                        borderColor: theme.colors.button,
                      }}>
                        <Link href={repo.url} target="_blank" rel="noopener noreferrer">
                          View on GitHub
                        </Link>
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-4 text-center">
            <p>No portfolio data available. Generate your portfolio to see the preview.</p>
          </div>
        )}

        {personalDomain && (
          <div className="mt-4 text-center">
            <Link href={personalDomain} target="_blank" rel="noopener noreferrer" className="text-accent-foreground hover:underline">
              {personalDomain}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
