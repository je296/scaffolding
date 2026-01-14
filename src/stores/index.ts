export { useDocumentStore } from "./document-store";
export { useFolderStore } from "./folder-store";
export { useUIStore } from "./ui-store";

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
