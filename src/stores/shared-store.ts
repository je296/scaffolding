import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type SharedSortBy = "sharedAt" | "name" | "sharedBy";
export type PermissionFilter = "all" | "view" | "edit" | "comment";

interface SharedState {
  sortBy: SharedSortBy;
  permissionFilter: PermissionFilter;
  sharedByFilters: string[];
}

interface SharedActions {
  setSortBy: (sortBy: SharedSortBy) => void;
  setPermissionFilter: (filter: PermissionFilter) => void;
  setSharedByFilters: (ids: string[]) => void;
  addSharedByFilter: (id: string) => void;
  removeSharedByFilter: (id: string) => void;
  clearFilters: () => void;
}

const initialState: SharedState = {
  sortBy: "sharedAt",
  permissionFilter: "all",
  sharedByFilters: [],
};

export const useSharedStore = create<SharedState & SharedActions>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        setSortBy: (sortBy) =>
          set((state) => {
            state.sortBy = sortBy;
          }),

        setPermissionFilter: (filter) =>
          set((state) => {
            state.permissionFilter = filter;
          }),

        setSharedByFilters: (ids) =>
          set((state) => {
            state.sharedByFilters = ids;
          }),

        addSharedByFilter: (id) =>
          set((state) => {
            if (!state.sharedByFilters.includes(id)) {
              state.sharedByFilters.push(id);
            }
          }),

        removeSharedByFilter: (id) =>
          set((state) => {
            state.sharedByFilters = state.sharedByFilters.filter((i) => i !== id);
          }),

        clearFilters: () =>
          set((state) => {
            state.permissionFilter = "all";
            state.sharedByFilters = [];
          }),
      })),
      {
        name: "shared-storage",
        partialize: (state) => ({
          sortBy: state.sortBy,
          permissionFilter: state.permissionFilter,
          sharedByFilters: state.sharedByFilters,
        }),
      }
    ),
    { name: "SharedStore" }
  )
);

// Selectors
export const selectSharedSortBy = (state: SharedState) => state.sortBy;
export const selectPermissionFilter = (state: SharedState) => state.permissionFilter;
export const selectSharedByFilters = (state: SharedState) => state.sharedByFilters;
