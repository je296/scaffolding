/**
 * Simplified user for display
 */
export interface DisplayUser {
  id: string;
  name: string;
  email: string;
}

/**
 * Base document interface for display components
 * Can be satisfied by both full Document schema and simplified UIDocument
 */
export interface DisplayDocument {
  id: string;
  name: string;
  type: "document" | "spreadsheet" | "presentation" | "image" | "video" | "audio" | "archive" | "pdf" | "other";
  size: number;
  status: "draft" | "pending_review" | "approved" | "published" | "archived" | "deleted";
  updatedAt: string;
  updatedBy: DisplayUser;
  isLocked?: boolean;
  // For table display - either owner or createdBy
  owner?: DisplayUser;
  createdBy?: DisplayUser;
  // Version can be number or string
  currentVersion?: number;
  version?: string;
}

/**
 * Simplified document type for UI components
 * This is a subset of the full Documentum Document schema,
 * optimized for display purposes
 */
export interface UIDocument extends DisplayDocument {
  mimeType: string;
  
  // Timestamps
  createdAt: string;
  accessedAt?: string;
  
  // Location
  path: string;
  
  // Flags
  isStarred?: boolean;
  
  // Metadata
  tags?: string[];
  
  // Permissions (simplified)
  permissions?: string[];
}

/**
 * Document with sharing information
 */
export interface SharedUIDocument extends UIDocument {
  sharedBy: {
    id: string;
    name: string;
    email: string;
  };
  sharedAt: string;
  sharePermission: "view" | "edit" | "comment";
  expiresAt?: string;
}
