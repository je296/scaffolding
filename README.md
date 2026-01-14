# Documentum - Enterprise Document Management System

A modern, feature-rich document management system scaffold built with Next.js 16, featuring a beautiful dark-themed UI inspired by enterprise content management systems like OpenText Documentum.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-black)

## Features

- 🎨 **Modern Dark Theme** - Sophisticated cyan-accented dark UI
- 📁 **Document Management** - Grid, list, and table views
- 🗂️ **Folder Navigation** - Collapsible sidebar tree structure
- 🔍 **Global Search** - Command palette (⌘K) for quick navigation
- 📤 **File Upload** - Drag & drop with progress tracking
- 🔐 **Type-Safe Environment** - t3-env for validated env variables
- 📊 **State Management** - Zustand with persistence
- ✅ **Schema Validation** - Zod schemas for all data types

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Validation**: [Zod](https://zod.dev/)
- **Environment**: [@t3-oss/env-nextjs](https://env.t3.gg/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+

### Installation

```bash
# Install dependencies
bun install

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
bun run build
bun run start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css         # Global styles & theme
│   ├── layout.tsx          # Root layout with providers
│   └── page.tsx            # Home page
├── components/
│   ├── documents/          # Document-related components
│   │   ├── document-card.tsx
│   │   ├── document-grid.tsx
│   │   ├── document-table.tsx
│   │   └── upload-dialog.tsx
│   ├── layout/             # Layout components
│   │   ├── app-sidebar.tsx
│   │   ├── command-palette.tsx
│   │   └── header.tsx
│   ├── providers/          # Context providers
│   │   └── theme-provider.tsx
│   └── ui/                 # shadcn/ui components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities & mock data
│   ├── mock-data.ts
│   └── utils.ts
├── schemas/                # Zod validation schemas
│   ├── document.ts
│   ├── folder.ts
│   └── index.ts
├── stores/                 # Zustand state stores
│   ├── document-store.ts
│   ├── folder-store.ts
│   ├── ui-store.ts
│   └── index.ts
├── types/                  # TypeScript type exports
│   └── index.ts
└── env.ts                  # t3-env configuration
```

## Environment Variables

Copy the example environment file and configure:

```bash
cp .env.example .env.local
```

Available variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment mode | No |
| `DOCUMENTUM_API_URL` | Backend API URL | No |
| `DOCUMENTUM_API_KEY` | API authentication key | No |
| `DATABASE_URL` | Database connection string | No |
| `NEXT_PUBLIC_APP_URL` | Public application URL | No |
| `NEXT_PUBLIC_APP_NAME` | Application display name | No |

## Key Features

### Document Cards
Documents are displayed with file type-specific icons and colors:
- 📄 Documents (blue)
- 📊 Spreadsheets (green)
- 📽️ Presentations (orange)
- 🖼️ Images (pink)
- 🎬 Videos (purple)
- 🎵 Audio (violet)
- 📦 Archives (amber)
- 📕 PDFs (red)

### View Modes
Toggle between three view modes using the header toolbar:
- **Grid View**: Card-based layout with previews
- **List View**: Compact horizontal rows
- **Table View**: Full data table with sorting

### Command Palette
Press `⌘K` (or `Ctrl+K`) to open the command palette for:
- Quick navigation between pages
- Creating new documents/folders
- Uploading files
- Toggling theme

### State Persistence
Zustand stores persist user preferences:
- View mode preference
- Sorting preferences
- Expanded folders
- Theme selection

## Customization

### Theme Colors
Edit `src/app/globals.css` to customize the color scheme. The theme uses OKLCH color space for better color manipulation.

### Adding Components
Use the shadcn/ui CLI to add more components:

```bash
bunx shadcn@latest add [component-name]
```

### Extending Schemas
Add new Zod schemas in `src/schemas/` for API validation and TypeScript type inference.

## Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint |

## License

MIT License - feel free to use this scaffold for your projects.

---

Built with ❤️ using Next.js and shadcn/ui
# scaffolding
