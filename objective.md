# Git2Site: GitHub Portfolio Generator

## Product Description
Git2Site transforms GitHub repositories into beautifully designed portfolio websites with minimal user effort. Users can instantly generate a portfolio by simply pasting their GitHub URL, or optionally connect their GitHub account to include private repositories. The system automatically generates a visually appealing, non-technical showcase of their work.

## User Flow

1. **Portfolio Generation** (Two Options)
   - Quick Generate:
     * Paste GitHub username or profile URL
     * System instantly generates portfolio
   - GitHub Connect (Optional):
     * Connect GitHub account via OAuth
     * Access to private repositories
     * Automatic updates when repositories change

2. **Repository Management**
   - View automatically imported repositories
   - Select repositories to showcase/hide
   - Reorder repositories
   - Mark featured projects

3. **Customization**
   - Select from predefined themes
   - Customize colors and layout
   - Toggle features (README display, tech stack, etc.)

4. **Preview & Share**
   - Preview generated portfolio
   - Get unique sharing URL (e.g., git2site.com/username)
   - Share portfolio

## Core Features

### 1. Instant Portfolio Generation
- No account required for basic use
- Paste GitHub URL to generate
- Optional GitHub OAuth for enhanced features
- Automatic repository import

### 2. Repository Showcase
- Public repository display
- Private repository access (with GitHub OAuth)
- Repository metadata extraction
- Live preview generation for deployed projects
- Technology stack detection

### 3. Portfolio Features
- Customizable themes and layouts
- Repository preview cards
- Project descriptions
- README parsing and display
- Tech stack visualization
- Live project previews

### 4. Customization
- Multiple theme options
- Color scheme customization
- Layout options (grid/list view)
- Repository ordering
- Featured projects highlighting

### 5. Sharing & Preview
- Unique URL per portfolio
- Repository thumbnail previews
- Social media preview cards
- SEO-optimized pages

## Technical Requirements

### Frontend
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS + Shadcn/ui components
- Responsive design

### Backend
- GitHub OAuth (optional connection)
- GitHub API integration
- MongoDB for storing portfolio preferences
- Image processing for previews
- Webhook support for repository updates (OAuth users)

## MVP Success Criteria
- Users can generate portfolio by pasting GitHub URL
- Optional GitHub OAuth connection works
- Repositories are successfully imported and displayed
- Theme customization functions
- Preview generation works for repositories
- Unique URL generation works
- Portfolio is visually appealing and responsive

## Key Differentiators
- No account required for basic use
- Instant portfolio generation
- Automatic preview generation
- Focus on making technical projects accessible to non-technical audiences
- Optional GitHub OAuth for enhanced features

## Here is my current project structure:
```
├── app
│   ├── [username]
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api
│   │   ├── auth
│   │   │   └── github
│   │   ├── portfolio
│   │   │   └── generate
│   │   ├── repositories
│   │   │   └── [username]
│   │   └── user
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── login
│   │   └── page.tsx
│   └── page.tsx
├── checklist.md
├── components
│   ├── features.tsx
│   ├── github-form.tsx
│   ├── header.tsx
│   ├── portfolio
│   │   ├── header.tsx
│   │   └── repository-grid.tsx
│   ├── providers
│   │   └── theme-provider.tsx
│   ├── quick-generate.tsx
│   ├── theme-provider.tsx
│   ├── theme-toggle.tsx
│   └── ui
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── aspect-ratio.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── command.tsx
│       ├── context-menu.tsx
│       ├── dialog.tsx
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── hover-card.tsx
│       ├── input-otp.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── menubar.tsx
│       ├── navigation-menu.tsx
│       ├── pagination.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── resizable.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── sonner.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toast.tsx
│       ├── toaster.tsx
│       ├── toggle-group.tsx
│       ├── toggle.tsx
│       ├── tooltip.tsx
│       └── use-toast.ts
├── components.json
├── hooks
│   └── use-toast.ts
├── lib
│   ├── api.ts
│   ├── db.ts
│   ├── github.ts
│   ├── hooks
│   │   ├── useRepositories.ts
│   │   └── useUser.ts
│   ├── image.ts
│   ├── models
│   │   ├── repository.ts
│   │   └── user.ts
│   ├── store
│   │   ├── usePortfolioStore.ts
│   │   └── useThemeStore.ts
│   ├── themes.ts
│   └── utils.ts
├── next-env.d.ts
├── next.config.js
├── objective.md
├── package-lock.json
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```
