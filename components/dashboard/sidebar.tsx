'use client';

import React from 'react';
import { ThemeCustomizer } from './ThemeCustomizer';
import { ColorPicker } from './color-picker';
import { Theme } from '@/lib/themes';  // Use this import instead of from types/theme
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ThemeSelector } from './theme-selector';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ThemeProperty = keyof Theme | `colors.${keyof Theme['colors']}`;

interface Repository {
  name: string;
  description: string;
  isPrivate: boolean;
  isSelected: boolean;
}

interface SidebarProps {
  theme: Theme;
  onThemeChange: (property: ThemeProperty, value: string) => void;
  onThemeSelect?: (theme: Theme) => void;
  onButtonIconColorChange: (color: string) => void;
  onAccentTextColorChange: (color: string) => void;
  onLanguageTagColorChange: (color: string) => void;
  socialLinks: {
    linkedinUrl: string;
    twitterUrl: string;
    emailAddress: string;
  };
  onSocialLinksChange: (field: string, value: string) => void;
  personalDomain: string;
  onPersonalDomainChange: (value: string) => void;
  profile: {
    name: string;
    bio: string;
    avatarUrl: string;
  };
  onProfileChange: (field: string, value: string) => void;
}

export function Sidebar({
  theme,
  onThemeChange,
  onThemeSelect,
  onButtonIconColorChange,
  onAccentTextColorChange,
  onLanguageTagColorChange,
  socialLinks,
  onSocialLinksChange,
  personalDomain,
  onPersonalDomainChange,
  profile,
  onProfileChange
}: SidebarProps) {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      console.log("Fetching repositories and selection state...");
      setIsLoading(true);
      const response = await fetch('/api/repositories');
      if (!response.ok) throw new Error('Failed to fetch repositories');
      
      const data = await response.json();
      console.log("Received repositories data:", {
        total: data.repositories.length,
        selected: data.repositories.filter((r: any) => r.isSelected).length
      });
      
      setRepositories(data.repositories);
    } catch (err) {
      console.error("Error fetching repositories:", err);
      setError(err instanceof Error ? err.message : 'Failed to load repositories');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRepository = (repoName: string) => {
    setRepositories(repos => 
      repos.map(repo => 
        repo.name === repoName 
          ? { ...repo, isSelected: !repo.isSelected }
          : repo
      )
    );
  };

  const handleSaveAll = useCallback(async () => {
    console.log("=== Saving All User Preferences ===");
    try {
      const selectedRepos = repositories.filter(repo => repo.isSelected);
      console.log("Selected repositories:", selectedRepos);

      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme,
          socialLinks,
          personalDomain,
          profile,
          selectedRepositories: selectedRepos
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      const result = await response.json();
      console.log("Save response:", result);
      console.log("Successfully saved all preferences including selected repositories");
    } catch (error) {
      console.error("Error saving preferences:", error);
      setError('Failed to save preferences');
    }
  }, [repositories, theme, socialLinks, personalDomain, profile]);

  useEffect(() => {
    const saveButton = document.querySelector('button:has(.w-4.h-4.mr-2)');
    if (saveButton) {
      saveButton.addEventListener('click', handleSaveAll);
    }
    return () => {
      if (saveButton) {
        saveButton.removeEventListener('click', handleSaveAll);
      }
    };
  }, [handleSaveAll]);

  return (
    <div className="w-80 border-r bg-[#888888] p-6 space-y-6 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Theme Customization</h2>
      
      {/* Add the ThemeSelector component */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Preset Theme
        </label>
        <ThemeSelector 
          currentTheme={theme} 
          onThemeChange={onThemeSelect || (() => {})} 
        />
      </div>

      <ThemeCustomizer 
        theme={theme} 
        onThemeChange={onThemeChange} 
      />
      {/* <ColorPicker
        label="Button Icon Color"
        value={theme.colors['button-foreground']}
        onChange={onButtonIconColorChange}
      />
      <ColorPicker
        label="Accent Text Color"
        value={theme.colors.primary}
        onChange={onAccentTextColorChange}
      />
      <ColorPicker
        label="Language Tag Color"
        value={theme.colors.tag || ''}
        onChange={onLanguageTagColorChange}
      /> */}
      
      <div className="border-t pt-4 mt-4">
        <h3 className="text-lg font-semibold mb-2">Social Links</h3>
        <div className="space-y-2">
          <div>
            <Label htmlFor="linkedin-url">LinkedIn URL</Label>
            <Input
              id="linkedin-url"
              type="url"
              value={socialLinks.linkedinUrl}
              onChange={(e) => onSocialLinksChange('linkedinUrl', e.target.value)}
              placeholder="https://linkedin.com/in/yourusername"
            />
          </div>
          <div>
            <Label htmlFor="twitter-url">Twitter URL</Label>
            <Input
              id="twitter-url"
              type="url"
              value={socialLinks.twitterUrl}
              onChange={(e) => onSocialLinksChange('twitterUrl', e.target.value)}
              placeholder="https://twitter.com/yourusername"
            />
          </div>
          <div>
            <Label htmlFor="email-address">Email Address</Label>
            <Input
              id="email-address"
              type="email"
              value={socialLinks.emailAddress}
              onChange={(e) => onSocialLinksChange('emailAddress', e.target.value)}
              placeholder="you@example.com"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-4 mt-4">
        <h3 className="text-lg font-semibold mb-2">Personal Domain</h3>
        <div>
          <Label htmlFor="personal-domain">Domain</Label>
          <Input
            id="personal-domain"
            type="url"
            value={personalDomain}
            onChange={(e) => onPersonalDomainChange(e.target.value)}
            placeholder="https://yourdomain.com"
          />
        </div>
      </div>

      <div className="border-t pt-4 mt-4">
        <h3 className="text-lg font-semibold mb-2">Profile Information</h3>
        <div className="space-y-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => onProfileChange('name', e.target.value)}
              placeholder="Your Name"
            />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => onProfileChange('bio', e.target.value)}
              placeholder="A short bio about yourself"
            />
          </div>
          <div>
            <Label htmlFor="avatar-url">Avatar URL</Label>
            <Input
              id="avatar-url"
              value={profile.avatarUrl}
              onChange={(e) => onProfileChange('avatarUrl', e.target.value)}
              placeholder="https://example.com/your-avatar.jpg"
            />
          </div>
        </div>
      </div>

      {/* Repository Selection Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Select Repositories</h3>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm">{error}</div>
        ) : (
          <div className="space-y-2">
            {repositories.map((repo) => (
              <div key={repo.name} className="flex text-white items-start space-x-2 p-2 rounded hover:bg-gray-100 hover:text-black">
                <Checkbox
                  id={repo.name}
                  checked={repo.isSelected}
                  onCheckedChange={() => toggleRepository(repo.name)}
                />
                <div className="space-y-1">
                  <label
                    htmlFor={repo.name}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {repo.name} {repo.isPrivate && <span className="text-xs text-[#484848]">(Private)</span>}
                  </label>
                  {repo.description && (
                    <p className="text-xs text-[#4d4d4d]">{repo.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Button
      <Button 
        className="w-full"
        onClick={handleSaveAll}
      >
        Save Changes
      </Button> */}
    </div>
  );
}
