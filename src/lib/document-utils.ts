import {
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
  Presentation,
  FileArchive,
  File,
} from "lucide-react";
import type { DocumentType } from "@/schemas";

/**
 * Shared document utilities - extracted for DRY and performance
 */

// Icon mapping - defined once, used everywhere
export const TYPE_ICONS: Record<DocumentType, React.ComponentType<{ className?: string }>> = {
  document: FileText,
  spreadsheet: FileSpreadsheet,
  presentation: Presentation,
  image: FileImage,
  video: FileVideo,
  audio: FileAudio,
  archive: FileArchive,
  pdf: FileText,
  other: File,
} as const;

// Gradient colors for cards/icons
export const TYPE_GRADIENT_COLORS: Record<DocumentType, string> = {
  document: "from-blue-500 to-blue-600",
  spreadsheet: "from-emerald-500 to-emerald-600",
  presentation: "from-orange-500 to-orange-600",
  image: "from-pink-500 to-pink-600",
  video: "from-purple-500 to-purple-600",
  audio: "from-violet-500 to-violet-600",
  archive: "from-amber-500 to-amber-600",
  pdf: "from-red-500 to-red-600",
  other: "from-slate-500 to-slate-600",
} as const;

// Text colors for table rows
export const TYPE_TEXT_COLORS: Record<DocumentType, string> = {
  document: "text-blue-400",
  spreadsheet: "text-emerald-400",
  presentation: "text-orange-400",
  image: "text-pink-400",
  video: "text-purple-400",
  audio: "text-violet-400",
  archive: "text-amber-400",
  pdf: "text-red-400",
  other: "text-slate-400",
} as const;

// Status badge colors
export const STATUS_COLORS: Record<string, string> = {
  draft: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  pending_review: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  approved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  published: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  archived: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  deleted: "bg-red-500/20 text-red-400 border-red-500/30",
} as const;

// Pre-calculated constants for formatFileSize
const SIZE_UNITS = ["B", "KB", "MB", "GB"] as const;
const SIZE_BASE = 1024;
const LOG_BASE = Math.log(SIZE_BASE);

/**
 * Format bytes to human readable string
 * Optimized to avoid repeated calculations
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const i = Math.floor(Math.log(bytes) / LOG_BASE);
  const size = bytes / Math.pow(SIZE_BASE, i);
  return `${size.toFixed(1)} ${SIZE_UNITS[i]}`;
}

// Pre-calculated constants for date formatting
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
};

/**
 * Format date to relative or absolute string
 * Uses cached formatter for performance
 */
const dateFormatter = new Intl.DateTimeFormat("en-US", DATE_FORMAT_OPTIONS);

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = Date.now();
  const days = Math.floor((now - date.getTime()) / MS_PER_DAY);

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return dateFormatter.format(date);
}

export function formatAbsoluteDate(dateString: string): string {
  return dateFormatter.format(new Date(dateString));
}

/**
 * Get document version display string
 */
export function getVersionDisplay(doc: { currentVersion?: number; version?: string }): string {
  return `v${doc.currentVersion || doc.version || "1"}`;
}

/**
 * Get owner/creator name with fallback
 */
export function getOwnerName(doc: { owner?: { name: string }; createdBy?: { name: string } }): string {
  return (doc.owner || doc.createdBy)?.name || "Unknown";
}
