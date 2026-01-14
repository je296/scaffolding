import { z } from "zod";
import { UserSchema, PermissionLevelSchema } from "./document";

/**
 * Folder type enum
 */
export const FolderTypeSchema = z.enum([
  "folder",
  "cabinet",
  "workspace",
  "project",
]);

export type FolderType = z.infer<typeof FolderTypeSchema>;

/**
 * Folder permission schema
 */
export const FolderPermissionSchema = z.object({
  userId: z.uuid(),
  user: UserSchema.optional(),
  level: PermissionLevelSchema,
  inherited: z.boolean().default(false),
  grantedAt: z.iso.datetime(),
  grantedBy: z.uuid(),
});

export type FolderPermission = z.infer<typeof FolderPermissionSchema>;

/**
 * Core folder schema
 */
export const FolderSchema = z.object({
  id: z.uuid(),
  objectId: z.string(), // Documentum r_object_id equivalent
  name: z.string().min(1).max(255),
  type: FolderTypeSchema,
  description: z.string().max(2000).optional(),
  
  // Hierarchy
  parentId: z.uuid().nullable(),
  path: z.string(),
  depth: z.number().int().nonnegative(),
  
  // Ownership
  owner: UserSchema,
  createdAt: z.iso.datetime(),
  createdBy: UserSchema,
  updatedAt: z.iso.datetime(),
  updatedBy: UserSchema,
  
  // Content stats
  documentCount: z.number().int().nonnegative().default(0),
  folderCount: z.number().int().nonnegative().default(0),
  totalSize: z.number().int().nonnegative().default(0),
  
  // Permissions
  permissions: z.array(FolderPermissionSchema).optional(),
  inheritPermissions: z.boolean().default(true),
  
  // UI state
  isExpanded: z.boolean().default(false),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export type Folder = z.infer<typeof FolderSchema>;

/**
 * Create folder input schema
 */
export const CreateFolderSchema = z.object({
  name: z.string().min(1).max(255),
  parentId: z.uuid().nullable(),
  type: FolderTypeSchema.default("folder"),
  description: z.string().max(2000).optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export type CreateFolderInput = z.infer<typeof CreateFolderSchema>;

/**
 * Update folder input schema
 */
export const UpdateFolderSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export type UpdateFolderInput = z.infer<typeof UpdateFolderSchema>;

/**
 * Folder tree item (for navigation)
 */
export const FolderTreeItemSchema: z.ZodType<FolderTreeItem> = z.lazy(() =>
  z.object({
    id: z.uuid(),
    name: z.string(),
    type: FolderTypeSchema,
    path: z.string(),
    depth: z.number().int().nonnegative(),
    documentCount: z.number().int().nonnegative(),
    folderCount: z.number().int().nonnegative(),
    isExpanded: z.boolean(),
    children: z.array(FolderTreeItemSchema).optional(),
    color: z.string().optional(),
    icon: z.string().optional(),
  })
);

export type FolderTreeItem = {
  id: string;
  name: string;
  type: FolderType;
  path: string;
  depth: number;
  documentCount: number;
  folderCount: number;
  isExpanded: boolean;
  children?: FolderTreeItem[];
  color?: string;
  icon?: string;
};
