import type { Document, User } from "@/schemas";

export interface TreeFolder {
  id: string;
  name: string;
  type: "folder" | "cabinet" | "workspace";
  path: string;
  documentCount: number;
  children?: TreeFolder[];
  documents?: Document[];
  color?: string;
  icon?: string;
}

const mockUsers: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john.doe@company.com",
    avatar: undefined,
    role: "admin",
  },
  {
    id: "user-2",
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    avatar: undefined,
    role: "editor",
  },
];

function createMockDocument(
  id: string,
  name: string,
  type: Document["type"],
  folderPath: string,
  folderId: string
): Document {
  return {
    id,
    objectId: `090000018000${id}`,
    name,
    type,
    mimeType: "application/octet-stream",
    extension: name.split(".").pop() || "",
    size: Math.floor(Math.random() * 10000000) + 100000,
    status: ["draft", "approved", "published"][Math.floor(Math.random() * 3)] as Document["status"],
    metadata: {
      title: name.replace(/\.[^/.]+$/, ""),
      tags: [],
    },
    folderId,
    folderPath,
    owner: mockUsers[0],
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: mockUsers[0],
    updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedBy: mockUsers[Math.floor(Math.random() * 2)],
    currentVersion: Math.floor(Math.random() * 5) + 1,
    isLocked: Math.random() > 0.8,
    checkoutCount: Math.floor(Math.random() * 10),
    downloadCount: Math.floor(Math.random() * 100),
  };
}

export const mockFolderTree: TreeFolder[] = [
  {
    id: "cabinet-1",
    name: "Corporate Documents",
    type: "cabinet",
    path: "/Corporate Documents",
    documentCount: 156,
    color: "blue",
    children: [
      {
        id: "folder-1-1",
        name: "Executive",
        type: "folder",
        path: "/Corporate Documents/Executive",
        documentCount: 24,
        children: [
          {
            id: "folder-1-1-1",
            name: "Board Meetings",
            type: "folder",
            path: "/Corporate Documents/Executive/Board Meetings",
            documentCount: 12,
            children: [
              {
                id: "folder-1-1-1-1",
                name: "2025",
                type: "folder",
                path: "/Corporate Documents/Executive/Board Meetings/2025",
                documentCount: 6,
                children: [
                  {
                    id: "folder-1-1-1-1-1",
                    name: "Q4",
                    type: "folder",
                    path: "/Corporate Documents/Executive/Board Meetings/2025/Q4",
                    documentCount: 3,
                    documents: [
                      createMockDocument("d001", "Board Meeting Minutes - Oct.pdf", "pdf", "/Corporate Documents/Executive/Board Meetings/2025/Q4", "folder-1-1-1-1-1"),
                      createMockDocument("d002", "Board Meeting Minutes - Nov.pdf", "pdf", "/Corporate Documents/Executive/Board Meetings/2025/Q4", "folder-1-1-1-1-1"),
                      createMockDocument("d003", "Board Meeting Minutes - Dec.pdf", "pdf", "/Corporate Documents/Executive/Board Meetings/2025/Q4", "folder-1-1-1-1-1"),
                    ],
                  },
                ],
                documents: [
                  createMockDocument("d004", "Annual Board Summary.pdf", "pdf", "/Corporate Documents/Executive/Board Meetings/2025", "folder-1-1-1-1"),
                ],
              },
              {
                id: "folder-1-1-1-2",
                name: "2024",
                type: "folder",
                path: "/Corporate Documents/Executive/Board Meetings/2024",
                documentCount: 4,
                documents: [
                  createMockDocument("d005", "Q1 Board Meeting.pdf", "pdf", "/Corporate Documents/Executive/Board Meetings/2024", "folder-1-1-1-2"),
                  createMockDocument("d006", "Q2 Board Meeting.pdf", "pdf", "/Corporate Documents/Executive/Board Meetings/2024", "folder-1-1-1-2"),
                ],
              },
            ],
          },
          {
            id: "folder-1-1-2",
            name: "Strategy Documents",
            type: "folder",
            path: "/Corporate Documents/Executive/Strategy Documents",
            documentCount: 8,
            documents: [
              createMockDocument("d007", "5-Year Strategic Plan.pptx", "presentation", "/Corporate Documents/Executive/Strategy Documents", "folder-1-1-2"),
              createMockDocument("d008", "Market Analysis 2026.xlsx", "spreadsheet", "/Corporate Documents/Executive/Strategy Documents", "folder-1-1-2"),
            ],
          },
        ],
      },
      {
        id: "folder-1-2",
        name: "Finance",
        type: "folder",
        path: "/Corporate Documents/Finance",
        documentCount: 45,
        children: [
          {
            id: "folder-1-2-1",
            name: "Annual Reports",
            type: "folder",
            path: "/Corporate Documents/Finance/Annual Reports",
            documentCount: 15,
            children: [
              {
                id: "folder-1-2-1-1",
                name: "2025",
                type: "folder",
                path: "/Corporate Documents/Finance/Annual Reports/2025",
                documentCount: 5,
                documents: [
                  createMockDocument("d009", "Annual Report 2025.pdf", "pdf", "/Corporate Documents/Finance/Annual Reports/2025", "folder-1-2-1-1"),
                  createMockDocument("d010", "Financial Statements.xlsx", "spreadsheet", "/Corporate Documents/Finance/Annual Reports/2025", "folder-1-2-1-1"),
                ],
              },
            ],
          },
          {
            id: "folder-1-2-2",
            name: "Budgets",
            type: "folder",
            path: "/Corporate Documents/Finance/Budgets",
            documentCount: 12,
            documents: [
              createMockDocument("d011", "2026 Budget Proposal.xlsx", "spreadsheet", "/Corporate Documents/Finance/Budgets", "folder-1-2-2"),
            ],
          },
          {
            id: "folder-1-2-3",
            name: "Audit",
            type: "folder",
            path: "/Corporate Documents/Finance/Audit",
            documentCount: 8,
            children: [
              {
                id: "folder-1-2-3-1",
                name: "Internal Audit",
                type: "folder",
                path: "/Corporate Documents/Finance/Audit/Internal Audit",
                documentCount: 4,
                children: [
                  {
                    id: "folder-1-2-3-1-1",
                    name: "2025 Reports",
                    type: "folder",
                    path: "/Corporate Documents/Finance/Audit/Internal Audit/2025 Reports",
                    documentCount: 2,
                    documents: [
                      createMockDocument("d012", "Q3 Internal Audit.pdf", "pdf", "/Corporate Documents/Finance/Audit/Internal Audit/2025 Reports", "folder-1-2-3-1-1"),
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "folder-1-3",
        name: "Human Resources",
        type: "folder",
        path: "/Corporate Documents/Human Resources",
        documentCount: 38,
        children: [
          {
            id: "folder-1-3-1",
            name: "Policies",
            type: "folder",
            path: "/Corporate Documents/Human Resources/Policies",
            documentCount: 15,
            documents: [
              createMockDocument("d013", "Employee Handbook 2026.pdf", "pdf", "/Corporate Documents/Human Resources/Policies", "folder-1-3-1"),
              createMockDocument("d014", "Code of Conduct.pdf", "pdf", "/Corporate Documents/Human Resources/Policies", "folder-1-3-1"),
            ],
          },
          {
            id: "folder-1-3-2",
            name: "Training Materials",
            type: "folder",
            path: "/Corporate Documents/Human Resources/Training Materials",
            documentCount: 23,
            children: [
              {
                id: "folder-1-3-2-1",
                name: "Onboarding",
                type: "folder",
                path: "/Corporate Documents/Human Resources/Training Materials/Onboarding",
                documentCount: 10,
                children: [
                  {
                    id: "folder-1-3-2-1-1",
                    name: "New Hire Docs",
                    type: "folder",
                    path: "/Corporate Documents/Human Resources/Training Materials/Onboarding/New Hire Docs",
                    documentCount: 5,
                    documents: [
                      createMockDocument("d015", "Welcome Guide.pdf", "pdf", "/Corporate Documents/Human Resources/Training Materials/Onboarding/New Hire Docs", "folder-1-3-2-1-1"),
                      createMockDocument("d016", "Benefits Overview.pptx", "presentation", "/Corporate Documents/Human Resources/Training Materials/Onboarding/New Hire Docs", "folder-1-3-2-1-1"),
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "cabinet-2",
    name: "Projects",
    type: "cabinet",
    path: "/Projects",
    documentCount: 234,
    color: "green",
    children: [
      {
        id: "folder-2-1",
        name: "Active Projects",
        type: "workspace",
        path: "/Projects/Active Projects",
        documentCount: 89,
        children: [
          {
            id: "folder-2-1-1",
            name: "Project Alpha",
            type: "folder",
            path: "/Projects/Active Projects/Project Alpha",
            documentCount: 34,
            children: [
              {
                id: "folder-2-1-1-1",
                name: "Requirements",
                type: "folder",
                path: "/Projects/Active Projects/Project Alpha/Requirements",
                documentCount: 12,
                children: [
                  {
                    id: "folder-2-1-1-1-1",
                    name: "Technical Specs",
                    type: "folder",
                    path: "/Projects/Active Projects/Project Alpha/Requirements/Technical Specs",
                    documentCount: 6,
                    documents: [
                      createMockDocument("d017", "System Architecture.pdf", "pdf", "/Projects/Active Projects/Project Alpha/Requirements/Technical Specs", "folder-2-1-1-1-1"),
                      createMockDocument("d018", "API Specifications.docx", "document", "/Projects/Active Projects/Project Alpha/Requirements/Technical Specs", "folder-2-1-1-1-1"),
                      createMockDocument("d019", "Database Schema.pdf", "pdf", "/Projects/Active Projects/Project Alpha/Requirements/Technical Specs", "folder-2-1-1-1-1"),
                    ],
                  },
                ],
                documents: [
                  createMockDocument("d020", "Business Requirements.docx", "document", "/Projects/Active Projects/Project Alpha/Requirements", "folder-2-1-1-1"),
                ],
              },
              {
                id: "folder-2-1-1-2",
                name: "Design",
                type: "folder",
                path: "/Projects/Active Projects/Project Alpha/Design",
                documentCount: 8,
                documents: [
                  createMockDocument("d021", "UI Mockups.zip", "archive", "/Projects/Active Projects/Project Alpha/Design", "folder-2-1-1-2"),
                  createMockDocument("d022", "Design System.pdf", "pdf", "/Projects/Active Projects/Project Alpha/Design", "folder-2-1-1-2"),
                ],
              },
            ],
          },
          {
            id: "folder-2-1-2",
            name: "Project Beta",
            type: "folder",
            path: "/Projects/Active Projects/Project Beta",
            documentCount: 28,
            children: [
              {
                id: "folder-2-1-2-1",
                name: "Planning",
                type: "folder",
                path: "/Projects/Active Projects/Project Beta/Planning",
                documentCount: 10,
                documents: [
                  createMockDocument("d023", "Project Plan.xlsx", "spreadsheet", "/Projects/Active Projects/Project Beta/Planning", "folder-2-1-2-1"),
                  createMockDocument("d024", "Timeline.pdf", "pdf", "/Projects/Active Projects/Project Beta/Planning", "folder-2-1-2-1"),
                ],
              },
            ],
          },
        ],
      },
      {
        id: "folder-2-2",
        name: "Archived Projects",
        type: "folder",
        path: "/Projects/Archived Projects",
        documentCount: 145,
        children: [
          {
            id: "folder-2-2-1",
            name: "2024 Projects",
            type: "folder",
            path: "/Projects/Archived Projects/2024 Projects",
            documentCount: 78,
            children: [
              {
                id: "folder-2-2-1-1",
                name: "Project Gamma",
                type: "folder",
                path: "/Projects/Archived Projects/2024 Projects/Project Gamma",
                documentCount: 45,
                children: [
                  {
                    id: "folder-2-2-1-1-1",
                    name: "Final Deliverables",
                    type: "folder",
                    path: "/Projects/Archived Projects/2024 Projects/Project Gamma/Final Deliverables",
                    documentCount: 15,
                    documents: [
                      createMockDocument("d025", "Final Report.pdf", "pdf", "/Projects/Archived Projects/2024 Projects/Project Gamma/Final Deliverables", "folder-2-2-1-1-1"),
                      createMockDocument("d026", "Lessons Learned.docx", "document", "/Projects/Archived Projects/2024 Projects/Project Gamma/Final Deliverables", "folder-2-2-1-1-1"),
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "cabinet-3",
    name: "Legal",
    type: "cabinet",
    path: "/Legal",
    documentCount: 89,
    color: "red",
    children: [
      {
        id: "folder-3-1",
        name: "Contracts",
        type: "folder",
        path: "/Legal/Contracts",
        documentCount: 45,
        children: [
          {
            id: "folder-3-1-1",
            name: "Vendor Contracts",
            type: "folder",
            path: "/Legal/Contracts/Vendor Contracts",
            documentCount: 20,
            children: [
              {
                id: "folder-3-1-1-1",
                name: "Active",
                type: "folder",
                path: "/Legal/Contracts/Vendor Contracts/Active",
                documentCount: 12,
                children: [
                  {
                    id: "folder-3-1-1-1-1",
                    name: "Technology",
                    type: "folder",
                    path: "/Legal/Contracts/Vendor Contracts/Active/Technology",
                    documentCount: 5,
                    documents: [
                      createMockDocument("d027", "AWS Contract.pdf", "pdf", "/Legal/Contracts/Vendor Contracts/Active/Technology", "folder-3-1-1-1-1"),
                      createMockDocument("d028", "Microsoft EA.pdf", "pdf", "/Legal/Contracts/Vendor Contracts/Active/Technology", "folder-3-1-1-1-1"),
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "folder-3-1-2",
            name: "Client Contracts",
            type: "folder",
            path: "/Legal/Contracts/Client Contracts",
            documentCount: 25,
            documents: [
              createMockDocument("d029", "Master Services Agreement Template.docx", "document", "/Legal/Contracts/Client Contracts", "folder-3-1-2"),
            ],
          },
        ],
      },
      {
        id: "folder-3-2",
        name: "Compliance",
        type: "folder",
        path: "/Legal/Compliance",
        documentCount: 44,
        children: [
          {
            id: "folder-3-2-1",
            name: "GDPR",
            type: "folder",
            path: "/Legal/Compliance/GDPR",
            documentCount: 15,
            documents: [
              createMockDocument("d030", "GDPR Policy.pdf", "pdf", "/Legal/Compliance/GDPR", "folder-3-2-1"),
              createMockDocument("d031", "Data Processing Agreement.pdf", "pdf", "/Legal/Compliance/GDPR", "folder-3-2-1"),
            ],
          },
          {
            id: "folder-3-2-2",
            name: "SOC2",
            type: "folder",
            path: "/Legal/Compliance/SOC2",
            documentCount: 12,
            children: [
              {
                id: "folder-3-2-2-1",
                name: "Audit Reports",
                type: "folder",
                path: "/Legal/Compliance/SOC2/Audit Reports",
                documentCount: 6,
                children: [
                  {
                    id: "folder-3-2-2-1-1",
                    name: "2025",
                    type: "folder",
                    path: "/Legal/Compliance/SOC2/Audit Reports/2025",
                    documentCount: 2,
                    documents: [
                      createMockDocument("d032", "SOC2 Type II Report.pdf", "pdf", "/Legal/Compliance/SOC2/Audit Reports/2025", "folder-3-2-2-1-1"),
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "cabinet-4",
    name: "Marketing",
    type: "cabinet",
    path: "/Marketing",
    documentCount: 178,
    color: "purple",
    children: [
      {
        id: "folder-4-1",
        name: "Brand Assets",
        type: "folder",
        path: "/Marketing/Brand Assets",
        documentCount: 56,
        children: [
          {
            id: "folder-4-1-1",
            name: "Logos",
            type: "folder",
            path: "/Marketing/Brand Assets/Logos",
            documentCount: 24,
            children: [
              {
                id: "folder-4-1-1-1",
                name: "Primary",
                type: "folder",
                path: "/Marketing/Brand Assets/Logos/Primary",
                documentCount: 12,
                children: [
                  {
                    id: "folder-4-1-1-1-1",
                    name: "Vector",
                    type: "folder",
                    path: "/Marketing/Brand Assets/Logos/Primary/Vector",
                    documentCount: 4,
                    documents: [
                      createMockDocument("d033", "Logo-Primary.svg", "image", "/Marketing/Brand Assets/Logos/Primary/Vector", "folder-4-1-1-1-1"),
                      createMockDocument("d034", "Logo-White.svg", "image", "/Marketing/Brand Assets/Logos/Primary/Vector", "folder-4-1-1-1-1"),
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "folder-4-2",
        name: "Campaigns",
        type: "folder",
        path: "/Marketing/Campaigns",
        documentCount: 67,
        children: [
          {
            id: "folder-4-2-1",
            name: "2026 Campaigns",
            type: "folder",
            path: "/Marketing/Campaigns/2026 Campaigns",
            documentCount: 34,
            children: [
              {
                id: "folder-4-2-1-1",
                name: "Q1 Launch",
                type: "folder",
                path: "/Marketing/Campaigns/2026 Campaigns/Q1 Launch",
                documentCount: 18,
                children: [
                  {
                    id: "folder-4-2-1-1-1",
                    name: "Creative Assets",
                    type: "folder",
                    path: "/Marketing/Campaigns/2026 Campaigns/Q1 Launch/Creative Assets",
                    documentCount: 10,
                    documents: [
                      createMockDocument("d035", "Campaign Brief.pdf", "pdf", "/Marketing/Campaigns/2026 Campaigns/Q1 Launch/Creative Assets", "folder-4-2-1-1-1"),
                      createMockDocument("d036", "Banner Designs.zip", "archive", "/Marketing/Campaigns/2026 Campaigns/Q1 Launch/Creative Assets", "folder-4-2-1-1-1"),
                      createMockDocument("d037", "Social Media Kit.zip", "archive", "/Marketing/Campaigns/2026 Campaigns/Q1 Launch/Creative Assets", "folder-4-2-1-1-1"),
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

// Helper to flatten tree for search
export function flattenTree(folders: TreeFolder[], result: TreeFolder[] = []): TreeFolder[] {
  for (const folder of folders) {
    result.push(folder);
    if (folder.children) {
      flattenTree(folder.children, result);
    }
  }
  return result;
}

// Helper to find folder by ID
export function findFolderById(folders: TreeFolder[], id: string): TreeFolder | undefined {
  for (const folder of folders) {
    if (folder.id === id) return folder;
    if (folder.children) {
      const found = findFolderById(folder.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

// Helper to get breadcrumb path
export function getBreadcrumbPath(folders: TreeFolder[], targetId: string): TreeFolder[] {
  const path: TreeFolder[] = [];
  
  function search(items: TreeFolder[], currentPath: TreeFolder[]): boolean {
    for (const folder of items) {
      const newPath = [...currentPath, folder];
      if (folder.id === targetId) {
        path.push(...newPath);
        return true;
      }
      if (folder.children && search(folder.children, newPath)) {
        return true;
      }
    }
    return false;
  }
  
  search(folders, []);
  return path;
}
