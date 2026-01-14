"use client";

import * as React from "react";
import { Star, Filter, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DocumentGrid } from "@/components/documents/document-grid";
import { DocumentTable } from "@/components/documents/document-table";
import { useDocumentStore } from "@/stores";
import { Skeleton } from "@/components/ui/skeleton";
import { mockStarredDocuments } from "@/lib/mock-starred";

function DocumentGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-white/5 bg-white/2 overflow-hidden">
          <Skeleton className="aspect-4/3 rounded-none" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex items-center gap-2 pt-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function StarredPage() {
  const { viewMode, setDocuments, documents } = useDocumentStore();
  const [sortBy, setSortBy] = React.useState("starredAt");
  const [mounted, setMounted] = React.useState(false);

  // Wait for hydration to prevent view mode flicker
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize with starred documents
  React.useEffect(() => {
    setDocuments(mockStarredDocuments);
  }, [setDocuments]);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-muted-foreground hover:text-foreground">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="font-medium text-foreground">Starred</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] h-9">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="starredAt">Date starred</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="updatedAt">Last modified</SelectItem>
              <SelectItem value="size">Size</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20">
          <Star className="h-6 w-6 text-white fill-white" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Starred</h1>
          <p className="text-sm text-muted-foreground">
            {documents.length} item{documents.length !== 1 ? "s" : ""} • Quick access to your important documents
          </p>
        </div>
      </div>

      {/* Documents */}
      {!mounted ? (
        <DocumentGridSkeleton />
      ) : documents.length > 0 ? (
        viewMode === "table" ? (
          <DocumentTable documents={documents} />
        ) : (
          <DocumentGrid documents={documents} />
        )
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
        <Star className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-6 text-xl font-medium text-foreground">No starred items</h3>
      <p className="mt-2 text-sm text-muted-foreground text-center max-w-md">
        Star important documents and folders for quick access. Click the star icon on any item to add it here.
      </p>
      <Button variant="outline" className="mt-6 gap-2">
        <Star className="h-4 w-4" />
        Learn how to star items
      </Button>
    </div>
  );
}
