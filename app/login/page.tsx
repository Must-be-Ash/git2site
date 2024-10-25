"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold mb-8">Login to Git2Site</h1>
      <Button asChild>
        <Link href="/api/auth/github">Login with GitHub</Link>
      </Button>
    </div>
  );
}
