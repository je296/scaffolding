import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type TimeFilter = "today" | "week" | "month" | "all";
export type RecentSortBy = "accessedAt" | "modifiedAt" | "name";

interface RecentState {
  timeFilter: TimeFilter;
  sortBy: RecentSortBy;
  typeFilters: string[];
}

interface RecentActions {
  setTimeFilter: (filter: TimeFilter) => void;
  setSortBy: (sortBy: RecentSortBy) => void;
  setTypeFilters: (types: string[]) => void;
  addTypeFilter: (type: string) => void;
  removeTypeFilter: (type: string) => void;
  clearFilters: () => void;
}

const initialState: RecentState = {
  timeFilter: "all",
  sortBy: "accessedAt",
  typeFilters: [],
};

export const useRecentStore = create<RecentState & RecentActions>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        setTimeFilter: (filter) =>
          set((state) => {
            state.timeFilter = filter;
          }),

        setSortBy: (sortBy) =>
          set((state) => {
            state.sortBy = sortBy;
          }),

        setTypeFilters: (types) =>
          set((state) => {
            state.typeFilters = types;
          }),

        addTypeFilter: (type) =>
          set((state) => {
            if (!state.typeFilters.includes(type)) {
              state.typeFilters.push(type);
            }
          }),

        removeTypeFilter: (type) =>
          set((state) => {
            state.typeFilters = state.typeFilters.filter((t) => t !== type);
          }),

        clearFilters: () =>
          set((state) => {
            state.timeFilter = "all";
            state.typeFilters = [];
          }),
      })),
      {
        name: "recent-storage",
        partialize: (state) => ({
          timeFilter: state.timeFilter,
          sortBy: state.sortBy,
          typeFilters: state.typeFilters,
        }),
      }
    ),
    { name: "RecentStore" }
  )
);

// Selectors
export const selectTimeFilter = (state: RecentState) => state.timeFilter;
export const selectRecentSortBy = (state: RecentState) => state.sortBy;
export const selectTypeFilters = (state: RecentState) => state.typeFilters;
