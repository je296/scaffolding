// Document schemas
export {
  DocumentStatusSchema,
  DocumentTypeSchema,
  PermissionLevelSchema,
  UserSchema,
  DocumentPermissionSchema,
  DocumentVersionSchema,
  DocumentMetadataSchema,
  DocumentSchema,
  CreateDocumentSchema,
  UpdateDocumentSchema,
  DocumentFilterSchema,
  PaginationSchema,
  PaginatedResponseSchema,
} from "./document";

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
} from "./document";

// Folder schemas
export {
  FolderTypeSchema,
  FolderPermissionSchema,
  FolderSchema,
  CreateFolderSchema,
  UpdateFolderSchema,
  FolderTreeItemSchema,
} from "./folder";

export type {
  FolderType,
  FolderPermission,
  Folder,
  CreateFolderInput,
  UpdateFolderInput,
  FolderTreeItem,
} from "./folder";
