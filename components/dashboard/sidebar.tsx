import React from 'react';
import { ThemeCustomizer } from './ThemeCustomizer';
import { ColorPicker } from './color-picker';
import { Theme } from '@/types/theme';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SidebarProps {
  theme: Theme;
  onThemeChange: (property: keyof Theme | `colors.${keyof Theme['colors']}`, value: string) => void;
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
  return (
    <div className="w-64 bg-muted p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Theme Customization</h2>
      <ThemeCustomizer theme={theme} onThemeChange={onThemeChange} />
      <ColorPicker
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
      />
      
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
    </div>
  );
}
