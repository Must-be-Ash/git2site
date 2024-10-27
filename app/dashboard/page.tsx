"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Save, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@/lib/hooks/useUser';
import { Sidebar } from '@/components/dashboard/sidebar';
import { PortfolioPreview } from '@/components/dashboard/PortfolioPreview';
import { RefreshPortfolio } from '@/components/dashboard/refresh-portfolio';
import { Theme, themes, ThemeColors } from '@/lib/themes';
import { Project } from '@/types/project';
import { Portfolio } from '@/types/portfolio';

// Update the type definition
type ThemeProperty = keyof Theme | `colors.${keyof Theme['colors']}`;

export default function DashboardPage() {
  const { user, loading } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => themes.base);
  const [customTheme, setCustomTheme] = useState<Theme>(() => themes.base);
  const [profile, setProfile] = useState({ name: '', bio: '', avatarUrl: '' });
  const [generatingPortfolio, setGeneratingPortfolio] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [socialLinks, setSocialLinks] = useState({ linkedinUrl: '', twitterUrl: '', emailAddress: '' });
  const [personalDomain, setPersonalDomain] = useState('');
  const [portfolioData, setPortfolioData] = useState<Portfolio | undefined>(undefined);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch('/api/user/preferences');
      if (response.ok) {
        const data = await response.json();
        setCustomTheme(data.theme || themes.base);
        setProfile({
          name: data.name || '',
          bio: data.bio || '',
          avatarUrl: data.avatar || '',
        });
        setSocialLinks(data.socialLinks || {});
        setPersonalDomain(data.personalDomain || '');
      } else {
        console.error('Failed to fetch user preferences');
      }

      const projectsResponse = await fetch('/api/user/projects');
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
      } else {
        console.error('Failed to fetch user projects');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('An error occurred while fetching user data.');
    }
  }, []);

  const fetchPortfolioData = useCallback(async () => {
    try {
      const response = await fetch('/api/portfolio/status');
      if (response.ok) {
        const data = await response.json();
        setPortfolioData(data.data);
        setGenerationProgress(data.progress);
      } else {
        console.error('Failed to fetch portfolio data');
      }
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchPortfolioData();
    }
  }, [user, fetchUserData, fetchPortfolioData]);

  const handleThemeChange = (property: ThemeProperty, value: string) => {
    setCustomTheme(prevTheme => {
      if (property.startsWith('colors.')) {
        const colorKey = property.split('.')[1] as keyof Theme['colors'];
        return {
          ...prevTheme,
          colors: {
            ...prevTheme.colors,
            [colorKey]: value,
          },
        };
      }
      return {
        ...prevTheme,
        [property]: value,
      };
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme: customTheme,
          socialLinks,
          personalDomain,
          name: profile.name,
          bio: profile.bio,
          avatar: profile.avatarUrl,
        }),
      });

      if (response.ok) {
        toast.success('Preferences saved successfully');
      } else {
        throw new Error('Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('An error occurred while saving preferences');
    }
  };

  const handleShare = async () => {
    try {
      const response = await fetch('/api/user/share', {
        method: 'POST',
      });

      if (response.ok) {
        const { url } = await response.json();
        navigator.clipboard.writeText(url);
        toast.success('Portfolio URL copied to clipboard');
      } else {
        throw new Error('Failed to generate share URL');
      }
    } catch (error) {
      console.error('Error sharing portfolio:', error);
      toast.error('An error occurred while sharing the portfolio');
    }
  };

  const generatePortfolio = async () => {
    try {
      setGeneratingPortfolio(true);
      const response = await fetch('/api/portfolio/generate', {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Portfolio generation started');
        // Start polling for status
        pollGenerationStatus();
      } else {
        throw new Error('Failed to start portfolio generation');
      }
    } catch (error) {
      console.error('Error generating portfolio:', error);
      toast.error('An error occurred while generating the portfolio');
    } finally {
      setGeneratingPortfolio(false);
    }
  };

  const pollGenerationStatus = useCallback(async (): Promise<() => void> => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/portfolio/status');
        if (response.ok) {
          const data = await response.json();
          setGenerationProgress(data.progress);
          setPortfolioData(data.data);
          if (data.status === 'completed') {
            clearInterval(pollInterval);
            toast.success('Portfolio generation completed');
            setGenerationProgress(0);
          } else if (data.status === 'failed') {
            clearInterval(pollInterval);
            toast.error('Portfolio generation failed');
            setGenerationProgress(0);
          }
        }
      } catch (error) {
        console.error('Error polling generation status:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    let cancelPolling: (() => void) | undefined;

    if (generatingPortfolio) {
      pollGenerationStatus().then((cancelFn) => {
        cancelPolling = cancelFn;
      });
    }

    return () => {
      if (cancelPolling) {
        cancelPolling();
      }
    };
  }, [generatingPortfolio, pollGenerationStatus]);

  const handleSocialLinksChange = (field: string, value: string) => {
    setSocialLinks(prev => ({ ...prev, [field]: value }));
  };

  const handlePersonalDomainChange = (value: string) => {
    setPersonalDomain(value);
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleThemeSelect = (newTheme: Theme) => {
    setCustomTheme(newTheme);
  };

  // Add these handler functions
  const handleButtonIconColorChange = (color: string) => {
    handleThemeChange('colors.button-foreground', color);
  };

  const handleAccentTextColorChange = (color: string) => {
    handleThemeChange('colors.primary', color);
  };

  const handleLanguageTagColorChange = (color: string) => {
    handleThemeChange('colors.tag', color);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        theme={customTheme}
        onThemeChange={handleThemeChange}
        onThemeSelect={handleThemeSelect}
        onButtonIconColorChange={handleButtonIconColorChange}
        onAccentTextColorChange={handleAccentTextColorChange}
        onLanguageTagColorChange={handleLanguageTagColorChange}
        socialLinks={socialLinks}
        onSocialLinksChange={handleSocialLinksChange}
        personalDomain={personalDomain}
        onPersonalDomainChange={handlePersonalDomainChange}
        profile={profile}
        onProfileChange={handleProfileChange}
      />
      <div className="flex-1 flex flex-col">
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
            <RefreshPortfolio
              onRefresh={generatePortfolio}
              isGenerating={generatingPortfolio}
              progress={generationProgress}
            />
          </div>
        </header>
        <PortfolioPreview
          projects={projects}
          theme={customTheme}
          profile={profile}
          socialLinks={socialLinks}
          personalDomain={personalDomain}
          portfolioData={portfolioData}
        />
      </div>
    </div>
  );
}
