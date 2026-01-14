import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { Document, DocumentFilter, Pagination } from "@/schemas";

interface DocumentState {
  // Data
  documents: Document[];
  selectedDocuments: Set<string>;
  currentDocument: Document | null;
  
  // Filters & Pagination
  filter: DocumentFilter;
  pagination: Pagination;
  totalCount: number;
  
  // Loading states
  isLoading: boolean;
  isUploading: boolean;
  uploadProgress: number;
  
  // View state
  viewMode: "grid" | "list" | "table";
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface DocumentActions {
  // Document CRUD
  setDocuments: (documents: Document[]) => void;
  addDocument: (document: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  removeDocument: (id: string) => void;
  removeDocuments: (ids: string[]) => void;
  
  // Selection
  selectDocument: (id: string) => void;
  deselectDocument: (id: string) => void;
  toggleDocumentSelection: (id: string) => void;
  selectAllDocuments: () => void;
  deselectAllDocuments: () => void;
  setCurrentDocument: (document: Document | null) => void;
  
  // Filters
  setFilter: (filter: Partial<DocumentFilter>) => void;
  clearFilters: () => void;
  
  // Pagination
  setPagination: (pagination: Partial<Pagination>) => void;
  setTotalCount: (count: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  
  // Loading states
  setLoading: (loading: boolean) => void;
  setUploading: (uploading: boolean) => void;
  setUploadProgress: (progress: number) => void;
  
  // View state
  setViewMode: (mode: "grid" | "list" | "table") => void;
  setSorting: (sortBy: string, sortOrder: "asc" | "desc") => void;
  
  // Reset
  reset: () => void;
}

const initialState: DocumentState = {
  documents: [],
  selectedDocuments: new Set(),
  currentDocument: null,
  filter: {},
  pagination: {
    page: 1,
    pageSize: 20,
    sortBy: "updatedAt",
    sortOrder: "desc",
  },
  totalCount: 0,
  isLoading: false,
  isUploading: false,
  uploadProgress: 0,
  viewMode: "grid",
  sortBy: "updatedAt",
  sortOrder: "desc",
};

export const useDocumentStore = create<DocumentState & DocumentActions>()(
  devtools(
    persist(
      immer((set, _get) => ({
        ...initialState,

        // Document CRUD
        setDocuments: (documents) =>
          set((state) => {
            state.documents = documents;
          }),

        addDocument: (document) =>
          set((state) => {
            state.documents.unshift(document);
          }),

        updateDocument: (id, updates) =>
          set((state) => {
            const index = state.documents.findIndex((d) => d.id === id);
            if (index !== -1) {
              state.documents[index] = { ...state.documents[index], ...updates };
            }
            if (state.currentDocument?.id === id) {
              state.currentDocument = { ...state.currentDocument, ...updates };
            }
          }),

        removeDocument: (id) =>
          set((state) => {
            state.documents = state.documents.filter((d) => d.id !== id);
            state.selectedDocuments.delete(id);
            if (state.currentDocument?.id === id) {
              state.currentDocument = null;
            }
          }),

        removeDocuments: (ids) =>
          set((state) => {
            state.documents = state.documents.filter((d) => !ids.includes(d.id));
            ids.forEach((id) => state.selectedDocuments.delete(id));
            if (state.currentDocument && ids.includes(state.currentDocument.id)) {
              state.currentDocument = null;
            }
          }),

        // Selection
        selectDocument: (id) =>
          set((state) => {
            state.selectedDocuments.add(id);
          }),

        deselectDocument: (id) =>
          set((state) => {
            state.selectedDocuments.delete(id);
          }),

        toggleDocumentSelection: (id) =>
          set((state) => {
            if (state.selectedDocuments.has(id)) {
              state.selectedDocuments.delete(id);
            } else {
              state.selectedDocuments.add(id);
            }
          }),

        selectAllDocuments: () =>
          set((state) => {
            state.documents.forEach((d) => state.selectedDocuments.add(d.id));
          }),

        deselectAllDocuments: () =>
          set((state) => {
            state.selectedDocuments.clear();
          }),

        setCurrentDocument: (document) =>
          set((state) => {
            state.currentDocument = document;
          }),

        // Filters
        setFilter: (filter) =>
          set((state) => {
            state.filter = { ...state.filter, ...filter };
            state.pagination.page = 1; // Reset to first page on filter change
          }),

        clearFilters: () =>
          set((state) => {
            state.filter = {};
            state.pagination.page = 1;
          }),

        // Pagination
        setPagination: (pagination) =>
          set((state) => {
            state.pagination = { ...state.pagination, ...pagination };
          }),

        setTotalCount: (count) =>
          set((state) => {
            state.totalCount = count;
          }),

        nextPage: () =>
          set((state) => {
            const totalPages = Math.ceil(state.totalCount / state.pagination.pageSize);
            if (state.pagination.page < totalPages) {
              state.pagination.page += 1;
            }
          }),

        prevPage: () =>
          set((state) => {
            if (state.pagination.page > 1) {
              state.pagination.page -= 1;
            }
          }),

        goToPage: (page) =>
          set((state) => {
            const totalPages = Math.ceil(state.totalCount / state.pagination.pageSize);
            if (page >= 1 && page <= totalPages) {
              state.pagination.page = page;
            }
          }),

        // Loading states
        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading;
          }),

        setUploading: (uploading) =>
          set((state) => {
            state.isUploading = uploading;
            if (!uploading) {
              state.uploadProgress = 0;
            }
          }),

        setUploadProgress: (progress) =>
          set((state) => {
            state.uploadProgress = progress;
          }),

        // View state
        setViewMode: (mode) =>
          set((state) => {
            state.viewMode = mode;
          }),

        setSorting: (sortBy, sortOrder) =>
          set((state) => {
            state.sortBy = sortBy;
            state.sortOrder = sortOrder;
            state.pagination.sortBy = sortBy;
            state.pagination.sortOrder = sortOrder;
          }),

        // Reset
        reset: () => set(initialState),
      })),
      {
        name: "documentum-documents",
        partialize: (state) => ({
          viewMode: state.viewMode,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder,
          pagination: { pageSize: state.pagination.pageSize },
        }),
      }
    ),
    { name: "DocumentStore" }
  )
);

// Selectors
export const selectDocuments = (state: DocumentState & DocumentActions) => state.documents;
export const selectSelectedDocuments = (state: DocumentState & DocumentActions) => state.selectedDocuments;
export const selectCurrentDocument = (state: DocumentState & DocumentActions) => state.currentDocument;
export const selectIsLoading = (state: DocumentState & DocumentActions) => state.isLoading;
export const selectViewMode = (state: DocumentState & DocumentActions) => state.viewMode;
export const selectFilter = (state: DocumentState & DocumentActions) => state.filter;
export const selectPagination = (state: DocumentState & DocumentActions) => state.pagination;
