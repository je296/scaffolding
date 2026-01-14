export { useDocumentStore } from "./document-store";
export { useFolderStore } from "./folder-store";
export { useUIStore } from "./ui-store";
export { useRecentStore } from "./recent-store";
export { useSharedStore } from "./shared-store";

// Re-export types
export type { TimeFilter, RecentSortBy } from "./recent-store";
export type { SharedSortBy, PermissionFilter } from "./shared-store";

// Re-export selectors
export {
  selectDocuments,
  selectSelectedDocuments,
  selectCurrentDocument,
  selectIsLoading,
  selectViewMode,
  selectFilter,
  selectPagination,
} from "./document-store";

export {
  selectFolders,
  selectFolderTree,
  selectCurrentFolder,
  selectCurrentPath,
  selectExpandedFolders,
  selectSelectedFolder,
} from "./folder-store";

export {
  selectTheme,
  selectSidebarOpen,
  selectSidebarCollapsed,
  selectDetailsPanelOpen,
  selectNotifications,
  selectCommandPaletteOpen,
} from "./ui-store";

export {
  selectTimeFilter,
  selectRecentSortBy,
  selectTypeFilters,
} from "./recent-store";

export {
  selectSharedSortBy,
  selectPermissionFilter,
  selectSharedByFilters,
} from "./shared-store";
