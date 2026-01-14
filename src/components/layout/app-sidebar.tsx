"use client";

import * as React from "react";
import {
  FileText,
  Folder,
  FolderOpen,
  Home,
  Search,
  Settings,
  Star,
  Trash2,
  Clock,
  Share2,
  ChevronRight,
  Plus,
  Upload,
  Archive,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { title: "Home", icon: Home, href: "/" },
  { title: "Documents", icon: Archive, href: "/documents" },
  { title: "Recent", icon: Clock, href: "/recent" },
  { title: "Starred", icon: Star, href: "/starred" },
  { title: "Shared with me", icon: Share2, href: "/shared" },
];

const systemNavItems = [
  { title: "Search", icon: Search, href: "/search" },
  { title: "Trash", icon: Trash2, href: "/trash" },
  { title: "Settings", icon: Settings, href: "/settings" },
];

// Mock folder structure
const folders = [
  {
    id: "1",
    name: "Projects",
    children: [
      { id: "1-1", name: "Q4 Reports", children: [] },
      { id: "1-2", name: "Client Proposals", children: [] },
      { id: "1-3", name: "Marketing Assets", children: [] },
    ],
  },
  {
    id: "2",
    name: "Legal Documents",
    children: [
      { id: "2-1", name: "Contracts", children: [] },
      { id: "2-2", name: "Compliance", children: [] },
    ],
  },
  {
    id: "3",
    name: "HR Documents",
    children: [],
  },
  {
    id: "4",
    name: "Financial Records",
    children: [
      { id: "4-1", name: "2024", children: [] },
      { id: "4-2", name: "2025", children: [] },
    ],
  },
];

interface FolderItemProps {
  folder: { id: string; name: string; children: { id: string; name: string; children: unknown[] }[] };
  level?: number;
}

const FolderItem = React.memo(function FolderItem({ folder, level = 0 }: FolderItemProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const hasChildren = folder.children && folder.children.length > 0;

  if (!hasChildren) {
    return (
      <SidebarMenuSubItem>
        <SidebarMenuSubButton className="pl-4">
          <Folder className="h-4 w-4 text-amber-500/80" />
          <span className="truncate">{folder.name}</span>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <SidebarMenuSubItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuSubButton className="pl-4">
            <ChevronRight
              className={cn(
                "h-3 w-3 shrink-0 transition-transform duration-200",
                isOpen && "rotate-90"
              )}
            />
            {isOpen ? (
              <FolderOpen className="h-4 w-4 text-amber-500" />
            ) : (
              <Folder className="h-4 w-4 text-amber-500/80" />
            )}
            <span className="truncate">{folder.name}</span>
          </SidebarMenuSubButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {folder.children.map((child) => (
              <FolderItem key={child.id} folder={child as FolderItemProps["folder"]} level={level + 1} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuSubItem>
    </Collapsible>
  );
});

// Folder tree with collapsibles - rendered only on client to avoid hydration mismatch
const FolderTree = React.memo(function FolderTree() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Show skeleton during SSR/initial render
    return (
      <SidebarMenu>
        {folders.map((folder) => (
          <SidebarMenuItem key={folder.id}>
            <SidebarMenuSkeleton showIcon />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      {folders.map((folder) => (
        <SidebarMenuItem key={folder.id}>
          <Collapsible>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton className="w-full">
                <ChevronRight className="h-3 w-3 shrink-0 transition-transform duration-200 [[data-state=open]>&]:rotate-90" />
                <Folder className="h-4 w-4 text-amber-500/80" />
                <span className="truncate">{folder.name}</span>
              </SidebarMenuButton>
            </CollapsibleTrigger>
            {folder.children.length > 0 && (
              <CollapsibleContent>
                <SidebarMenuSub>
                  {folder.children.map((child) => (
                    <FolderItem key={child.id} folder={child as FolderItemProps["folder"]} />
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            )}
          </Collapsible>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
});

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-white/5">
      <SidebarHeader className="border-b border-white/5 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold tracking-tight text-foreground">Documentum</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Document Manager
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <div className="px-3 py-3">
          <Button className="w-full justify-start gap-2 bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-600/20">
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.href} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between px-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Folders
            </span>
            <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-foreground">
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[280px]">
              <FolderTree />
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {systemNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.href} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/5 p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">John Doe</span>
            <span className="text-xs text-muted-foreground">Administrator</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
