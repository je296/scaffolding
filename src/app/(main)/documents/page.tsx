"use client";

import * as React from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileText,
  Archive,
  Building2,
  Briefcase,
  Home,
  MoreVertical,
  Plus,
  Upload,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DocumentGrid } from "@/components/documents/document-grid";
import { DocumentTable } from "@/components/documents/document-table";
import { useDocumentStore } from "@/stores";
import { cn } from "@/lib/utils";
import {
  mockFolderTree,
  findFolderById,
  getBreadcrumbPath,
  type TreeFolder,
} from "@/lib/mock-tree";

const typeIcons: Record<string, React.ElementType> = {
  cabinet: Building2,
  workspace: Briefcase,
  folder: Folder,
};

const typeColors: Record<string, string> = {
  blue: "text-blue-400",
  green: "text-emerald-400",
  red: "text-red-400",
  purple: "text-violet-400",
  amber: "text-amber-400",
};

interface TreeNodeProps {
  folder: TreeFolder;
  level: number;
  expandedIds: Set<string>;
  selectedId: string | null;
  onToggle: (id: string) => void;
  onSelect: (folder: TreeFolder) => void;
}

function TreeNode({ folder, level, expandedIds, selectedId, onToggle, onSelect }: TreeNodeProps) {
  const isExpanded = expandedIds.has(folder.id);
  const isSelected = selectedId === folder.id;
  const hasChildren = folder.children && folder.children.length > 0;
  
  const Icon = isExpanded && hasChildren ? FolderOpen : typeIcons[folder.type] || Folder;
  const colorClass = folder.color ? typeColors[folder.color] : "text-amber-400";

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1 py-1.5 px-2 rounded-md cursor-pointer transition-colors",
          "hover:bg-white/5",
          isSelected && "bg-cyan-500/10 text-cyan-400"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => onSelect(folder)}
      >
        <button
          className={cn(
            "flex items-center justify-center h-5 w-5 rounded hover:bg-white/10 transition-colors",
            !hasChildren && "invisible"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(folder.id);
          }}
        >
          {hasChildren && (
            isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            )
          )}
        </button>
        
        <Icon className={cn("h-4 w-4 shrink-0", colorClass)} />
        
        <span className="flex-1 truncate text-sm">{folder.name}</span>
        
        <span className="text-[10px] text-muted-foreground/60 tabular-nums">
          {folder.documentCount}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="opacity-0 group-hover:opacity-100 flex items-center justify-center h-5 w-5 rounded hover:bg-white/10 transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Plus className="h-4 w-4 mr-2" />
              New Subfolder
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Upload className="h-4 w-4 mr-2" />
              Upload Here
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Rename</DropdownMenuItem>
            <DropdownMenuItem>Move</DropdownMenuItem>
            <DropdownMenuItem className="text-red-400">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isExpanded && hasChildren && (
        <div>
          {folder.children!.map((child) => (
            <TreeNode
              key={child.id}
              folder={child}
              level={level + 1}
              expandedIds={expandedIds}
              selectedId={selectedId}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DocumentGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-white/5 bg-white/2 overflow-hidden">
          <Skeleton className="aspect-4/3 rounded-none" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DocumentsPage() {
  const { viewMode, setDocuments, documents } = useDocumentStore();
  const [mounted, setMounted] = React.useState(false);
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set(["cabinet-1", "cabinet-2"]));
  const [selectedFolder, setSelectedFolder] = React.useState<TreeFolder | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Update documents when folder is selected
  React.useEffect(() => {
    if (selectedFolder?.documents) {
      setDocuments(selectedFolder.documents);
    } else {
      setDocuments([]);
    }
  }, [selectedFolder, setDocuments]);

  const handleToggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelect = (folder: TreeFolder) => {
    setSelectedFolder(folder);
    // Auto-expand when selecting
    if (folder.children && folder.children.length > 0) {
      setExpandedIds((prev) => new Set([...prev, folder.id]));
    }
  };

  const breadcrumbPath = selectedFolder
    ? getBreadcrumbPath(mockFolderTree, selectedFolder.id)
    : [];

  // Filter tree based on search
  const filterTree = (folders: TreeFolder[], query: string): TreeFolder[] => {
    if (!query) return folders;
    
    return folders.reduce<TreeFolder[]>((acc, folder) => {
      const matchesQuery = folder.name.toLowerCase().includes(query.toLowerCase());
      const filteredChildren = folder.children ? filterTree(folder.children, query) : [];
      
      if (matchesQuery || filteredChildren.length > 0) {
        acc.push({
          ...folder,
          children: filteredChildren.length > 0 ? filteredChildren : folder.children,
        });
      }
      
      return acc;
    }, []);
  };

  const filteredTree = filterTree(mockFolderTree, searchQuery);

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Left Panel - Tree View */}
      <div className="w-72 border-r border-white/5 flex flex-col bg-white/[0.01]">
        <div className="p-3 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 text-sm bg-white/5 border-white/10"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="py-2">
            {filteredTree.map((folder) => (
              <TreeNode
                key={folder.id}
                folder={folder}
                level={0}
                expandedIds={expandedIds}
                selectedId={selectedFolder?.id || null}
                onToggle={handleToggle}
                onSelect={handleSelect}
              />
            ))}
          </div>
        </ScrollArea>

        <div className="p-3 border-t border-white/5">
          <Button variant="outline" size="sm" className="w-full gap-2">
            <Plus className="h-4 w-4" />
            New Cabinet
          </Button>
        </div>
      </div>

      {/* Right Panel - Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedFolder(null);
                    }}
                    className="text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <Home className="h-4 w-4" />
                    Documents
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbPath.map((folder, index) => (
                  <React.Fragment key={folder.id}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {index === breadcrumbPath.length - 1 ? (
                        <span className="font-medium text-foreground">{folder.name}</span>
                      ) : (
                        <BreadcrumbLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSelect(folder);
                          }}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {folder.name}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                New Folder
              </Button>
              <Button size="sm" className="gap-2 bg-cyan-600 hover:bg-cyan-700">
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </div>
          </div>

          {selectedFolder && (
            <div className="mt-3 flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  selectedFolder.color === "blue" && "bg-blue-500/20",
                  selectedFolder.color === "green" && "bg-emerald-500/20",
                  selectedFolder.color === "red" && "bg-red-500/20",
                  selectedFolder.color === "purple" && "bg-violet-500/20",
                  !selectedFolder.color && "bg-amber-500/20"
                )}
              >
                {React.createElement(typeIcons[selectedFolder.type] || Folder, {
                  className: cn(
                    "h-5 w-5",
                    selectedFolder.color ? typeColors[selectedFolder.color] : "text-amber-400"
                  ),
                })}
              </div>
              <div>
                <h1 className="text-lg font-semibold">{selectedFolder.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {selectedFolder.documentCount} documents
                  {selectedFolder.children && ` • ${selectedFolder.children.length} subfolders`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4">
          {!selectedFolder ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
                <Archive className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-foreground">Select a folder</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-md">
                Choose a folder from the tree on the left to view its contents. You can expand cabinets and folders to navigate the hierarchy.
              </p>
            </div>
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
                <FileText className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-foreground">No documents</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-md">
                This folder is empty. Upload documents or navigate to a subfolder.
              </p>
              <Button className="mt-6 gap-2 bg-cyan-600 hover:bg-cyan-700">
                <Upload className="h-4 w-4" />
                Upload Documents
              </Button>
            </div>
          ) : !mounted ? (
            <DocumentGridSkeleton />
          ) : viewMode === "table" ? (
            <DocumentTable documents={documents} />
          ) : (
            <DocumentGrid documents={documents} />
          )}
        </div>
      </div>
    </div>
  );
}
