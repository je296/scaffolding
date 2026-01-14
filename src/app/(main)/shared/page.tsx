"use client";

import { useMemo, useSyncExternalStore } from "react";
import { Users, ArrowUpDown, Filter, Eye, Edit, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSharedStore, type SharedSortBy, type PermissionFilter } from "@/stores";
import { useShallow } from "zustand/react/shallow";
import { mockSharedDocuments, SharedDocument } from "@/lib/mock-shared";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  FileText,
  FileSpreadsheet,
  Presentation,
  Image,
  FileArchive,
  File,
} from "lucide-react";

const typeIcons: Record<string, React.ElementType> = {
  document: FileText,
  spreadsheet: FileSpreadsheet,
  presentation: Presentation,
  pdf: FileText,
  image: Image,
  archive: FileArchive,
  other: File,
};

const permissionIcons: Record<string, React.ElementType> = {
  view: Eye,
  edit: Edit,
  comment: MessageSquare,
};

const permissionColors: Record<string, string> = {
  view: "text-blue-500 bg-blue-500/10",
  edit: "text-green-500 bg-green-500/10",
  comment: "text-amber-500 bg-amber-500/10",
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function SharedDocumentCard({ doc }: { doc: SharedDocument }) {
  const IconComponent = typeIcons[doc.type] || File;
  const PermissionIcon = permissionIcons[doc.sharePermission];

  return (
    <Card className="group p-4 hover:bg-accent/50 transition-colors cursor-pointer border-border/50">
      <div className="flex items-start gap-4">
        {/* Document Icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted shrink-0">
          <IconComponent className="w-6 h-6 text-muted-foreground" />
        </div>

        {/* Document Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                {doc.name}
              </h3>
              <p className="text-sm text-muted-foreground truncate">{doc.path}</p>
            </div>
            {doc.isStarred && (
              <Badge variant="secondary" className="shrink-0 bg-amber-500/10 text-amber-500 border-0">
                Starred
              </Badge>
            )}
          </div>

          {/* Shared By & Permission */}
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                  {getInitials(doc.sharedBy.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {doc.sharedBy.name}
              </span>
            </div>
            <span className="text-muted-foreground/50">•</span>
            <span className="text-sm text-muted-foreground">
              Shared {formatDate(doc.sharedAt)}
            </span>
            <span className="text-muted-foreground/50">•</span>
            <span className="text-sm text-muted-foreground">
              {formatFileSize(doc.size)}
            </span>
          </div>

          {/* Permission Badge */}
          <div className="flex items-center gap-2 mt-3">
            <div
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium",
                permissionColors[doc.sharePermission]
              )}
            >
              <PermissionIcon className="w-3.5 h-3.5" />
              {doc.sharePermission === "view" && "Can view"}
              {doc.sharePermission === "edit" && "Can edit"}
              {doc.sharePermission === "comment" && "Can comment"}
            </div>
            {doc.expiresAt && (
              <Badge variant="outline" className="text-xs">
                Expires {formatDate(doc.expiresAt)}
              </Badge>
            )}
            {doc.isLocked && (
              <Badge variant="outline" className="text-xs text-red-500 border-red-500/30">
                Locked
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

const emptySubscribe = () => () => {};

export default function SharedWithMePage() {
  // Use shallow comparison for store access
  const {
    sortBy,
    permissionFilter,
    sharedByFilters,
    setSortBy,
    setPermissionFilter,
    addSharedByFilter,
    removeSharedByFilter,
    clearFilters,
  } = useSharedStore(
    useShallow((state) => ({
      sortBy: state.sortBy,
      permissionFilter: state.permissionFilter,
      sharedByFilters: state.sharedByFilters,
      setSortBy: state.setSortBy,
      setPermissionFilter: state.setPermissionFilter,
      addSharedByFilter: state.addSharedByFilter,
      removeSharedByFilter: state.removeSharedByFilter,
      clearFilters: state.clearFilters,
    }))
  );

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const sharers = useMemo(() => {
    const uniqueSharers = new Map<string, { id: string; name: string }>();
    mockSharedDocuments.forEach((doc) => {
      uniqueSharers.set(doc.sharedBy.id, {
        id: doc.sharedBy.id,
        name: doc.sharedBy.name,
      });
    });
    return Array.from(uniqueSharers.values());
  }, []);

  const filteredAndSortedDocuments = useMemo(() => {
    let docs = [...mockSharedDocuments];

    // Apply permission filter
    if (permissionFilter !== "all") {
      docs = docs.filter((doc) => doc.sharePermission === permissionFilter);
    }

    // Apply sharer filter
    if (sharedByFilters.length > 0) {
      docs = docs.filter((doc) => sharedByFilters.includes(doc.sharedBy.id));
    }

    // Sort documents
    docs.sort((a, b) => {
      switch (sortBy) {
        case "sharedAt":
          return new Date(b.sharedAt).getTime() - new Date(a.sharedAt).getTime();
        case "name":
          return a.name.localeCompare(b.name);
        case "sharedBy":
          return a.sharedBy.name.localeCompare(b.sharedBy.name);
        default:
          return 0;
      }
    });

    return docs;
  }, [permissionFilter, sharedByFilters, sortBy]);

  // Group documents by sharer when sorted by sharedBy
  const groupedDocuments = useMemo(() => {
    if (sortBy !== "sharedBy") return null;

    const groups = new Map<string, SharedDocument[]>();
    filteredAndSortedDocuments.forEach((doc) => {
      const existing = groups.get(doc.sharedBy.name) || [];
      groups.set(doc.sharedBy.name, [...existing, doc]);
    });
    return groups;
  }, [filteredAndSortedDocuments, sortBy]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/10">
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Shared with me</h1>
            <p className="text-sm text-muted-foreground">
              {filteredAndSortedDocuments.length} documents shared with you
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort By */}
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SharedSortBy)}>
            <SelectTrigger className="w-[150px] h-9">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sharedAt">Date shared</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="sharedBy">Shared by</SelectItem>
            </SelectContent>
          </Select>

          {/* Permission Filter */}
          <Select
            value={permissionFilter}
            onValueChange={(v) => setPermissionFilter(v as PermissionFilter)}
          >
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All permissions</SelectItem>
              <SelectItem value="view">Can view</SelectItem>
              <SelectItem value="edit">Can edit</SelectItem>
              <SelectItem value="comment">Can comment</SelectItem>
            </SelectContent>
          </Select>

          {/* Shared By Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="w-4 h-4 mr-2" />
                Shared by
                {sharedByFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-2 px-1.5 py-0 text-xs">
                    {sharedByFilters.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by person</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sharers.map((sharer) => (
                <DropdownMenuCheckboxItem
                  key={sharer.id}
                  checked={sharedByFilters.includes(sharer.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      addSharedByFilter(sharer.id);
                    } else {
                      removeSharedByFilter(sharer.id);
                    }
                  }}
                >
                  <Avatar className="w-5 h-5 mr-2">
                    <AvatarFallback className="text-[8px]">
                      {getInitials(sharer.name)}
                    </AvatarFallback>
                  </Avatar>
                  {sharer.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Filters */}
      {(permissionFilter !== "all" || sharedByFilters.length > 0) && (
        <div className="flex items-center gap-2 px-6 py-2 border-b border-border/30 bg-muted/30">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {permissionFilter !== "all" && (
            <Badge variant="secondary" className="text-xs">
              {permissionFilter === "view" && "Can view"}
              {permissionFilter === "edit" && "Can edit"}
              {permissionFilter === "comment" && "Can comment"}
            </Badge>
          )}
          {sharedByFilters.map((id) => {
            const sharer = sharers.find((s) => s.id === id);
            return (
              <Badge key={id} variant="secondary" className="text-xs">
                {sharer?.name}
              </Badge>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={clearFilters}
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Document List */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          {!mounted ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-3 w-[150px]" />
                      <Skeleton className="h-3 w-[200px]" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredAndSortedDocuments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Users className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">No shared documents</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Documents shared with you will appear here
              </p>
            </div>
          ) : groupedDocuments ? (
            <div className="space-y-6">
              {Array.from(groupedDocuments.entries()).map(([sharerName, docs]) => (
                <div key={sharerName}>
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-[10px]">
                        {getInitials(sharerName)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-sm font-medium">{sharerName}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {docs.length}
                    </Badge>
                  </div>
                  <div className="space-y-3 pl-8">
                    {docs.map((doc) => (
                      <SharedDocumentCard key={doc.id} doc={doc} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAndSortedDocuments.map((doc) => (
                <SharedDocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
