import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { Repository } from '@/lib/models/repository';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { themes, ThemeName, getTheme } from '@/lib/themes';
import { StyledThemeProvider } from '@/components/StyledThemeProvider';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Github, Globe, Linkedin, Twitter, Mail } from 'lucide-react';
import React from 'react';
import { PortfolioPreview } from '@/components/dashboard/PortfolioPreview';
import { PortfolioService } from '@/lib/models/portfolio';
import { Theme } from '@/types/theme';

// This is the correct way to set dynamic behavior for Next.js 13+
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { username: string } }) {
  await connectDB();
  const user = await User.findOne({ username: params.username });

  if (!user) {
    return {
      title: 'User Not Found',
    };
  }

  return {
    title: `${user.name || user.username}'s Portfolio`,
    description: user.bio || `Check out ${user.username}'s portfolio`,
    openGraph: {
      title: `${user.name || user.username}'s Portfolio`,
      description: user.bio || `Check out ${user.username}'s portfolio`,
      images: user.avatar ? [{ url: user.avatar }] : [],
    },
  };
}

function serializeDocument(doc: any) {
  const serialized = JSON.parse(JSON.stringify(doc));
  if (serialized._id) {
    serialized.id = serialized._id.toString();
    delete serialized._id;
  }
  return serialized;
}

// Use a regular import instead
import RepositoryCard from '@/components/RepositoryCard';

export default async function UserPage({ params }: { params: { username: string } }) {
  await connectDB();

  // Find user by username
  const user = await User.findOne({ username: params.username });
  if (!user) {
    notFound();
  }

  // Get user's portfolio data
  const portfolio = await PortfolioService.findOne({ userId: user._id.toString() });
  if (!portfolio) {
    notFound();
  }

  // Convert the stored theme to the Theme type
  const userTheme: Theme = {
    name: user.theme?.name || themes.base.name,
    buttonStyle: user.theme?.buttonStyle || themes.base.buttonStyle,
    cardStyle: user.theme?.cardStyle || themes.base.cardStyle,
    font: user.theme?.fontFamily || themes.base.font,
    colors: {
      background: user.theme?.colors?.background || themes.base.colors.background,
      foreground: user.theme?.colors?.foreground || themes.base.colors.foreground,
      card: user.theme?.colors?.card || themes.base.colors.card,
      'card-foreground': user.theme?.colors?.['card-foreground'] || themes.base.colors['card-foreground'],
      primary: user.theme?.colors?.primary || themes.base.colors.primary,
      secondary: user.theme?.colors?.secondary || themes.base.colors.secondary,
      button: user.theme?.colors?.button || themes.base.colors.button,
      'button-foreground': user.theme?.colors?.['button-foreground'] || themes.base.colors['button-foreground'],
      tag: user.theme?.colors?.tag || themes.base.colors.tag,
    }
  };

  // Prepare profile data
  const profile = {
    name: user.name || user.username,
    bio: user.bio || '',
    avatarUrl: user.avatar || '',
  };

  // Prepare social links
  const socialLinks = user.socialLinks || {};

  return (
    <div className="min-h-screen">
      <PortfolioPreview
        projects={[]} // This is handled by portfolioData now
        theme={userTheme}
        profile={profile}
        socialLinks={socialLinks}
        personalDomain={user.personalDomain}
        portfolioData={portfolio}
      />
    </div>
  );
}
