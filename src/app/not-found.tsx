"use client";

import * as React from "react";
import Link from "next/link";
import { FileQuestion, Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center">
        {/* Animated 404 Icon */}
        <div className="relative mx-auto w-32 h-32 mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full animate-pulse" />
          <div className="absolute inset-2 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <FileQuestion className="h-16 w-16 text-cyan-400" />
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
          404
        </h1>

        {/* Message */}
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          Page not found
        </h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
          Check the URL or navigate back to safety.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            className="gap-2 border-white/10 hover:bg-white/5"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button asChild className="gap-2 bg-cyan-600 hover:bg-cyan-700">
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Search Suggestion */}
        <div className="mt-12 p-4 rounded-lg border border-white/5 bg-white/[0.02]">
          <p className="text-sm text-muted-foreground mb-3">
            Looking for something specific?
          </p>
          <Button
            variant="ghost"
            className="gap-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
            onClick={() => {
              // Trigger command palette (Ctrl+K)
              const event = new KeyboardEvent("keydown", {
                key: "k",
                ctrlKey: true,
                bubbles: true,
              });
              document.dispatchEvent(event);
            }}
          >
            <Search className="h-4 w-4" />
            Search documents
            <kbd className="ml-2 px-1.5 py-0.5 text-[10px] font-mono bg-white/10 rounded border border-white/10">
              Ctrl+K
            </kbd>
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="fixed top-20 left-20 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
}
