"use client";

import * as React from "react";
import { File, MoreVertical, ArrowUpDown, Lock } from "lucide-react";
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
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import {
  TYPE_ICONS,
  TYPE_TEXT_COLORS,
  STATUS_COLORS,
  formatFileSize,
  formatAbsoluteDate,
  getVersionDisplay,
  getOwnerName,
} from "@/lib/document-utils";
import type { DisplayDocument } from "@/types/ui-document";

interface DocumentTableProps {
  documents: DisplayDocument[];
}

// Memoized table row to prevent re-renders
const DocumentTableRow = React.memo(function DocumentTableRow({
  doc,
  isSelected,
  onToggleSelect,
  onSetCurrent,
}: {
  doc: DisplayDocument;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onSetCurrent: (doc: DisplayDocument) => void;
}) {
  const Icon = TYPE_ICONS[doc.type] || File;
  const colorClass = TYPE_TEXT_COLORS[doc.type] || TYPE_TEXT_COLORS.other;

  const handleRowClick = React.useCallback(() => onSetCurrent(doc), [onSetCurrent, doc]);
  const handleCheckboxChange = React.useCallback(() => onToggleSelect(doc.id), [onToggleSelect, doc.id]);
  const stopPropagation = React.useCallback((e: React.MouseEvent) => e.stopPropagation(), []);

  return (
    <TableRow
      className={cn(
        "border-white/5 cursor-pointer transition-colors",
        isSelected && "bg-cyan-500/5"
      )}
      onClick={handleRowClick}
    >
      <TableCell onClick={stopPropagation}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleCheckboxChange}
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
        <Badge variant="outline" className={cn("text-[10px]", STATUS_COLORS[doc.status])}>
          {doc.status.replace("_", " ")}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full bg-gradient-to-br from-violet-500 to-purple-600" />
          <span className="text-sm text-muted-foreground truncate max-w-[100px]">
            {getOwnerName(doc)}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatFileSize(doc.size)}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatAbsoluteDate(doc.updatedAt)}
      </TableCell>
      <TableCell className="text-muted-foreground">{getVersionDisplay(doc)}</TableCell>
      <TableCell onClick={stopPropagation}>
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
});

// Memoized sortable header button
const SortableHeader = React.memo(function SortableHeader({
  label,
  column,
  onSort,
}: {
  label: string;
  column: string;
  onSort: (column: string) => void;
}) {
  const handleClick = React.useCallback(() => onSort(column), [onSort, column]);
  
  return (
    <Button
      variant="ghost"
      className="h-8 px-2 -ml-2 font-medium text-muted-foreground hover:text-foreground"
      onClick={handleClick}
    >
      {label}
      <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
    </Button>
  );
});

export const DocumentTable = React.memo(function DocumentTable({ documents }: DocumentTableProps) {
  // Use shallow comparison to prevent re-renders when unrelated state changes
  const {
    selectedDocuments,
    toggleDocumentSelection,
    selectAllDocuments,
    deselectAllDocuments,
    setCurrentDocument,
    setSorting,
    sortBy,
    sortOrder,
  } = useDocumentStore(
    useShallow((state) => ({
      selectedDocuments: state.selectedDocuments,
      toggleDocumentSelection: state.toggleDocumentSelection,
      selectAllDocuments: state.selectAllDocuments,
      deselectAllDocuments: state.deselectAllDocuments,
      setCurrentDocument: state.setCurrentDocument,
      setSorting: state.setSorting,
      sortBy: state.sortBy,
      sortOrder: state.sortOrder,
    }))
  );

  const allSelected = documents.length > 0 && documents.every((d) => selectedDocuments.has(d.id));

  const handleSelectAll = React.useCallback(() => {
    if (allSelected) {
      deselectAllDocuments();
    } else {
      selectAllDocuments();
    }
  }, [allSelected, deselectAllDocuments, selectAllDocuments]);

  const handleSort = React.useCallback((column: string) => {
    if (sortBy === column) {
      setSorting(column, sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSorting(column, "asc");
    }
  }, [sortBy, sortOrder, setSorting]);

  const handleSetCurrent = React.useCallback((doc: DisplayDocument) => {
    setCurrentDocument(doc as Parameters<typeof setCurrentDocument>[0]);
  }, [setCurrentDocument]);

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
              <SortableHeader label="Name" column="name" onSort={handleSort} />
            </TableHead>
            <TableHead className="w-28">
              <SortableHeader label="Status" column="status" onSort={handleSort} />
            </TableHead>
            <TableHead className="w-32">Owner</TableHead>
            <TableHead className="w-24">
              <SortableHeader label="Size" column="size" onSort={handleSort} />
            </TableHead>
            <TableHead className="w-32">
              <SortableHeader label="Modified" column="updatedAt" onSort={handleSort} />
            </TableHead>
            <TableHead className="w-20">Version</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <DocumentTableRow
              key={doc.id}
              doc={doc}
              isSelected={selectedDocuments.has(doc.id)}
              onToggleSelect={toggleDocumentSelection}
              onSetCurrent={handleSetCurrent}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
});
