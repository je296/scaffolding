"use client";

import * as React from "react";
import { Upload, X, File, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "complete" | "error";
  error?: string;
}

interface UploadDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function UploadDialog({ open, onOpenChange, trigger }: UploadDialogProps) {
  const [files, setFiles] = React.useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const uploadFiles: UploadFile[] = newFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      progress: 0,
      status: "pending" as const,
    }));
    setFiles((prev) => [...prev, ...uploadFiles]);

    // Simulate upload progress
    uploadFiles.forEach((uploadFile) => {
      simulateUpload(uploadFile.id);
    });
  };

  const simulateUpload = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "uploading" as const } : f))
    );

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, progress: 100, status: "complete" as const } : f
          )
        );
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, progress } : f))
        );
      }
    }, 200);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clearCompleted = () => {
    setFiles((prev) => prev.filter((f) => f.status !== "complete"));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
          <DialogDescription>
            Drag and drop files or click to browse. Supports documents, images, and archives.
          </DialogDescription>
        </DialogHeader>

        <div
          className={cn(
            "relative mt-4 flex min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/10 bg-white/[0.02] transition-all duration-200",
            isDragging && "border-cyan-500/50 bg-cyan-500/5"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={handleFileSelect}
          />
          <div className="flex flex-col items-center gap-4 p-6 text-center">
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-full bg-white/5 transition-colors",
                isDragging && "bg-cyan-500/20"
              )}
            >
              <Upload
                className={cn(
                  "h-6 w-6 text-muted-foreground transition-colors",
                  isDragging && "text-cyan-400"
                )}
              />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {isDragging ? "Drop files here" : "Drag & drop files here"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                or click to browse from your computer
              </p>
            </div>
            <p className="text-xs text-muted-foreground/60">
              Maximum file size: 100MB
            </p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {files.length} file{files.length !== 1 ? "s" : ""}
              </span>
              {files.some((f) => f.status === "complete") && (
                <Button variant="ghost" size="sm" className="text-xs" onClick={clearCompleted}>
                  Clear completed
                </Button>
              )}
            </div>

            <div className="max-h-[240px] space-y-2 overflow-y-auto">
              {files.map((uploadFile) => (
                <div
                  key={uploadFile.id}
                  className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3"
                >
                  <File className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium truncate">{uploadFile.file.name}</span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatFileSize(uploadFile.file.size)}
                      </span>
                    </div>
                    {uploadFile.status === "uploading" && (
                      <Progress value={uploadFile.progress} className="mt-2 h-1" />
                    )}
                  </div>
                  <div className="shrink-0">
                    {uploadFile.status === "pending" && (
                      <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
                    )}
                    {uploadFile.status === "uploading" && (
                      <span className="text-xs text-cyan-400">
                        {Math.round(uploadFile.progress)}%
                      </span>
                    )}
                    {uploadFile.status === "complete" && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    )}
                    {uploadFile.status === "error" && (
                      <AlertCircle className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={() => removeFile(uploadFile.id)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>
            Cancel
          </Button>
          <Button className="bg-cyan-600 hover:bg-cyan-700" disabled={files.length === 0}>
            Upload {files.length > 0 && `(${files.length})`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
