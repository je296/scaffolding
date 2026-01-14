"use client";

import * as React from "react";
import {
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
  Presentation,
  FileArchive,
  File,
  MoreVertical,
  Star,
  Download,
  Share2,
  Trash2,
  Eye,
  Edit,
  Copy,
  Lock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Document, DocumentType } from "@/schemas";

const typeIcons: Record<DocumentType, React.ComponentType<{ className?: string }>> = {
  document: FileText,
  spreadsheet: FileSpreadsheet,
  presentation: Presentation,
  image: FileImage,
  video: FileVideo,
  audio: FileAudio,
  archive: FileArchive,
  pdf: FileText,
  other: File,
};

const typeColors: Record<DocumentType, string> = {
  document: "from-blue-500 to-blue-600",
  spreadsheet: "from-emerald-500 to-emerald-600",
  presentation: "from-orange-500 to-orange-600",
  image: "from-pink-500 to-pink-600",
  video: "from-purple-500 to-purple-600",
  audio: "from-violet-500 to-violet-600",
  archive: "from-amber-500 to-amber-600",
  pdf: "from-red-500 to-red-600",
  other: "from-slate-500 to-slate-600",
};

const statusColors: Record<string, string> = {
  draft: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  pending_review: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  approved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  published: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  archived: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  deleted: "bg-red-500/20 text-red-400 border-red-500/30",
};

interface DocumentCardProps {
  document: Document;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onClick?: (document: Document) => void;
  viewMode?: "grid" | "list" | "table";
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function DocumentCard({
  document,
  isSelected = false,
  onSelect,
  onClick,
  viewMode = "grid",
}: DocumentCardProps) {
  const Icon = typeIcons[document.type] || File;
  const colorClass = typeColors[document.type] || typeColors.other;

  if (viewMode === "list") {
    return (
      <div
        className={cn(
          "group flex items-center gap-4 rounded-lg border border-white/5 bg-white/[0.02] p-3 transition-all duration-200 hover:bg-white/[0.04] hover:border-white/10 cursor-pointer",
          isSelected && "border-cyan-500/50 bg-cyan-500/5"
        )}
        onClick={() => onClick?.(document)}
      >
        <div className="flex items-center gap-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect?.(document.id)}
            onClick={(e) => e.stopPropagation()}
            className="border-white/20"
          />
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br shadow-lg",
              colorClass
            )}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground truncate">{document.name}</span>
            {document.isLocked && <Lock className="h-3.5 w-3.5 text-amber-500" />}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {document.folderPath} • {formatFileSize(document.size)} • v{document.currentVersion}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className={cn("text-[10px]", statusColors[document.status])}>
            {document.status.replace("_", " ")}
          </Badge>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDate(document.updatedAt)}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DocumentActionsMenu document={document} />
          </DropdownMenu>
        </div>
      </div>
    );
  }

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-white/5 bg-white/[0.02] transition-all duration-200 hover:bg-white/[0.04] hover:border-white/10 cursor-pointer",
        isSelected && "border-cyan-500/50 bg-cyan-500/5 ring-1 ring-cyan-500/20"
      )}
      onClick={() => onClick?.(document)}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect?.(document.id)}
          onClick={(e) => e.stopPropagation()}
          className="border-white/40 bg-black/40 backdrop-blur-sm"
        />
      </div>

      {/* Actions Menu */}
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 bg-black/40 backdrop-blur-sm hover:bg-black/60"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DocumentActionsMenu document={document} />
        </DropdownMenu>
      </div>

      {/* Document Preview */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-white/[0.02] to-white/[0.05] flex items-center justify-center">
        <div
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg shadow-black/20",
            colorClass
          )}
        >
          <Icon className="h-8 w-8 text-white" />
        </div>

        {/* Status Badge */}
        <Badge
          variant="outline"
          className={cn(
            "absolute bottom-3 left-3 text-[10px]",
            statusColors[document.status]
          )}
        >
          {document.status.replace("_", " ")}
        </Badge>

        {/* Lock indicator */}
        {document.isLocked && (
          <div className="absolute bottom-3 right-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 backdrop-blur-sm">
                    <Lock className="h-3 w-3 text-amber-400" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  Locked by {document.lockedBy?.name}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-foreground truncate">{document.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {formatFileSize(document.size)} • v{document.currentVersion}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-violet-500 to-purple-600" />
            <span className="text-xs text-muted-foreground truncate">
              {document.updatedBy.name}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground/60">
            {formatDate(document.updatedAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function DocumentActionsMenu({ document }: { document: Document }) {
  return (
    <DropdownMenuContent align="end" className="w-48">
      <DropdownMenuItem className="gap-2">
        <Eye className="h-4 w-4" />
        Preview
      </DropdownMenuItem>
      <DropdownMenuItem className="gap-2">
        <Edit className="h-4 w-4" />
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem className="gap-2">
        <Download className="h-4 w-4" />
        Download
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="gap-2">
        <Copy className="h-4 w-4" />
        Copy
      </DropdownMenuItem>
      <DropdownMenuItem className="gap-2">
        <Share2 className="h-4 w-4" />
        Share
      </DropdownMenuItem>
      <DropdownMenuItem className="gap-2">
        <Star className="h-4 w-4" />
        Add to Starred
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="gap-2 text-red-400 focus:text-red-400">
        <Trash2 className="h-4 w-4" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
