# Git2Site Package Requirements

## Core Packages
Have you installed and configured these essential packages?

### API & Data Management
- [ ] `@octokit/rest` (^20.0.0)
  - Purpose: GitHub API client
  - Used for: Fetching repository data, user data, and metadata
  - Example:
  ```typescript
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const repos = await octokit.rest.repos.listForUser({ username });
  ```

- [ ] `axios` (^1.6.0)
  - Purpose: HTTP client for additional API calls
  - Used for: Fetching repository preview images and external resources
  - Example:
  ```typescript
  const response = await axios.get(`https://api.github.com/repos/${username}/${repo}`);
  ```

### Image Processing
- [ ] `sharp` (^0.32.0)
  - Purpose: High-performance image processing
  - Used for: Optimizing and resizing repository preview images
  - Example:
  ```typescript
  await sharp(buffer)
    .resize(1200, 630)
    .jpeg({ quality: 80 })
    .toFile(outputPath);
  ```

- [ ] `html-to-image` (^1.11.0)
  - Purpose: Converting HTML to images
  - Used for: Generating preview cards for repositories
  - Example:
  ```typescript
  const dataUrl = await htmlToImage.toPng(element);
  ```

### State Management
- [ ] `zustand` (^4.4.0)
  - Purpose: Simple state management
  - Used for: Managing theme state, customization options, and portfolio data
  - Example:
  ```typescript
  const useStore = create((set) => ({
    theme: 'default',
    setTheme: (theme) => set({ theme }),
    repositories: [],
    setRepositories: (repos) => set({ repositories: repos })
  }));
  ```

### UI Components & Styling
- [ ] `@shadcn/ui` (latest)
  - Purpose: Pre-built UI components
  - Used for: Buttons, cards, dialogs, and other UI elements
  - Example:
  ```typescript
  import { Button } from "@/components/ui/button";
  ```

- [ ] `tailwindcss` (^3.3.0)
  - Purpose: Utility-first CSS framework
  - Used for: Styling and responsive design
  
- [ ] `clsx` (^2.0.0) and `tailwind-merge` (^2.0.0)
  - Purpose: Class name management
  - Used for: Conditional styling and merging Tailwind classes
  - Example:
  ```typescript
  const className = cn(
    "base-styles",
    selected && "selected-styles"
  );
  ```

## Implementation Verification Questions

1. Image Processing Setup
   - [ ] Is Sharp properly configured for image optimization?
   - [ ] Are preview images being generated in correct dimensions?
   - [ ] Is the image processing pipeline handling errors gracefully?

2. GitHub Integration
   - [ ] Is Octokit configured with proper authentication?
   - [ ] Are API rate limits being handled?
   - [ ] Is repository data being cached appropriately?

3. State Management
   - [ ] Is Zustand store properly structured?
   - [ ] Are state updates performing efficiently?
   - [ ] Is state persistence working for user preferences?

4. HTTP Requests
   - [ ] Is Axios configured with proper interceptors?
   - [ ] Are API errors handled consistently?
   - [ ] Is request caching implemented where needed?

5. UI Components
   - [ ] Are all necessary shadcn/ui components imported?
   - [ ] Is Tailwind configured with proper customizations?
   - [ ] Are component styles consistent across themes?

## Package Installation Command
```bash
npm install @octokit/rest axios sharp html-to-image zustand @shadcn/ui tailwindcss clsx tailwind-merge
```

## Common Integration Issues & Solutions

1. Sharp Installation Issues
```bash
# On Linux, you might need
sudo apt-get install libvips-dev

# On macOS
brew install vips
```

2. Octokit Rate Limiting
```typescript
// Implement rate limit handling
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  throttle: {
    onRateLimit: (retryAfter, options) => {
      return true; // Retry once
    },
    onSecondaryRateLimit: (retryAfter, options) => {
      return true; // Retry once
    }
  }
});
```

3. Zustand Persistence
```typescript
// Add persistence to Zustand store
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      // store definition
    }),
    {
      name: 'git2site-storage'
    }
  )
);
```

4. Image Processing Pipeline
```typescript
// Error handling in image processing
const processImage = async (buffer) => {
  try {
    return await sharp(buffer)
      .resize(1200, 630, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255 }
      })
      .jpeg({ quality: 80 })
      .toBuffer();
  } catch (error) {
    console.error('Image processing failed:', error);
    return getDefaultImage(); // Fallback
  }
};
```

Please ensure all packages are properly installed and configured before proceeding with feature implementation. Each package plays a crucial role in the application's functionality.