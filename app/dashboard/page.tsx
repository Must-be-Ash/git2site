"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Github, Globe, Save, Linkedin, Twitter, Mail, Share2, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { generateThumbnail } from '@/lib/thumbnailService';
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useUser } from '@/lib/hooks/useUser'; // Add this import

interface Project {
  id: string;
  name: string;
  description: string;
  languages: string[];
  githubUrl: string;
  websiteUrl?: string;
  thumbnailUrl: string;
}

interface Theme {
  name: string;
  buttonStyle: 'default' | 'outline' | 'ghost';
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  cardStyle: 'default' | 'bordered' | 'elevated';
  cardColor: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    'card-foreground': string;
    primary: string;
    secondary: string;
    button: string;
    'button-foreground': string;
    tag: string;
  };
}

const presetThemes: Record<string, Theme> = {
  default: {
    name: 'Default',
    buttonStyle: 'default',
    accentColor: '#3b82f6',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    fontFamily: 'Inter, sans-serif',
    cardStyle: 'default',
    cardColor: '#ffffff',
    colors: {
      background: '#ffffff',
      foreground: '#000000',
      card: '#ffffff',
      'card-foreground': '#000000',
      primary: '#3b82f6',
      secondary: '#3b82f6',
      button: '#3b82f6',
      'button-foreground': '#ffffff',
      tag: '#e0e0e0',
    },
  },
  dark: {
    name: 'Dark',
    buttonStyle: 'outline',
    accentColor: '#10b981',
    backgroundColor: '#1f2937',
    textColor: '#ffffff',
    fontFamily: 'Roboto, sans-serif',
    cardStyle: 'bordered',
    cardColor: '#374151',
    colors: {
      background: '#1f2937',
      foreground: '#ffffff',
      card: '#374151',
      'card-foreground': '#ffffff',
      primary: '#10b981',
      secondary: '#10b981',
      button: '#10b981',
      'button-foreground': '#1f2937',
      tag: '#e0e0e0',
    },
  },
  vintage: {
    name: 'Vintage',
    buttonStyle: 'ghost',
    accentColor: '#d97706',
    backgroundColor: '#fef3c7',
    textColor: '#292524',
    fontFamily: 'Merriweather, serif',
    cardStyle: 'elevated',
    cardColor: '#fff7ed',
    colors: {
      background: '#fef3c7',
      foreground: '#292524',
      card: '#fff7ed',
      'card-foreground': '#292524',
      primary: '#d97706',
      secondary: '#d97706',
      button: '#d97706',
      'button-foreground': '#fef3c7',
      tag: '#e0e0e0',
    },
  },
  neon: {
    name: 'Neon',
    buttonStyle: 'default',
    accentColor: '#f0abfc',
    backgroundColor: '#0f172a',
    textColor: '#f0abfc',
    fontFamily: 'Orbitron, sans-serif',
    cardStyle: 'bordered',
    cardColor: '#1e293b',
    colors: {
      background: '#0f172a',
      foreground: '#f0abfc',
      card: '#1e293b',
      'card-foreground': '#f0abfc',
      primary: '#f0abfc',
      secondary: '#f0abfc',
      button: '#f0abfc',
      'button-foreground': '#0f172a',
      tag: '#e0e0e0',
    },
  },
  pastel: {
    name: 'Pastel',
    buttonStyle: 'ghost',
    accentColor: '#fb7185',
    backgroundColor: '#fdf2f8',
    textColor: '#831843',
    fontFamily: 'Quicksand, sans-serif',
    cardStyle: 'default',
    cardColor: '#fce7f3',
    colors: {
      background: '#fdf2f8',
      foreground: '#831843',
      card: '#fce7f3',
      'card-foreground': '#831843',
      primary: '#fb7185',
      secondary: '#fb7185',
      button: '#fb7185',
      'button-foreground': '#fdf2f8',
      tag: '#e0e0e0',
    },
  },
  forest: {
    name: 'Forest',
    buttonStyle: 'outline',
    accentColor: '#22c55e',
    backgroundColor: '#14532d',
    textColor: '#dcfce7',
    fontFamily: 'Cabin, sans-serif',
    cardStyle: 'elevated',
    cardColor: '#166534',
    colors: {
      background: '#14532d',
      foreground: '#dcfce7',
      card: '#166534',
      'card-foreground': '#dcfce7',
      primary: '#22c55e',
      secondary: '#22c55e',
      button: '#22c55e',
      'button-foreground': '#14532d',
      tag: '#e0e0e0',
    },
  },
  ocean: {
    name: 'Ocean',
    buttonStyle: 'default',
    accentColor: '#0ea5e9',
    backgroundColor: '#f0f9ff',
    textColor: '#0c4a6e',
    fontFamily: 'Lato, sans-serif',
    cardStyle: 'bordered',
    cardColor: '#e0f2fe',
    colors: {
      background: '#f0f9ff',
      foreground: '#0c4a6e',
      card: '#e0f2fe',
      'card-foreground': '#0c4a6e',
      primary: '#0ea5e9',
      secondary: '#0ea5e9',
      button: '#0ea5e9',
      'button-foreground': '#f0f9ff',
      tag: '#e0e0e0',
    },
  },
};

const cardStyles = {
  default: {
    boxShadow: 'none',
    border: 'none',
  },
  bordered: {
    boxShadow: 'none',
    border: '1px solid',
  },
  elevated: {
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: 'none',
  },
};

const solidDropdownStyle = "bg-background bg-white border border-input z-20";

export default function DashboardPage() {
  const { user, loading } = useUser(); // Add this line to get user information
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentTheme, setCurrentTheme] = useState<Theme>(presetThemes.default);
  const [customTheme, setCustomTheme] = useState<Theme>(presetThemes.default);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [personalDomain, setPersonalDomain] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [username, setUsername] = useState('');
  const [buttonIconColor, setButtonIconColor] = useState(customTheme.colors['button-foreground']);
  const [accentTextColor, setAccentTextColor] = useState(customTheme.colors.primary || '#000000');
  const [languageTagColor, setLanguageTagColor] = useState(customTheme.colors.tag || '#e0e0e0');
  const [generatingPortfolio, setGeneratingPortfolio] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/preferences');
      if (response.ok) {
        const data = await response.json();
        setCustomTheme({
          ...data.theme,
          backgroundColor: data.theme.colors.background,
          textColor: data.theme.colors.foreground,
          cardColor: data.theme.colors.card,
        });
        setCurrentTheme(data.theme);
        setLinkedinUrl(data.socialLinks?.linkedinUrl || '');
        setTwitterUrl(data.socialLinks?.twitterUrl || '');
        setEmailAddress(data.socialLinks?.emailAddress || '');
        setPersonalDomain(data.personalDomain || '');
        setName(data.name || '');
        setBio(data.bio || '');
        setAvatarUrl(data.avatar || '');
        setUsername(data.username || '');
        setButtonIconColor(data.theme?.colors['button-foreground'] || customTheme.colors['button-foreground']);
        setAccentTextColor(data.theme?.colors.primary || customTheme.colors.primary);
        setLanguageTagColor(data.theme?.colors.tag || customTheme.colors.tag);
      } else {
        toast.error('Failed to fetch user preferences');
      }

      const projectsResponse = await fetch('/api/user/projects');
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
      } else {
        toast.error('Failed to fetch user projects');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('An error occurred while fetching user data');
    }
  };

  const applyTheme = (theme: Theme) => {
    setCustomTheme(theme);
    document.documentElement.style.setProperty('--accent-color', theme.accentColor);
    document.documentElement.style.setProperty('--background-color', theme.backgroundColor);
    document.documentElement.style.setProperty('--text-color', theme.textColor);
    document.documentElement.style.setProperty('--font-family', theme.fontFamily);
    document.documentElement.style.setProperty('--card-color', theme.cardColor);
  };

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  const handleThemeChange = (themeName: string) => {
    const newTheme = presetThemes[themeName];
    if (newTheme) {
      setCurrentTheme(newTheme);
    }
  };

  const handleCustomThemeChange = (property: keyof Theme, value: string) => {
    setCustomTheme(prevTheme => {
      const updatedTheme = { ...prevTheme, [property]: value };
      
      if (['backgroundColor', 'textColor', 'cardColor'].includes(property)) {
        updatedTheme.colors = {
          ...prevTheme.colors,
          background: property === 'backgroundColor' ? value : prevTheme.colors.background,
          foreground: property === 'textColor' ? value : prevTheme.colors.foreground,
          card: property === 'cardColor' ? value : prevTheme.colors.card,
          'card-foreground': property === 'textColor' ? value : prevTheme.colors['card-foreground'],
        };
      }

      return updatedTheme;
    });
  };

  const handleButtonIconColorChange = (color: string) => {
    setButtonIconColor(color);
    setCustomTheme(prevTheme => ({
      ...prevTheme,
      colors: {
        ...prevTheme.colors,
        'button-foreground': color,
      },
    }));
  };

  const handleAccentTextColorChange = (color: string) => {
    setAccentTextColor(color);
    setCustomTheme(prevTheme => ({
      ...prevTheme,
      colors: {
        ...prevTheme.colors,
        primary: color,
      },
    }));
  };

  const handleLanguageTagColorChange = (color: string) => {
    setLanguageTagColor(color);
    setCustomTheme(prevTheme => ({
      ...prevTheme,
      colors: {
        ...prevTheme.colors,
        tag: color,
      },
    }));
  };

  const handleSave = async () => {
    try {
      const preferencesToSave = {
        theme: {
          name: customTheme.name,
          colors: {
            background: customTheme.backgroundColor,
            foreground: customTheme.textColor,
            card: customTheme.cardColor,
            'card-foreground': customTheme.textColor,
            primary: accentTextColor,
            secondary: accentTextColor,
            button: customTheme.colors.button,
            'button-foreground': buttonIconColor,
            tag: languageTagColor,
            'tag-foreground': accentTextColor, // Using accentTextColor for tag text
          },
          font: customTheme.fontFamily,
          buttonStyle: customTheme.buttonStyle,
          cardStyle: customTheme.cardStyle,
        },
        socialLinks: { linkedinUrl, twitterUrl, emailAddress },
        personalDomain,
        name,
        bio,
        avatar: avatarUrl,
      };

      console.log('Saving preferences:', preferencesToSave);

      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferencesToSave),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Preferences saved successfully:', data);
        toast.success('Preferences saved successfully!');
      } else {
        console.error('Failed to save preferences:', await response.text());
        toast.error('Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('An error occurred while saving preferences');
    }
  };

  const handleShare = () => {
    if (username) {
      const portfolioUrl = `${window.location.origin}/${username}`;
      navigator.clipboard.writeText(portfolioUrl).then(() => {
        toast.success('Portfolio URL copied to clipboard!');
      }, () => {
        toast.error('Failed to copy URL. Please try again.');
      });
    } else {
      toast.error('Username not found. Please try again later.');
    }
  };

  const generatePortfolio = async () => {
    if (!user) {
      toast.error('User not found. Please log in again.');
      return;
    }

    setGeneratingPortfolio(true);
    setGenerationProgress(0);
    let step = 0;
    let hasMore = true;

    while (hasMore) {
      try {
        const response = await fetch('/api/portfolio/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, step }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate portfolio');
        }

        const data = await response.json();
        setGenerationProgress((prev) => prev + data.processedRepos.length);
        
        if (data.nextStep === null) {
          hasMore = false;
        } else {
          step = data.nextStep;
        }
      } catch (error) {
        console.error('Error generating portfolio:', error);
        toast.error('An error occurred while generating the portfolio');
        break;
      }
    }

    setGeneratingPortfolio(false);
    toast.success('Portfolio generation completed');
    fetchUserData(); // Refresh the data after generation
  };

  function RepositoryCard({ repo }: { repo: Project }) {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
      <Card key={repo.id} className="overflow-hidden flex flex-col" style={{
        backgroundColor: customTheme.cardColor,
        color: customTheme.textColor,
        borderColor: customTheme.accentColor,
        ...(cardStyles[customTheme.cardStyle] as React.CSSProperties),
      }}>
        <CardHeader className="p-0">
          <div className="relative w-full h-48">
            {!imageLoaded && (
              <Skeleton className="absolute inset-0" />
            )}
            <Image
              src={repo.thumbnailUrl}
              alt={`${repo.name} thumbnail`}
              layout="fill"
              objectFit="cover"
              className={`transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-6 flex-grow">
          <h2 className="text-2xl font-bold mb-2" style={{ color: customTheme.textColor }}>{repo.name}</h2>
          <p className="mb-4" style={{ color: customTheme.textColor }}>{repo.description}</p>
          <div className="flex flex-wrap gap-2">
            {repo.languages.map(lang => (
              <span key={lang} className="text-xs px-2 py-1 rounded" style={{
                backgroundColor: languageTagColor,
                color: accentTextColor, // Using accentTextColor for tag text
              }}>
                {lang}
              </span>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0 flex justify-end gap-2">
          <Button variant={customTheme.buttonStyle} size="icon" asChild style={{
            backgroundColor: customTheme.colors.button,
            color: customTheme.colors['button-foreground'],
            borderColor: customTheme.colors.button,
          }}>
            <Link href={repo.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="View GitHub repository">
              <Github className="w-5 h-5" />
            </Link>
          </Button>
          {repo.websiteUrl && (
            <Button variant={customTheme.buttonStyle} size="icon" asChild style={{
              backgroundColor: customTheme.colors.button,
              color: customTheme.colors['button-foreground'],
              borderColor: customTheme.colors.button,
            }}>
              <Link href={repo.websiteUrl} target="_blank" rel="noopener noreferrer" aria-label="Visit project website">
                <Globe className="w-5 h-5" />
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-muted p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Theme Customization</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="preset-theme">Preset Theme</Label>
            <Select onValueChange={handleThemeChange} defaultValue="default">
              <SelectTrigger id="preset-theme">
                <SelectValue placeholder="Select a preset theme" />
              </SelectTrigger>
              <SelectContent className={solidDropdownStyle}>
                {Object.entries(presetThemes).map(([key, theme]) => (
                  <SelectItem key={key} value={key}>
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
           <div>
            <Label htmlFor="font-family">Font Family</Label>
            <Select
              value={customTheme.fontFamily}
              onValueChange={(value) => handleCustomThemeChange('fontFamily', value)}
            >
              <SelectTrigger id="font-family">
                <SelectValue placeholder="Select font family" />
              </SelectTrigger>
              <SelectContent className={solidDropdownStyle}>
                <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                <SelectItem value="Roboto, sans-serif">Roboto</SelectItem>
                <SelectItem value="Merriweather, serif">Merriweather</SelectItem>
                <SelectItem value="Orbitron, sans-serif">Orbitron</SelectItem>
                <SelectItem value="Quicksand, sans-serif">Quicksand</SelectItem>
                <SelectItem value="Cabin, sans-serif">Cabin</SelectItem>
                <SelectItem value="Lato, sans-serif">Lato</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="background-color">Background Color</Label>
            <Input
              id="background-color"
              type="color"
              value={customTheme.backgroundColor}
              onChange={(e) => handleCustomThemeChange('backgroundColor', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="text-color">Text Color</Label>
            <Input
              id="text-color"
              type="color"
              value={customTheme.textColor}
              onChange={(e) => handleCustomThemeChange('textColor', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="card-style">Card Style</Label>
            <Select
              value={customTheme.cardStyle}
              onValueChange={(value) => handleCustomThemeChange('cardStyle', value)}
            >
              <SelectTrigger id="card-style">
                <SelectValue placeholder="Select card style" />
              </SelectTrigger>
              <SelectContent className={solidDropdownStyle}>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="bordered">Bordered</SelectItem>
                <SelectItem value="elevated">Elevated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="card-color">Card Color</Label>
            <Input
              id="card-color"
              type="color"
              value={customTheme.cardColor}
              onChange={(e) => handleCustomThemeChange('cardColor', e.target.value)}
            />
          </div>
         
                    <div>
            <Label htmlFor="button-style">Button Style</Label>
            <Select
              value={customTheme.buttonStyle}
              onValueChange={(value) => handleCustomThemeChange('buttonStyle', value)}
            >
              <SelectTrigger id="button-style">
                <SelectValue placeholder="Select button style" />
              </SelectTrigger>
              <SelectContent className={solidDropdownStyle}>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="ghost">Ghost</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="button-color">Button Color</Label>
            <Input
              id="button-color"
              type="color"
              value={customTheme.colors.button}
              onChange={(e) => setCustomTheme(prevTheme => ({
                ...prevTheme,
                colors: { ...prevTheme.colors, button: e.target.value }
              }))}
            />
          </div>
          <div>
            <Label htmlFor="button-icon-color">Button Icon Color</Label>
            <Input
              id="button-icon-color"
              type="color"
              value={customTheme.colors['button-foreground']}
              onChange={(e) => setCustomTheme(prevTheme => ({
                ...prevTheme,
                colors: { ...prevTheme.colors, 'button-foreground': e.target.value }
              }))}
            />
          </div>
          <div>
            <Label htmlFor="accent-text-color">Accent Text Color</Label>
            <Input
              id="accent-text-color"
              type="color"
              value={accentTextColor}
              onChange={(e) => handleAccentTextColorChange(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="language-tag-color">Language Tag Color</Label>
            <Input
              id="language-tag-color"
              type="color"
              value={languageTagColor}
              onChange={(e) => handleLanguageTagColorChange(e.target.value)}
            />
          </div>
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Social Links</h3>
            <div className="space-y-2">
              <div>
                <Label htmlFor="linkedin-url">LinkedIn URL</Label>
                <Input
                  id="linkedin-url"
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/yourusername"
                />
              </div>
              <div>
                <Label htmlFor="twitter-url">Twitter URL</Label>
                <Input
                  id="twitter-url"
                  type="url"
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  placeholder="https://twitter.com/yourusername"
                />
              </div>
              <div>
                <Label htmlFor="email-address">Email Address</Label>
                <Input
                  id="email-address"
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </div>
          </div>
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Personal Domain</h3>
            <div>
              <Label htmlFor="personal-domain">Domain</Label>
              <Input
                id="personal-domain"
                type="url"
                value={personalDomain}
                onChange={(e) => setPersonalDomain(e.target.value)}
                placeholder="https://yourdomain.com"
              />
            </div>
          </div>
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Profile Information</h3>
            <div className="space-y-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="A short bio about yourself"
                />
              </div>
              <div>
                <Label htmlFor="avatar-url">Avatar URL</Label>
                <Input
                  id="avatar-url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/your-avatar.jpg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-muted p-4 flex justify-between items-center">
          <div className="space-x-2">
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Theme
            </Button>
            <Button onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button onClick={generatePortfolio} disabled={generatingPortfolio || !user}>
              {generatingPortfolio ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating... ({generationProgress})
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate Portfolio
                </>
              )}
            </Button>
          </div>
        </header>

        {/* Preview */}
        <div className="flex-1 overflow-auto p-8" style={{
          backgroundColor: customTheme.backgroundColor,
          color: customTheme.textColor,
          fontFamily: customTheme.fontFamily,
        }}>
          {/* Header Preview */}
          <div className="mb-8 text-center">
            {avatarUrl && (
              <Image
                src={avatarUrl}
                alt={name}
                width={100}
                height={100}
                className="rounded-full mx-auto mb-4"
              />
            )}
            <h1 className="text-3xl font-bold mb-2" style={{ color: accentTextColor }}>{name}</h1>
            <p className="text-lg mb-4" style={{ color: accentTextColor }}>{bio}</p>
                  {/* Social Links and Personal Domain */}
          <div className="mt-8 flex justify-center gap-4">
            {linkedinUrl && (
              <Button variant={customTheme.buttonStyle} size="icon" asChild style={{
                backgroundColor: customTheme.colors.button,
                color: customTheme.colors['button-foreground'],
                borderColor: customTheme.colors.button,
              }}>
                <Link href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
                  <Linkedin className="w-5 h-5" />
                </Link>
              </Button>
            )}
            {twitterUrl && (
              <Button variant={customTheme.buttonStyle} size="icon" asChild style={{
                backgroundColor: customTheme.colors.button,
                color: customTheme.colors['button-foreground'],
                borderColor: customTheme.colors.button,
              }}>
                <Link href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter Profile">
                  <Twitter className="w-5 h-5" />
                </Link>
              </Button>
            )}
            {emailAddress && (
              <Button variant={customTheme.buttonStyle} size="icon" asChild style={{
                backgroundColor: customTheme.colors.button,
                color: customTheme.colors['button-foreground'],
                borderColor: customTheme.colors.button,
              }}>
                <Link href={`mailto:${emailAddress}`} aria-label="Email">
                  <Mail className="w-5 h-5" />
                </Link>
              </Button>
            )}
          </div>

          </div>

          {/* Projects Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {projects.map(project => (
              <RepositoryCard key={project.id} repo={project} />
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
      </div>
    </div>
  );
}
