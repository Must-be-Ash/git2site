import Link from 'next/link';
import { Home, Settings, RefreshCw } from 'lucide-react';

export function Sidebar() {
  return (
    <div className="w-64 bg-card text-card-foreground p-4">
      <nav className="space-y-2">
        <Link href="/dashboard" className="flex items-center space-x-2 p-2 rounded hover:bg-primary/10">
          <Home size={20} />
          <span>Home</span>
        </Link>
        <Link href="/dashboard/settings" className="flex items-center space-x-2 p-2 rounded hover:bg-primary/10">
          <Settings size={20} />
          <span>Settings</span>
        </Link>
        <Link href="/dashboard/refresh" className="flex items-center space-x-2 p-2 rounded hover:bg-primary/10">
          <RefreshCw size={20} />
          <span>Refresh Portfolio</span>
        </Link>
      </nav>
    </div>
  );
}
