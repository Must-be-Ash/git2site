import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Repository {
  id: string;
  name: string;
  description?: string;
  url: string;
  homepage?: string;
  language?: string;
  stars: number;
  topics: string[];
  isFeatured: boolean;
  order: number;
}

interface PortfolioState {
  repositories: Repository[];
  selectedTheme: string;
  layout: 'grid' | 'list';
  settings: {
    showReadme: boolean;
    showTechStack: boolean;
    showLivePreview: boolean;
  };
  setRepositories: (repositories: Repository[]) => void;
  setTheme: (theme: string) => void;
  setLayout: (layout: 'grid' | 'list') => void;
  updateSettings: (settings: Partial<PortfolioState['settings']>) => void;
  toggleFeatureProject: (repoId: string) => void;
  reorderRepositories: (startIndex: number, endIndex: number) => void;
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      repositories: [],
      selectedTheme: 'minimal',
      layout: 'grid',
      settings: {
        showReadme: true,
        showTechStack: true,
        showLivePreview: true,
      },
      setRepositories: (repositories) => set({ repositories }),
      setTheme: (theme) => set({ selectedTheme: theme }),
      setLayout: (layout) => set({ layout }),
      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),
      toggleFeatureProject: (repoId) =>
        set((state) => ({
          repositories: state.repositories.map((repo) =>
            repo.id === repoId
              ? { ...repo, isFeatured: !repo.isFeatured }
              : repo
          ),
        })),
      reorderRepositories: (startIndex, endIndex) =>
        set((state) => {
          const result = Array.from(state.repositories);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { repositories: result };
        }),
    }),
    {
      name: 'git2site-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);