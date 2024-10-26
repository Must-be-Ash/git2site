/* Base styles */
:root {
  --font-sans: 'Inter', sans-serif;
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

/* 80s theme */
.theme-80s {
  --font-sans: 'VT323', monospace;
  --background: linear-gradient(to bottom, #ff00ff, #00ffff);
  --foreground: #ffffff;
  --card: rgba(0, 0, 0, 0.7);
  --card-foreground: #00ffff;
  --nav: #000000;
  --nav-foreground: #ff00ff;
  --button: #ff00ff;
  --button-foreground: #000000;
  --tag: #00ffff;
  --tag-foreground: #000000;
}

.theme-80s .theme-card {
  border: 2px solid #ff00ff;
  box-shadow: 0 0 10px #00ffff;
}

.theme-80s .theme-image {
  filter: hue-rotate(180deg) saturate(200%);
}

.theme-80s .theme-button {
  background: var(--button);
  color: var(--button-foreground);
  border: 2px solid #00ffff;
}

.theme-80s .theme-tag {
  background: var(--tag);
  color: var(--tag-foreground);
}

/* Arcade theme */
.theme-arcade {
  --font-sans: 'Press Start 2P', cursive;
  --background: #000000;
  --foreground: #33ff33;
  --card: #111111;
  --card-foreground: #33ff33;
  --nav: #33ff33;
  --nav-foreground: #000000;
  --button: #ff3333;
  --button-foreground: #ffffff;
  --tag: #3333ff;
  --tag-foreground: #ffffff;
}

.theme-arcade .theme-card {
  border: 2px solid #33ff33;
  box-shadow: 0 0 10px #33ff33;
}

.theme-arcade .theme-image {
  image-rendering: pixelated;
}

.theme-arcade .theme-button {
  background: var(--button);
  color: var(--button-foreground);
  border: 2px solid #ffffff;
}

.theme-arcade .theme-tag {
  background: var(--tag);
  color: var(--tag-foreground);
}

/* Vintage theme */
.theme-vintage {
  --font-sans: 'Courier New', monospace;
  --background: #f4e9d8;
  --foreground: #3a3a3a;
  --card: #ffffff;
  --card-foreground: #3a3a3a;
  --nav: #3a3a3a;
  --nav-foreground: #f4e9d8;
  --button: #8b4513;
  --button-foreground: #f4e9d8;
  --tag: #d2b48c;
  --tag-foreground: #3a3a3a;
}

.theme-vintage .theme-card {
  border: 1px solid #8b4513;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

.theme-vintage .theme-image {
  filter: sepia(100%) contrast(150%);
}

.theme-vintage .theme-button {
  background: var(--button);
  color: var(--button-foreground);
}

.theme-vintage .theme-tag {
  background: var(--tag);
  color: var(--tag-foreground);
}

/* Windows 98 theme */
.theme-windows98 {
  --font-sans: 'MS Sans Serif', sans-serif;
  --background: #008080;
  --foreground: #ffffff;
  --card: #c0c0c0;
  --card-foreground: #000000;
  --nav: #000080;
  --nav-foreground: #ffffff;
  --button: #c0c0c0;
  --button-foreground: #000000;
  --tag: #ffffff;
  --tag-foreground: #000000;
}

.theme-windows98 .theme-card {
  border: 2px solid #ffffff;
  box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf, inset -2px -2px grey, inset 2px 2px #fff;
}

.theme-windows98 .theme-button {
  background: var(--button);
  color: var(--button-foreground);
  border: 2px outset #ffffff;
}

.theme-windows98 .theme-tag {
  background: var(--tag);
  color: var(--tag-foreground);
  border: 1px solid #000000;
}

/* Sin City theme */
.theme-sin-city {
  --font-sans: 'Oswald', sans-serif;
  --background: #000000;
  --foreground: #ffffff;
  --card: #1a1a1a;
  --card-foreground: #ffffff;
  --nav: #1a1a1a;
  --nav-foreground: #ffffff;
  --button: #ff4500;
  --button-foreground: #000000;
  --tag: #00ff00;
  --tag-foreground: #000000;
}

.theme-sin-city .theme-card {
  border: 1px solid #ffffff;
}

.theme-sin-city .theme-image {
  filter: grayscale(100%) contrast(150%);
}

.theme-sin-city .theme-button {
  background: var(--button);
  color: var(--button-foreground);
}

.theme-sin-city .theme-tag {
  background: var(--tag);
  color: var(--tag-foreground);
}

/* Modern theme */
.theme-modern {
  --font-sans: 'Inter', sans-serif;
  --background: #ffffff;
  --foreground: #000000;
  --card: #f8f8f8;
  --card-foreground: #000000;
  --nav: #000000;
  --nav-foreground: #ffffff;
  --button: #ff6600;
  --button-foreground: #ffffff;
  --tag: #e0e0e0;
  --tag-foreground: #000000;
}

.theme-modern .theme-card {
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.theme-modern .theme-button {
  background: var(--button);
  color: var(--button-foreground);
  border-radius: 20px;
}

.theme-modern .theme-tag {
  background: var(--tag);
  color: var(--tag-foreground);
  border-radius: 20px;
}

/* Global styles */
body {
  font-family: var(--font-sans);
  background: var(--background);
  color: var(--foreground);
  transition: all 0.3s ease;
}

.theme-card {
  background: var(--card);
  color: var(--card-foreground);
  transition: all 0.3s ease;
}

.theme-title {
  color: var(--card-foreground);
}

.theme-description {
  color: var(--card-foreground);
}

.theme-button {
  transition: all 0.3s ease;
}

.theme-tag {
  transition: all 0.3s ease;
}

nav {
  background: var(--nav);
  color: var(--nav-foreground);
}