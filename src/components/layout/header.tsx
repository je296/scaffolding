"use client";

import * as React from "react";
import {
  Search,
  Bell,
  Grid3X3,
  List,
  Table2,
  Moon,
  Sun,
  Command,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "@/components/providers/theme-provider";
import { useDocumentStore } from "@/stores";
import { cn } from "@/lib/utils";

export function Header() {
  const { setTheme, resolvedTheme } = useTheme();
  const { viewMode, setViewMode } = useDocumentStore();
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center border-b border-white/5 bg-background/80 backdrop-blur-xl px-4">
      {/* Left Section */}
      <div className="flex items-center">
        <SidebarTrigger className="-ml-1" />
      </div>

      {/* Center Section - Search Bar */}
      <div className="flex-1 flex justify-center px-4">
        <div className="w-full max-w-xl">
          <div
            className={cn(
              "relative flex items-center rounded-lg border border-white/10 bg-white/5 transition-all duration-200",
              searchFocused && "border-cyan-500/50 bg-white/10 ring-2 ring-cyan-500/20"
            )}
          >
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents, folders..."
              className="border-0 bg-transparent pl-10 pr-20 h-9 focus-visible:ring-0 placeholder:text-muted-foreground/60"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <div className="absolute right-2 flex items-center gap-1.5">
              <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
                <Command className="h-3 w-3" />K
              </kbd>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2">
        <TooltipProvider>
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-7 w-7 rounded-md",
                    viewMode === "grid" && "bg-white/10 text-cyan-400"
                  )}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Grid view</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-7 w-7 rounded-md",
                    viewMode === "list" && "bg-white/10 text-cyan-400"
                  )}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>List view</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-7 w-7 rounded-md",
                    viewMode === "table" && "bg-white/10 text-cyan-400"
                  )}
                  onClick={() => setViewMode("table")}
                >
                  <Table2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Table view</TooltipContent>
            </Tooltip>
          </div>

          {/* Filter Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Filters</TooltipContent>
          </Tooltip>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground hover:text-foreground">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full bg-cyan-500 p-0 text-[10px] flex items-center justify-center">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <span className="font-medium">Notifications</span>
                <Button variant="ghost" size="sm" className="text-xs text-cyan-400 hover:text-cyan-300">
                  Mark all read
                </Button>
              </div>
              <div className="py-2">
                <DropdownMenuItem className="flex flex-col items-start gap-1 px-4 py-3">
                  <span className="text-sm">Document approved</span>
                  <span className="text-xs text-muted-foreground">Q4 Report was approved by Sarah</span>
                  <span className="text-[10px] text-muted-foreground/60">2 minutes ago</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 px-4 py-3">
                  <span className="text-sm">New comment</span>
                  <span className="text-xs text-muted-foreground">Mike commented on Proposal Draft</span>
                  <span className="text-[10px] text-muted-foreground/60">1 hour ago</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 px-4 py-3">
                  <span className="text-sm">Document shared</span>
                  <span className="text-xs text-muted-foreground">Contract v2 was shared with you</span>
                  <span className="text-[10px] text-muted-foreground/60">3 hours ago</span>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-cyan-400 hover:text-cyan-300">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-foreground"
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              >
                {mounted ? (
                  resolvedTheme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle theme</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
}
