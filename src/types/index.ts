// Re-export all types from schemas for convenience
export type {
  DocumentStatus,
  DocumentType,
  PermissionLevel,
  User,
  DocumentPermission,
  DocumentVersion,
  DocumentMetadata,
  Document,
  CreateDocumentInput,
  UpdateDocumentInput,
  DocumentFilter,
  Pagination,
  FolderType,
  FolderPermission,
  Folder,
  CreateFolderInput,
  UpdateFolderInput,
  FolderTreeItem,
} from "@/schemas";

// Re-export UI-specific types
export type { UIDocument, SharedUIDocument } from "./ui-document";
