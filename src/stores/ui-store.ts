import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
}

interface Modal {
  id: string;
  type: string;
  props?: Record<string, unknown>;
}

interface UIState {
  // Theme
  theme: "light" | "dark" | "system";
  
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  
  // Panels
  detailsPanelOpen: boolean;
  searchPanelOpen: boolean;
  
  // Modals
  modals: Modal[];
  
  // Notifications
  notifications: Notification[];
  
  // Command palette
  commandPaletteOpen: boolean;
  
  // Search
  globalSearchQuery: string;
  
  // Drag and drop
  isDragging: boolean;
  dragData: { type: string; ids: string[] } | null;
  
  // Context menu
  contextMenu: {
    x: number;
    y: number;
    type: string;
    data?: unknown;
  } | null;
}

interface UIActions {
  // Theme
  setTheme: (theme: "light" | "dark" | "system") => void;
  toggleTheme: () => void;
  
  // Sidebar
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Panels
  toggleDetailsPanel: () => void;
  setDetailsPanelOpen: (open: boolean) => void;
  toggleSearchPanel: () => void;
  setSearchPanelOpen: (open: boolean) => void;
  
  // Modals
  openModal: (modal: Omit<Modal, "id">) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  
  // Notifications
  addNotification: (notification: Omit<Notification, "id">) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Command palette
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  
  // Search
  setGlobalSearchQuery: (query: string) => void;
  
  // Drag and drop
  startDrag: (type: string, ids: string[]) => void;
  endDrag: () => void;
  
  // Context menu
  openContextMenu: (x: number, y: number, type: string, data?: unknown) => void;
  closeContextMenu: () => void;
  
  // Reset
  reset: () => void;
}

const initialState: UIState = {
  theme: "dark",
  sidebarOpen: true,
  sidebarCollapsed: false,
  detailsPanelOpen: false,
  searchPanelOpen: false,
  modals: [],
  notifications: [],
  commandPaletteOpen: false,
  globalSearchQuery: "",
  isDragging: false,
  dragData: null,
  contextMenu: null,
};

let modalIdCounter = 0;
let notificationIdCounter = 0;

export const useUIStore = create<UIState & UIActions>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // Theme
        setTheme: (theme) =>
          set((state) => {
            state.theme = theme;
          }),

        toggleTheme: () =>
          set((state) => {
            const themes: ("light" | "dark" | "system")[] = ["light", "dark", "system"];
            const currentIndex = themes.indexOf(state.theme);
            state.theme = themes[(currentIndex + 1) % themes.length];
          }),

        // Sidebar
        toggleSidebar: () =>
          set((state) => {
            state.sidebarOpen = !state.sidebarOpen;
          }),

        setSidebarOpen: (open) =>
          set((state) => {
            state.sidebarOpen = open;
          }),

        toggleSidebarCollapsed: () =>
          set((state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
          }),

        setSidebarCollapsed: (collapsed) =>
          set((state) => {
            state.sidebarCollapsed = collapsed;
          }),

        // Panels
        toggleDetailsPanel: () =>
          set((state) => {
            state.detailsPanelOpen = !state.detailsPanelOpen;
          }),

        setDetailsPanelOpen: (open) =>
          set((state) => {
            state.detailsPanelOpen = open;
          }),

        toggleSearchPanel: () =>
          set((state) => {
            state.searchPanelOpen = !state.searchPanelOpen;
          }),

        setSearchPanelOpen: (open) =>
          set((state) => {
            state.searchPanelOpen = open;
          }),

        // Modals
        openModal: (modal) => {
          const id = `modal-${++modalIdCounter}`;
          set((state) => {
            state.modals.push({ ...modal, id });
          });
          return id;
        },

        closeModal: (id) =>
          set((state) => {
            state.modals = state.modals.filter((m) => m.id !== id);
          }),

        closeAllModals: () =>
          set((state) => {
            state.modals = [];
          }),

        // Notifications
        addNotification: (notification) => {
          const id = `notification-${++notificationIdCounter}`;
          set((state) => {
            state.notifications.push({ ...notification, id });
          });
          
          // Auto-remove after duration
          const duration = notification.duration ?? 5000;
          if (duration > 0) {
            setTimeout(() => {
              get().removeNotification(id);
            }, duration);
          }
          
          return id;
        },

        removeNotification: (id) =>
          set((state) => {
            state.notifications = state.notifications.filter((n) => n.id !== id);
          }),

        clearNotifications: () =>
          set((state) => {
            state.notifications = [];
          }),

        // Command palette
        toggleCommandPalette: () =>
          set((state) => {
            state.commandPaletteOpen = !state.commandPaletteOpen;
          }),

        setCommandPaletteOpen: (open) =>
          set((state) => {
            state.commandPaletteOpen = open;
          }),

        // Search
        setGlobalSearchQuery: (query) =>
          set((state) => {
            state.globalSearchQuery = query;
          }),

        // Drag and drop
        startDrag: (type, ids) =>
          set((state) => {
            state.isDragging = true;
            state.dragData = { type, ids };
          }),

        endDrag: () =>
          set((state) => {
            state.isDragging = false;
            state.dragData = null;
          }),

        // Context menu
        openContextMenu: (x, y, type, data) =>
          set((state) => {
            state.contextMenu = { x, y, type, data };
          }),

        closeContextMenu: () =>
          set((state) => {
            state.contextMenu = null;
          }),

        // Reset
        reset: () => set(initialState),
      })),
      {
        name: "documentum-ui",
        partialize: (state) => ({
          theme: state.theme,
          sidebarCollapsed: state.sidebarCollapsed,
        }),
      }
    ),
    { name: "UIStore" }
  )
);

// Selectors
export const selectTheme = (state: UIState & UIActions) => state.theme;
export const selectSidebarOpen = (state: UIState & UIActions) => state.sidebarOpen;
export const selectSidebarCollapsed = (state: UIState & UIActions) => state.sidebarCollapsed;
export const selectDetailsPanelOpen = (state: UIState & UIActions) => state.detailsPanelOpen;
export const selectNotifications = (state: UIState & UIActions) => state.notifications;
export const selectCommandPaletteOpen = (state: UIState & UIActions) => state.commandPaletteOpen;
