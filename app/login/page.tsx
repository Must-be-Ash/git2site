"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    // GitHub OAuth login logic will be implemented here
    window.location.href = `/api/auth/github`;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            Sign in to Git2Site
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Connect with GitHub to get started
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <Button
            className="w-full"
            onClick={handleGitHubLogin}
            disabled={isLoading}
          >
            <Github className="mr-2 h-4 w-4" />
            {isLoading ? "Connecting..." : "Continue with GitHub"}
          </Button>

          <div className="text-sm text-center">
            <Link
              href="/terms"
              className="font-medium text-primary hover:text-primary/80"
            >
              Terms of Service
            </Link>
            {" · "}
            <Link
              href="/privacy"
              className="font-medium text-primary hover:text-primary/80"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}