"use client";

import * as React from "react";
import { Folder, FileText, Clock, TrendingUp, Plus, Upload, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DocumentGrid } from "@/components/documents/document-grid";
import { DocumentTable } from "@/components/documents/document-table";
import { UploadDialog } from "@/components/documents/upload-dialog";
import { useDocumentStore } from "@/stores";
import { Skeleton } from "@/components/ui/skeleton";
import { mockDocuments } from "@/lib/mock-data";

function DocumentGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-white/5 bg-white/[0.02] overflow-hidden">
          <Skeleton className="aspect-[4/3] rounded-none" />
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

const stats = [
  {
    title: "Total Documents",
    value: "2,847",
    change: "+12%",
    icon: FileText,
    color: "from-cyan-500 to-blue-500",
  },
  {
    title: "Active Folders",
    value: "156",
    change: "+3%",
    icon: Folder,
    color: "from-amber-500 to-orange-500",
  },
  {
    title: "Recent Activity",
    value: "89",
    change: "+24%",
    icon: Clock,
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "Storage Used",
    value: "45.2 GB",
    change: "+8%",
    icon: TrendingUp,
    color: "from-violet-500 to-purple-500",
  },
];

export default function HomePage() {
  const { viewMode, setDocuments, documents } = useDocumentStore();
  const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // Wait for hydration to prevent view mode flicker
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize documents
  React.useEffect(() => {
    if (documents.length === 0) {
      setDocuments(mockDocuments);
    }
  }, [documents.length, setDocuments]);

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
              <span className="font-medium text-foreground">All Documents</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <FolderPlus className="h-4 w-4" />
            New Folder
          </Button>
          <UploadDialog
            open={uploadDialogOpen}
            onOpenChange={setUploadDialogOpen}
            trigger={
              <Button size="sm" className="gap-2 bg-cyan-600 hover:bg-cyan-700">
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            }
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className="border-white/5 bg-white/2 overflow-hidden animate-fade-in opacity-0"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                  <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {stat.change} from last month
                  </p>
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color} shadow-lg`}
                >
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-white/5 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-medium text-foreground">Quick Actions</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Get started with common document management tasks
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Document
              </Button>
              <Button variant="secondary" size="sm" className="gap-2">
                <FolderPlus className="h-4 w-4" />
                Create Workspace
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="gap-2"
                onClick={() => setUploadDialogOpen(true)}
              >
                <Upload className="h-4 w-4" />
                Bulk Upload
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Documents Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Recent Documents</h2>
            <p className="text-sm text-muted-foreground">
              Your recently modified documents across all folders
            </p>
          </div>
          <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
            View all
          </Button>
        </div>

        {mounted ? (
          viewMode === "table" ? (
            <DocumentTable documents={documents} />
          ) : (
            <DocumentGrid documents={documents} />
          )
        ) : (
          <DocumentGridSkeleton />
        )}
      </div>

      {/* Empty State (if no documents) */}
      {documents.length === 0 && (
        <Card className="border-white/5 bg-white/[0.02]">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-foreground">No documents yet</h3>
            <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
              Get started by uploading your first document or creating a new folder to organize
              your content.
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setUploadDialogOpen(true)}
              >
                <Upload className="h-4 w-4" />
                Upload Document
              </Button>
              <Button className="gap-2 bg-cyan-600 hover:bg-cyan-700">
                <FolderPlus className="h-4 w-4" />
                Create Folder
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
