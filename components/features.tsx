import { Code2, Palette, Share2, Zap } from 'lucide-react';

const features = [
  {
    name: 'Instant Generation',
    description: 'Just paste your GitHub URL and get a beautiful portfolio in seconds.',
    icon: Zap,
  },
  {
    name: 'Beautiful Themes',
    description: 'Choose from multiple professionally designed themes.',
    icon: Palette,
  },
  {
    name: 'Project Showcase',
    description: 'Automatically imports and displays your best projects.',
    icon: Code2,
  },
  {
    name: 'Easy Sharing',
    description: 'Get a unique URL to share your portfolio with the world.',
    icon: Share2,
  },
];

export function Features() {
  return (
    <div className="py-24">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.name}
            className="relative p-6 rounded-2xl border bg-card text-card-foreground"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <feature.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mt-4 font-semibold">{feature.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}