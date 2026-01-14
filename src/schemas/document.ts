import { z } from "zod";

/**
 * Document status enum
 */
export const DocumentStatusSchema = z.enum([
  "draft",
  "pending_review",
  "approved",
  "published",
  "archived",
  "deleted",
]);

export type DocumentStatus = z.infer<typeof DocumentStatusSchema>;

/**
 * Document type enum
 */
export const DocumentTypeSchema = z.enum([
  "document",
  "spreadsheet",
  "presentation",
  "image",
  "video",
  "audio",
  "archive",
  "pdf",
  "other",
]);

export type DocumentType = z.infer<typeof DocumentTypeSchema>;

/**
 * Permission level enum
 */
export const PermissionLevelSchema = z.enum([
  "none",
  "read",
  "write",
  "delete",
  "admin",
]);

export type PermissionLevel = z.infer<typeof PermissionLevelSchema>;

/**
 * User schema for document ownership and permissions
 */
export const UserSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  email: z.email(),
  avatar: z.url().optional(),
  role: z.enum(["viewer", "editor", "admin", "superadmin"]),
});

export type User = z.infer<typeof UserSchema>;

/**
 * Document permission schema
 */
export const DocumentPermissionSchema = z.object({
  userId: z.uuid(),
  user: UserSchema.optional(),
  level: PermissionLevelSchema,
  grantedAt: z.iso.datetime(),
  grantedBy: z.uuid(),
});

export type DocumentPermission = z.infer<typeof DocumentPermissionSchema>;

/**
 * Document version schema
 */
export const DocumentVersionSchema = z.object({
  id: z.uuid(),
  version: z.number().int().positive(),
  label: z.string().optional(),
  createdAt: z.iso.datetime(),
  createdBy: UserSchema,
  size: z.number().int().nonnegative(),
  checksum: z.string(),
  comment: z.string().optional(),
});

export type DocumentVersion = z.infer<typeof DocumentVersionSchema>;

/**
 * Document metadata schema
 */
export const DocumentMetadataSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
  customFields: z.record(z.string(), z.unknown()).optional(),
});

export type DocumentMetadata = z.infer<typeof DocumentMetadataSchema>;

/**
 * Core document schema
 */
export const DocumentSchema = z.object({
  id: z.uuid(),
  objectId: z.string(), // Documentum r_object_id equivalent
  name: z.string().min(1).max(255),
  type: DocumentTypeSchema,
  mimeType: z.string(),
  extension: z.string(),
  size: z.number().int().nonnegative(),
  status: DocumentStatusSchema,
  metadata: DocumentMetadataSchema,
  
  // Location
  folderId: z.uuid(),
  folderPath: z.string(),
  
  // Ownership
  owner: UserSchema,
  createdAt: z.iso.datetime(),
  createdBy: UserSchema,
  updatedAt: z.iso.datetime(),
  updatedBy: UserSchema,
  
  // Versioning
  currentVersion: z.number().int().positive(),
  versions: z.array(DocumentVersionSchema).optional(),
  isLocked: z.boolean().default(false),
  lockedBy: UserSchema.optional(),
  lockedAt: z.iso.datetime().optional(),
  
  // Permissions
  permissions: z.array(DocumentPermissionSchema).optional(),
  
  // Audit
  checkoutCount: z.number().int().nonnegative().default(0),
  downloadCount: z.number().int().nonnegative().default(0),
});

export type Document = z.infer<typeof DocumentSchema>;

/**
 * Create document input schema
 */
export const CreateDocumentSchema = z.object({
  name: z.string().min(1).max(255),
  folderId: z.uuid(),
  metadata: DocumentMetadataSchema.partial().optional(),
  file: z.instanceof(File).optional(),
});

export type CreateDocumentInput = z.infer<typeof CreateDocumentSchema>;

/**
 * Update document input schema
 */
export const UpdateDocumentSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  status: DocumentStatusSchema.optional(),
  metadata: DocumentMetadataSchema.partial().optional(),
});

export type UpdateDocumentInput = z.infer<typeof UpdateDocumentSchema>;

/**
 * Document search/filter schema
 */
export const DocumentFilterSchema = z.object({
  query: z.string().optional(),
  type: z.array(DocumentTypeSchema).optional(),
  status: z.array(DocumentStatusSchema).optional(),
  folderId: z.uuid().optional(),
  ownerId: z.uuid().optional(),
  tags: z.array(z.string()).optional(),
  createdAfter: z.iso.datetime().optional(),
  createdBefore: z.iso.datetime().optional(),
  updatedAfter: z.iso.datetime().optional(),
  updatedBefore: z.iso.datetime().optional(),
  minSize: z.number().int().nonnegative().optional(),
  maxSize: z.number().int().nonnegative().optional(),
});

export type DocumentFilter = z.infer<typeof DocumentFilterSchema>;

/**
 * Pagination schema
 */
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
  sortBy: z.string().default("updatedAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type Pagination = z.infer<typeof PaginationSchema>;

/**
 * Paginated response schema
 */
export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    totalPages: z.number().int().nonnegative(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  });
