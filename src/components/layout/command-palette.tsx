"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Folder,
  Search,
  Settings,
  Star,
  Trash2,
  Upload,
  Home,
  Clock,
  Share2,
  Plus,
  Moon,
  Sun,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useTheme } from "@/components/providers/theme-provider";

const navigationItems = [
  { title: "Home", icon: Home, href: "/", shortcut: "⌘H" },
  { title: "Recent", icon: Clock, href: "/recent" },
  { title: "Starred", icon: Star, href: "/starred" },
  { title: "Shared with me", icon: Share2, href: "/shared" },
  { title: "Trash", icon: Trash2, href: "/trash" },
  { title: "Settings", icon: Settings, href: "/settings", shortcut: "⌘," },
];

const actionItems = [
  { title: "Upload Document", icon: Upload, action: "upload" },
  { title: "Create New Folder", icon: Folder, action: "new-folder" },
  { title: "Create New Document", icon: Plus, action: "new-document" },
  { title: "Search Documents", icon: Search, action: "search" },
];

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (callback: () => void) => {
    setOpen(false);
    callback();
  };

  // Don't render on server to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search documents, folders, or type a command..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => (
            <CommandItem
              key={item.title}
              onSelect={() => handleSelect(() => router.push(item.href))}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.title}</span>
              {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          {actionItems.map((item) => (
            <CommandItem
              key={item.title}
              onSelect={() => handleSelect(() => console.log(item.action))}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Theme">
          <CommandItem
            onSelect={() =>
              handleSelect(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"))
            }
          >
            {resolvedTheme === "dark" ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            <span>Toggle theme</span>
            <CommandShortcut>⌘T</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
