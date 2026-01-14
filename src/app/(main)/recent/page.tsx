"use client";

import { useMemo, useSyncExternalStore, useCallback } from "react";
import { Clock, Calendar, ArrowUpDown, Filter } from "lucide-react";
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
import { DocumentTable, DocumentGrid } from "@/components/documents";
import { useDocumentStore, useRecentStore, type TimeFilter, type RecentSortBy } from "@/stores";
import { useShallow } from "zustand/react/shallow";
import { mockRecentDocuments } from "@/lib/mock-recent";
import type { UIDocument } from "@/types/ui-document";
import { Skeleton } from "@/components/ui/skeleton";

const emptySubscribe = () => () => {};

export default function RecentPage() {
  // Use shallow comparison for store access
  const viewMode = useDocumentStore((state) => state.viewMode);
  const {
    timeFilter,
    sortBy,
    typeFilters,
    setTimeFilter,
    setSortBy,
    addTypeFilter,
    removeTypeFilter,
    clearFilters,
  } = useRecentStore(
    useShallow((state) => ({
      timeFilter: state.timeFilter,
      sortBy: state.sortBy,
      typeFilters: state.typeFilters,
      setTimeFilter: state.setTimeFilter,
      setSortBy: state.setSortBy,
      addTypeFilter: state.addTypeFilter,
      removeTypeFilter: state.removeTypeFilter,
      clearFilters: state.clearFilters,
    }))
  );

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const documentTypes = useMemo(() => {
    const types = new Set(mockRecentDocuments.map((doc) => doc.type));
    return Array.from(types);
  }, []);

  const filteredAndSortedDocuments = useMemo((): UIDocument[] => {
    let docs = [...mockRecentDocuments];

    // Apply time filter
    if (timeFilter !== "all") {
      const now = new Date();
      const cutoff = new Date();
      
      switch (timeFilter) {
        case "today":
          cutoff.setHours(0, 0, 0, 0);
          break;
        case "week":
          cutoff.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoff.setMonth(now.getMonth() - 1);
          break;
      }

      docs = docs.filter((doc) => new Date(doc.accessedAt || doc.updatedAt) >= cutoff);
    }

    // Apply type filter
    if (typeFilters.length > 0) {
      docs = docs.filter((doc) => typeFilters.includes(doc.type));
    }

    // Sort documents
    docs.sort((a, b) => {
      switch (sortBy) {
        case "accessedAt":
          return new Date(b.accessedAt || b.updatedAt).getTime() - new Date(a.accessedAt || a.updatedAt).getTime();
        case "modifiedAt":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return docs;
  }, [timeFilter, typeFilters, sortBy]);

  // Memoize label getter
  const getTimeFilterLabel = useCallback((filter: TimeFilter) => {
    const labels: Record<TimeFilter, string> = {
      today: "Today",
      week: "Past 7 days",
      month: "Past 30 days",
      all: "All time",
    };
    return labels[filter];
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-500/10">
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Recent</h1>
            <p className="text-sm text-muted-foreground">
              {filteredAndSortedDocuments.length} documents accessed recently
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Time Filter */}
          <Select value={timeFilter} onValueChange={(v) => setTimeFilter(v as TimeFilter)}>
            <SelectTrigger className="w-[140px] h-9">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Past 7 days</SelectItem>
              <SelectItem value="month">Past 30 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as RecentSortBy)}>
            <SelectTrigger className="w-[160px] h-9">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="accessedAt">Last accessed</SelectItem>
              <SelectItem value="modifiedAt">Last modified</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="w-4 h-4 mr-2" />
                Type
                {typeFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-2 px-1.5 py-0 text-xs">
                    {typeFilters.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {documentTypes.map((type) => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={typeFilters.includes(type)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      addTypeFilter(type);
                    } else {
                      removeTypeFilter(type);
                    }
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Filters */}
      {(timeFilter !== "all" || typeFilters.length > 0) && (
        <div className="flex items-center gap-2 px-6 py-2 border-b border-border/30 bg-muted/30">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {timeFilter !== "all" && (
            <Badge variant="secondary" className="text-xs">
              {getTimeFilterLabel(timeFilter)}
            </Badge>
          )}
          {typeFilters.map((type) => (
            <Badge key={type} variant="secondary" className="text-xs">
              {type}
            </Badge>
          ))}
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
      <div className="flex-1 overflow-auto p-6">
        {!mounted ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Clock className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No recent documents</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Documents you access will appear here
            </p>
          </div>
        ) : viewMode === "list" ? (
          <DocumentTable documents={filteredAndSortedDocuments} />
        ) : (
          <DocumentGrid documents={filteredAndSortedDocuments} />
        )}
      </div>
    </div>
  );
}
