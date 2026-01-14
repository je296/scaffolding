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
  ArrowUpDown,
  Lock,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDocumentStore } from "@/stores";
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
  document: "text-blue-400",
  spreadsheet: "text-emerald-400",
  presentation: "text-orange-400",
  image: "text-pink-400",
  video: "text-purple-400",
  audio: "text-violet-400",
  archive: "text-amber-400",
  pdf: "text-red-400",
  other: "text-slate-400",
};

const statusColors: Record<string, string> = {
  draft: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  pending_review: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  approved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  published: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  archived: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  deleted: "bg-red-500/20 text-red-400 border-red-500/30",
};

interface DocumentTableProps {
  documents: Document[];
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function DocumentTable({ documents }: DocumentTableProps) {
  const {
    selectedDocuments,
    toggleDocumentSelection,
    selectAllDocuments,
    deselectAllDocuments,
    setCurrentDocument,
    setSorting,
    sortBy,
    sortOrder,
  } = useDocumentStore();

  const allSelected = documents.length > 0 && documents.every((d) => selectedDocuments.has(d.id));

  const handleSelectAll = () => {
    if (allSelected) {
      deselectAllDocuments();
    } else {
      selectAllDocuments();
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSorting(column, sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSorting(column, "asc");
    }
  };

  return (
    <div className="rounded-lg border border-white/5 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/5 hover:bg-transparent">
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={handleSelectAll}
                className="border-white/20"
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="h-8 px-2 -ml-2 font-medium text-muted-foreground hover:text-foreground"
                onClick={() => handleSort("name")}
              >
                Name
                <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
              </Button>
            </TableHead>
            <TableHead className="w-28">
              <Button
                variant="ghost"
                className="h-8 px-2 -ml-2 font-medium text-muted-foreground hover:text-foreground"
                onClick={() => handleSort("status")}
              >
                Status
                <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
              </Button>
            </TableHead>
            <TableHead className="w-32">Owner</TableHead>
            <TableHead className="w-24">
              <Button
                variant="ghost"
                className="h-8 px-2 -ml-2 font-medium text-muted-foreground hover:text-foreground"
                onClick={() => handleSort("size")}
              >
                Size
                <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
              </Button>
            </TableHead>
            <TableHead className="w-32">
              <Button
                variant="ghost"
                className="h-8 px-2 -ml-2 font-medium text-muted-foreground hover:text-foreground"
                onClick={() => handleSort("updatedAt")}
              >
                Modified
                <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
              </Button>
            </TableHead>
            <TableHead className="w-20">Version</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => {
            const Icon = typeIcons[doc.type] || File;
            const colorClass = typeColors[doc.type] || typeColors.other;
            const isSelected = selectedDocuments.has(doc.id);

            return (
              <TableRow
                key={doc.id}
                className={cn(
                  "border-white/5 cursor-pointer transition-colors",
                  isSelected && "bg-cyan-500/5"
                )}
                onClick={() => setCurrentDocument(doc)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleDocumentSelection(doc.id)}
                    className="border-white/20"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Icon className={cn("h-5 w-5", colorClass)} />
                    <span className="font-medium">{doc.name}</span>
                    {doc.isLocked && <Lock className="h-3.5 w-3.5 text-amber-500" />}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("text-[10px]", statusColors[doc.status])}>
                    {doc.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-gradient-to-br from-violet-500 to-purple-600" />
                    <span className="text-sm text-muted-foreground truncate max-w-[100px]">
                      {doc.owner.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatFileSize(doc.size)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(doc.updatedAt)}
                </TableCell>
                <TableCell className="text-muted-foreground">v{doc.currentVersion}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Preview</DropdownMenuItem>
                      <DropdownMenuItem>Download</DropdownMenuItem>
                      <DropdownMenuItem>Share</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
