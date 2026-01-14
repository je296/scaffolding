"use client";

import * as React from "react";
import {
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
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  TYPE_ICONS,
  TYPE_GRADIENT_COLORS,
  STATUS_COLORS,
  formatFileSize,
  formatRelativeDate,
  getVersionDisplay,
} from "@/lib/document-utils";
import type { DisplayDocument } from "@/types/ui-document";

// Extended display document that may have optional UI-specific fields
interface ExtendedDisplayDocument extends DisplayDocument {
  folderPath?: string;
  path?: string;
  lockedBy?: { name: string };
}

interface DocumentCardProps {
  document: ExtendedDisplayDocument;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onClick?: (document: ExtendedDisplayDocument) => void;
  viewMode?: "grid" | "list";
}

// Memoized list view component
const DocumentListItem = React.memo(function DocumentListItem({
  document,
  isSelected,
  onSelect,
  onClick,
}: Omit<DocumentCardProps, "viewMode">) {
  const Icon = TYPE_ICONS[document.type] || File;
  const colorClass = TYPE_GRADIENT_COLORS[document.type] || TYPE_GRADIENT_COLORS.other;

  const handleClick = React.useCallback(() => onClick?.(document), [onClick, document]);
  const handleSelect = React.useCallback(() => onSelect?.(document.id), [onSelect, document.id]);
  const stopPropagation = React.useCallback((e: React.MouseEvent) => e.stopPropagation(), []);

  return (
    <div
      className={cn(
        "group flex items-center gap-4 rounded-lg border border-white/5 bg-white/[0.02] p-3 transition-all duration-200 hover:bg-white/[0.04] hover:border-white/10 cursor-pointer",
        isSelected && "border-cyan-500/50 bg-cyan-500/5"
      )}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleSelect}
          onClick={stopPropagation}
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
          {document.folderPath || document.path || ""} • {formatFileSize(document.size)} • {getVersionDisplay(document)}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="outline" className={cn("text-[10px]", STATUS_COLORS[document.status])}>
          {document.status.replace("_", " ")}
        </Badge>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatRelativeDate(document.updatedAt)}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={stopPropagation}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DocumentActionsMenu />
        </DropdownMenu>
      </div>
    </div>
  );
});

// Memoized grid card component
const DocumentGridCard = React.memo(function DocumentGridCard({
  document,
  isSelected,
  onSelect,
  onClick,
}: Omit<DocumentCardProps, "viewMode">) {
  const Icon = TYPE_ICONS[document.type] || File;
  const colorClass = TYPE_GRADIENT_COLORS[document.type] || TYPE_GRADIENT_COLORS.other;

  const handleClick = React.useCallback(() => onClick?.(document), [onClick, document]);
  const handleSelect = React.useCallback(() => onSelect?.(document.id), [onSelect, document.id]);
  const stopPropagation = React.useCallback((e: React.MouseEvent) => e.stopPropagation(), []);

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-white/5 bg-white/[0.02] transition-all duration-200 hover:bg-white/[0.04] hover:border-white/10 cursor-pointer",
        isSelected && "border-cyan-500/50 bg-cyan-500/5 ring-1 ring-cyan-500/20"
      )}
      onClick={handleClick}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleSelect}
          onClick={stopPropagation}
          className="border-white/40 bg-black/40 backdrop-blur-sm"
        />
      </div>

      {/* Actions Menu */}
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={stopPropagation}>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 bg-black/40 backdrop-blur-sm hover:bg-black/60"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DocumentActionsMenu />
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
            STATUS_COLORS[document.status]
          )}
        >
          {document.status.replace("_", " ")}
        </Badge>

        {/* Lock indicator */}
        {document.isLocked && (
          <div className="absolute bottom-3 right-3">
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
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-foreground truncate">{document.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {formatFileSize(document.size)} • {getVersionDisplay(document)}
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
            {formatRelativeDate(document.updatedAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
});

// Memoized actions menu - static content, never needs to re-render
const DocumentActionsMenu = React.memo(function DocumentActionsMenu() {
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
});

// Main component - delegates to optimized sub-components
export const DocumentCard = React.memo(function DocumentCard({
  document,
  isSelected = false,
  onSelect,
  onClick,
  viewMode = "grid",
}: DocumentCardProps) {
  if (viewMode === "list") {
    return (
      <DocumentListItem
        document={document}
        isSelected={isSelected}
        onSelect={onSelect}
        onClick={onClick}
      />
    );
  }

  return (
    <DocumentGridCard
      document={document}
      isSelected={isSelected}
      onSelect={onSelect}
      onClick={onClick}
    />
  );
});
