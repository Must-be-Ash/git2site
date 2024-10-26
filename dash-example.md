'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Github, Globe, Save, Linkedin, Twitter, Mail } from 'lucide-react'

// Mock data for demonstration purposes
const mockProjects = [
  {
    id: 1,
    name: 'Project Alpha',
    description: 'A revolutionary web application that transforms the way users interact with data visualization tools, providing intuitive interfaces and real-time updates.',
    languages: ['JavaScript', 'React', 'Node.js'],
    githubUrl: 'https://github.com/yourusername/project-alpha',
    websiteUrl: 'https://project-alpha.com',
    thumbnailUrl: '/placeholder.svg?height=200&width=300',
  },
  {
    id: 2,
    name: 'Project Beta',
    description: 'An innovative mobile app designed to streamline daily tasks and boost productivity through AI-powered suggestions and seamless integration with popular services.',
    languages: ['Swift', 'Kotlin'],
    githubUrl: 'https://github.com/yourusername/project-beta',
    websiteUrl: 'https://project-beta.com',
    thumbnailUrl: '/placeholder.svg?height=200&width=300',
  },
]

const presetThemes = {
  default: {
    name: 'Default',
    buttonStyle: 'default',
    accentColor: '#3b82f6',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    fontFamily: 'Inter, sans-serif',
    cardStyle: 'default',
    cardColor: '#ffffff',
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
  },
}

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
}

export default function Component() {
  const [projects, setProjects] = useState(mockProjects)
  const [currentTheme, setCurrentTheme] = useState(presetThemes.default)
  const [customTheme, setCustomTheme] = useState(presetThemes.default)
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [twitterUrl, setTwitterUrl] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [personalDomain, setPersonalDomain] = useState('')

  const applyTheme = (theme) => {
    setCustomTheme(theme)
    document.documentElement.style.setProperty('--accent-color', theme.accentColor)
    document.documentElement.style.setProperty('--background-color', theme.backgroundColor)
    document.documentElement.style.setProperty('--text-color', theme.textColor)
    document.documentElement.style.setProperty('--font-family', theme.fontFamily)
    document.documentElement.style.setProperty('--card-color', theme.cardColor)
  }

  useEffect(() => {
    applyTheme(currentTheme)
  }, [currentTheme])

  const handleThemeChange = (themeName) => {
    setCurrentTheme(presetThemes[themeName])
  }

  const handleCustomThemeChange = (property, value) => {
    const updatedTheme = { ...customTheme, [property]: value }
    setCustomTheme(updatedTheme)
    applyTheme(updatedTheme)
  }

  const handleSave = () => {
    // In a real application, you would save the customTheme to a backend or local storage here
    console.log('Saving theme:', customTheme)
    console.log('Saving social links:', { linkedinUrl, twitterUrl, emailAddress, personalDomain })
    alert('Theme and social links saved successfully!')
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
              <SelectContent>
                {Object.keys(presetThemes).map((theme) => (
                  <SelectItem key={theme} value={theme}>
                    {presetThemes[theme].name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="ghost">Ghost</SelectItem>
              </SelectContent>
            </Select>
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
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="bordered">Bordered</SelectItem>
                <SelectItem value="elevated">Elevated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="accent-color">Accent Color</Label>
            <Input
              id="accent-color"
              type="color"
              value={customTheme.accentColor}
              onChange={(e) => handleCustomThemeChange('accentColor', e.target.value)}
            />
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
            <Label htmlFor="card-color">Card Color</Label>
            <Input
              id="card-color"
              type="color"
              value={customTheme.cardColor}
              onChange={(e) => handleCustomThemeChange('cardColor', e.target.value)}
            />
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
              <SelectContent>
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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-muted p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Portfolio Builder</h1>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Theme
          </Button>
        </header>

        {/* Preview */}
        <div className="flex-1 overflow-auto p-8" style={{
          backgroundColor: customTheme.backgroundColor,
          color: customTheme.textColor,
          fontFamily: customTheme.fontFamily,
        }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {projects.map(project => (
              <Card key={project.id} className="overflow-hidden flex flex-col" style={{
                backgroundColor: customTheme.cardColor,
                color: customTheme.textColor,
                borderColor: customTheme.accentColor,
                ...cardStyles[customTheme.cardStyle],
              }}>
                <CardHeader className="p-0">
                  <Image
                    src={project.thumbnailUrl}
                    alt={`${project.name} thumbnail`}
                    width={600}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                </CardHeader>
                <CardContent className="p-6 flex-grow">
                  <h2 className="text-2xl font-bold mb-2">{project.name}</h2>
                  <p className="mb-4" style={{ color: customTheme.textColor }}>{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.languages.map(lang => (
                      <span key={lang} className="text-xs px-2 py-1 rounded" style={{
                        backgroundColor: customTheme.accentColor,
                        color: customTheme.cardColor,
                      }}>
                        {lang}
                      </span>
                    ))}
                  </div>
                
                </CardContent>
                <CardFooter className="p-6 pt-0 flex justify-end gap-2">
                  <Button variant={customTheme.buttonStyle} size="icon" asChild style={{
                    backgroundColor: customTheme.buttonStyle === 'default' ? customTheme.accentColor : 'transparent',
                    color: customTheme.buttonStyle === 'default' ? customTheme.cardColor : customTheme.accentColor,
                    borderColor: customTheme.accentColor,
                  }}>
                    <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="View GitHub repository">
                      <Github className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button variant={customTheme.buttonStyle} size="icon" asChild style={{
                    backgroundColor: customTheme.buttonStyle === 'default' ? customTheme.accentColor : 'transparent',
                    color: customTheme.buttonStyle === 'default' ? customTheme.cardColor : customTheme.accentColor,
                    borderColor: customTheme.accentColor,
                  }}>
                    <Link href={project.websiteUrl} target="_blank" rel="noopener noreferrer" aria-label="Visit project website">
                      <Globe className="w-5 h-5" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          {/* Social Links and Personal Domain */}
          <div className="mt-8 flex justify-center gap-4">
            {linkedinUrl && (
              <Button variant={customTheme.buttonStyle} size="icon" asChild style={{
                backgroundColor: customTheme.buttonStyle === 'default' ? customTheme.accentColor : 'transparent',
                color: customTheme.buttonStyle === 'default' ? customTheme.backgroundColor : customTheme.accentColor,
                borderColor: customTheme.accentColor,
              }}>
                <Link href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
                  <Linkedin className="w-5 h-5" />
                </Link>
              </Button>
            )}
            {twitterUrl && (
              <Button variant={customTheme.buttonStyle} size="icon" asChild style={{
                backgroundColor: customTheme.buttonStyle === 'default' ? customTheme.accentColor : 'transparent',
                color: customTheme.buttonStyle === 'default' ? customTheme.backgroundColor : customTheme.accentColor,
                borderColor: customTheme.accentColor,
              }}>
                <Link href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter Profile">
                  <Twitter className="w-5 h-5" />
                </Link>
              </Button>
            )}
            {emailAddress && (
              <Button variant={customTheme.buttonStyle} size="icon" asChild style={{
                backgroundColor: customTheme.buttonStyle === 'default' ? customTheme.accentColor : 'transparent',
                color: customTheme.buttonStyle === 'default' ? customTheme.backgroundColor : customTheme.accentColor,
                borderColor: customTheme.accentColor,
              }}>
                <Link href={`mailto:${emailAddress}`} aria-label="Email">
                  <Mail className="w-5 h-5" />
                </Link>
              </Button>
            )}
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
  )
}