'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import Link from 'next/link';
import { Github, Globe, Linkedin, Twitter, Mail } from 'lucide-react';
import { Theme } from '@/types/theme';
import { Project } from '@/types/project';
import { Portfolio } from '@/types/portfolio';
import usePreview from '@/hooks/usePreview';

// Add this helper function at the top of the file
function serializeData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

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
  // Serialize the portfolio data
  const serializedPortfolioData = portfolioData ? serializeData(portfolioData) : null;

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="max-w-4xl mx-auto rounded-lg overflow-hidden" style={{
        backgroundColor: theme.colors.background,
        fontFamily: theme.font
      }}>
        {serializedPortfolioData ? (
          <>
            {/* Profile Section */}
            <div className="mb-8 text-center p-6">
              {serializedPortfolioData.sections.profile.data?.avatar && (
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Image
                    src={serializedPortfolioData.sections.profile.data.avatar}
                    alt={serializedPortfolioData.sections.profile.data.name}
                    fill
                    className="rounded-full object-cover"
                    style={{
                      border: `2px solid ${theme.colors.primary}`
                    }}
                  />
                </div>
              )}
              <h1 className="text-3xl font-bold mb-2" style={{ 
                color: theme.colors.primary,
                fontFamily: theme.font
              }}>
                {serializedPortfolioData.sections.profile.data?.name}
              </h1>
              <p className="text-lg mb-4" style={{ 
                color: theme.colors.foreground,
                fontFamily: theme.font
              }}>
                {serializedPortfolioData.sections.profile.data?.bio}
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

            {/* Projects Section */}
            {serializedPortfolioData.sections.repositories.data && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                {serializedPortfolioData.sections.repositories.data.map((repo, index) => {
                  return (
                    <RepositoryCard 
                      key={index}
                      repo={{
                        name: repo.name,
                        description: repo.description,
                        url: repo.url,
                        languages: repo.languages || [],
                        stars: repo.stars,
                        forks: repo.forks,
                        // Only include homepage if it exists
                        ...(repo.homepage && { homepage: repo.homepage })
                      }}
                      projectData={serializedPortfolioData.sections.projects.data?.find(
                        project => project.name === repo.name
                      )}
                      theme={theme}
                    />
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="p-4 text-center">
            <p style={{ color: theme.colors.foreground }}>
              No portfolio data available. Generate your portfolio to see the preview.
            </p>
          </div>
        )}

        {personalDomain && (
          <div className="mt-4 text-center p-4">
            <Link 
              href={personalDomain} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:underline"
              style={{ color: theme.colors.primary }}
            >
              {personalDomain}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Create a separate component for the repository card
interface RepositoryCardProps {
  repo: {
    name: string;
    description: string;
    url: string;
    languages: string[];
    stars: number;
    forks: number;
    homepage?: string;  // Add this
  };
  projectData?: {
    name: string;
    url?: string;
  };
  theme: Theme;
}

function RepositoryCard({ repo, projectData, theme }: RepositoryCardProps) {
  // Use homepage URL if available, otherwise use projectData.url
  const websiteUrl = repo.homepage || projectData?.url;
  const preview = usePreview(websiteUrl);
  const { previewUrl, isLoading, error } = preview;

  // Use a fallback image when no preview is available
  const imageUrl = previewUrl || '/placeholder-project.png'; // Make sure to add a placeholder image in your public folder

  return (
    <Card 
      className="overflow-hidden flex flex-col" 
      style={{
        backgroundColor: theme.colors.card,
        color: theme.colors.foreground,
        borderColor: theme.colors.primary,
        fontFamily: theme.font,
        ...(theme.cardStyle === 'bordered' ? { 
          border: `1px solid ${theme.colors.primary}` 
        } : {}),
        ...(theme.cardStyle === 'elevated' ? { 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' 
        } : {})
      }}
    >
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <div className="w-full h-full relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
              </div>
            ) : (
              <Image
                src={imageUrl}
                alt={`${repo.name} thumbnail`}
                fill
                className="object-cover transition-opacity hover:opacity-80"
              />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <h2 className="text-2xl font-bold mb-2" style={{
          color: theme.colors.primary
        }}>{repo.name}</h2>
        
        <p className="mb-4" style={{
          color: theme.colors.foreground
        }}>{repo.description}</p>
        
        {/* Make languages more prominent */}
        {repo.languages && repo.languages.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {repo.languages.map((language) => (
              <span 
                key={language}
                className="text-sm px-3 py-1 rounded-full"
                style={{
                  backgroundColor: theme.colors.tag || '#e5e7eb',
                  color: theme.colors.primary,
                  border: `1px solid ${theme.colors.primary}`,
                }}
              >
                {language}
              </span>
            ))}
          </div>
        )}

        {/* Stats section */}
        <div className="flex items-center gap-3 text-sm mt-2">
          <span className="flex items-center gap-1">
            <span>⭐</span> {repo.stars}
          </span>
          <span className="flex items-center gap-1">
            <span>🍴</span> {repo.forks}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-end gap-2">
        {/* Website Link Button - Show if website URL exists */}
        {websiteUrl && (
          <Button 
            variant={theme.buttonStyle} 
            size="icon" 
            asChild 
            style={{
              backgroundColor: theme.colors.button,
              color: theme.colors['button-foreground'],
              borderColor: theme.colors.button
            }}
          >
            <Link href={websiteUrl} target="_blank" rel="noopener noreferrer" aria-label="Visit project website">
              <Globe className="w-5 h-5" />
            </Link>
          </Button>
        )}
        
        {/* GitHub Repository Button */}
        <Button 
          variant={websiteUrl ? 'outline' : theme.buttonStyle} 
          size="icon" 
          asChild 
          style={{
            backgroundColor: websiteUrl ? 'transparent' : theme.colors.button,
            color: websiteUrl ? theme.colors.button : theme.colors['button-foreground'],
            borderColor: theme.colors.button
          }}
        >
          <Link href={repo.url} target="_blank" rel="noopener noreferrer" aria-label="View GitHub repository">
            <Github className="w-5 h-5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
