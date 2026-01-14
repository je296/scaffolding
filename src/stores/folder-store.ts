import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { Folder, FolderTreeItem } from "@/schemas";

interface FolderState {
  // Data
  folders: Folder[];
  folderTree: FolderTreeItem[];
  currentFolder: Folder | null;
  currentPath: string[];
  
  // Navigation
  expandedFolders: Set<string>;
  selectedFolder: string | null;
  
  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  
  // Clipboard
  clipboardItems: { type: "copy" | "cut"; ids: string[] } | null;
}

interface FolderActions {
  // Folder CRUD
  setFolders: (folders: Folder[]) => void;
  setFolderTree: (tree: FolderTreeItem[]) => void;
  addFolder: (folder: Folder) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  removeFolder: (id: string) => void;
  
  // Navigation
  setCurrentFolder: (folder: Folder | null) => void;
  setCurrentPath: (path: string[]) => void;
  navigateToFolder: (folderId: string | null) => void;
  navigateUp: () => void;
  
  // Tree operations
  toggleFolderExpanded: (id: string) => void;
  setFolderExpanded: (id: string, expanded: boolean) => void;
  expandFolderPath: (path: string[]) => void;
  collapseAllFolders: () => void;
  selectFolder: (id: string | null) => void;
  
  // Clipboard
  copyItems: (ids: string[]) => void;
  cutItems: (ids: string[]) => void;
  clearClipboard: () => void;
  
  // Loading states
  setLoading: (loading: boolean) => void;
  setCreating: (creating: boolean) => void;
  
  // Reset
  reset: () => void;
}

const initialState: FolderState = {
  folders: [],
  folderTree: [],
  currentFolder: null,
  currentPath: [],
  expandedFolders: new Set(),
  selectedFolder: null,
  isLoading: false,
  isCreating: false,
  clipboardItems: null,
};

export const useFolderStore = create<FolderState & FolderActions>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // Folder CRUD
        setFolders: (folders) =>
          set((state) => {
            state.folders = folders;
          }),

        setFolderTree: (tree) =>
          set((state) => {
            state.folderTree = tree;
          }),

        addFolder: (folder) =>
          set((state) => {
            state.folders.push(folder);
          }),

        updateFolder: (id, updates) =>
          set((state) => {
            const index = state.folders.findIndex((f) => f.id === id);
            if (index !== -1) {
              state.folders[index] = { ...state.folders[index], ...updates };
            }
            if (state.currentFolder?.id === id) {
              state.currentFolder = { ...state.currentFolder, ...updates };
            }
          }),

        removeFolder: (id) =>
          set((state) => {
            state.folders = state.folders.filter((f) => f.id !== id);
            state.expandedFolders.delete(id);
            if (state.currentFolder?.id === id) {
              state.currentFolder = null;
            }
            if (state.selectedFolder === id) {
              state.selectedFolder = null;
            }
          }),

        // Navigation
        setCurrentFolder: (folder) =>
          set((state) => {
            state.currentFolder = folder;
          }),

        setCurrentPath: (path) =>
          set((state) => {
            state.currentPath = path;
          }),

        navigateToFolder: (folderId) => {
          const state = get();
          if (folderId === null) {
            set((s) => {
              s.currentFolder = null;
              s.currentPath = [];
              s.selectedFolder = null;
            });
          } else {
            const folder = state.folders.find((f) => f.id === folderId);
            if (folder) {
              set((s) => {
                s.currentFolder = folder;
                s.currentPath = folder.path.split("/").filter(Boolean);
                s.selectedFolder = folderId;
              });
            }
          }
        },

        navigateUp: () => {
          const state = get();
          if (state.currentFolder?.parentId) {
            get().navigateToFolder(state.currentFolder.parentId);
          } else {
            set((s) => {
              s.currentFolder = null;
              s.currentPath = [];
            });
          }
        },

        // Tree operations
        toggleFolderExpanded: (id) =>
          set((state) => {
            if (state.expandedFolders.has(id)) {
              state.expandedFolders.delete(id);
            } else {
              state.expandedFolders.add(id);
            }
          }),

        setFolderExpanded: (id, expanded) =>
          set((state) => {
            if (expanded) {
              state.expandedFolders.add(id);
            } else {
              state.expandedFolders.delete(id);
            }
          }),

        expandFolderPath: (path) =>
          set((state) => {
            path.forEach((id) => state.expandedFolders.add(id));
          }),

        collapseAllFolders: () =>
          set((state) => {
            state.expandedFolders.clear();
          }),

        selectFolder: (id) =>
          set((state) => {
            state.selectedFolder = id;
          }),

        // Clipboard
        copyItems: (ids) =>
          set((state) => {
            state.clipboardItems = { type: "copy", ids };
          }),

        cutItems: (ids) =>
          set((state) => {
            state.clipboardItems = { type: "cut", ids };
          }),

        clearClipboard: () =>
          set((state) => {
            state.clipboardItems = null;
          }),

        // Loading states
        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading;
          }),

        setCreating: (creating) =>
          set((state) => {
            state.isCreating = creating;
          }),

        // Reset
        reset: () => set(initialState),
      })),
      {
        name: "documentum-folders",
        partialize: (state) => ({
          expandedFolders: Array.from(state.expandedFolders),
        }),
        merge: (persisted, current) => ({
          ...current,
          ...(persisted as object),
          expandedFolders: new Set((persisted as { expandedFolders?: string[] })?.expandedFolders || []),
        }),
      }
    ),
    { name: "FolderStore" }
  )
);

// Selectors
export const selectFolders = (state: FolderState & FolderActions) => state.folders;
export const selectFolderTree = (state: FolderState & FolderActions) => state.folderTree;
export const selectCurrentFolder = (state: FolderState & FolderActions) => state.currentFolder;
export const selectCurrentPath = (state: FolderState & FolderActions) => state.currentPath;
export const selectExpandedFolders = (state: FolderState & FolderActions) => state.expandedFolders;
export const selectSelectedFolder = (state: FolderState & FolderActions) => state.selectedFolder;
