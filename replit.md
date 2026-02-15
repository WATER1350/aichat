# Chatbox Community Edition

## Overview

Chatbox is a cross-platform desktop AI chat client that supports multiple AI model providers (OpenAI, Anthropic/Claude, Google, Azure, Mistral, Perplexity, and more). It's built as an Electron app with a React frontend, and also targets web and mobile (iOS/Android via Capacitor). The app features multi-session chat management, a knowledge base with RAG (Retrieval-Augmented Generation), MCP (Model Context Protocol) integration, web search capabilities, and team sharing functionality. Licensed under GPLv3.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (Renderer Process)
- **Framework**: React with TypeScript
- **Routing**: TanStack Router with file-based route generation (`src/renderer/routes/`)
- **State Management**: Jotai atoms (`src/renderer/stores/atoms/`) and Zustand stores (`src/renderer/stores/`)
- **UI Libraries**: Mantine UI components + Tailwind CSS for utility styling + Emotion for CSS-in-JS
- **Styling**: Custom CSS variable-based theming system with dark/light mode support (see `tailwind.config.js` for the `chatbox-*` design tokens)
- **Build**: Webpack with ts-loader, using Electron Renderer Boilerplate (`.erb/`) configuration structure
- **Path alias**: `@/*` maps to `./src/renderer/*`

### Backend (Main Process)
- **Runtime**: Electron main process (Node.js)
- **IPC**: Electron IPC for renderer↔main communication. The preload script (`src/main/preload.ts`) exposes a typed `electronAPI` interface
- **Storage**: electron-store for config/settings files, IndexedDB (via localforage) for sessions on desktop, SQLite for mobile. See `docs/storage.md` for the full cross-platform storage strategy
- **Knowledge Base / RAG**: LibSQL vector database (`@mastra/libsql`) stored at `userData/databases/chatbox_kb.db`. File processing pipeline: upload → parse → chunk → embed → vector store. Supports office docs, text, images (with vision OCR), and epub files
- **File Parsing**: Custom parsers for office files (officeparser), epub, and text files with charset detection

### AI Model Integration
- **SDK**: Vercel AI SDK (`@ai-sdk/openai`, `@ai-sdk/anthropic`, `@ai-sdk/google`, etc.)
- **Provider Pattern**: Abstract provider base with OpenAI-compatible extension. Each provider lives in `src/shared/models/`. New providers follow the pattern documented in `docs/adding-provider.md`
- **Model Types**: Chat models and embedding models. Provider settings stored per-provider in the settings object
- **Reranking**: Cohere integration for RAG reranking (`src/shared/models/rerank.ts`)

### Cross-Platform Targets
- **Desktop**: Electron (Windows, macOS, Linux) — primary target
- **Web**: Same renderer bundle served statically (build with `npm run build:web`)
- **Mobile**: Capacitor wrapping the web build for iOS and Android (`capacitor.config.ts`)
- **Build Platform Detection**: `CHATBOX_BUILD_PLATFORM` and `CHATBOX_BUILD_TARGET` environment variables control platform-specific code paths

### Project Structure
```
src/
├── main/           # Electron main process
│   ├── main.ts     # Entry point, window management, IPC handlers
│   ├── preload.ts  # Context bridge for renderer
│   ├── store-node.ts  # Config persistence with auto-backup
│   ├── knowledge-base/ # RAG system (db, file loaders, IPC handlers)
│   ├── mcp/        # Model Context Protocol integration
│   └── adapters/   # Platform adapters (sentry, model deps)
├── renderer/       # React frontend
│   ├── index.tsx   # App entry, initialization sequence
│   ├── routes/     # TanStack file-based routes
│   ├── stores/     # State management (Jotai + Zustand)
│   ├── components/ # Shared UI components
│   ├── platform/   # Platform abstraction layer
│   └── setup/      # Initialization (sentry, GA, polyfills)
├── shared/         # Code shared between main and renderer
│   ├── types.ts    # Core type definitions
│   ├── models/     # AI provider implementations
│   ├── defaults.ts # Default settings values
│   └── request/    # HTTP request utilities
```

### Build System
- **Bundler**: Webpack configured via `.erb/configs/` (Electron React Boilerplate pattern)
- **Separate builds**: Main process (`webpack.config.main.prod.ts`) and renderer (`webpack.config.renderer.prod.ts`)
- **DLL optimization**: Development DLLs for faster rebuilds
- **Code obfuscation**: webpack-obfuscator for production main process builds
- **Testing**: Vitest with node environment, path aliases matching webpack config

### Data Migration
- Config versioning system with automatic migration between storage backends (see `docs/storage.md`)
- Current config version: 12-13
- Desktop: file storage for configs, IndexedDB for sessions
- Mobile: SQLite for everything

### Error Handling
- React Error Boundaries wrapping the app and route levels
- Global window error and unhandled rejection handlers
- Sentry integration for both main and renderer processes (behind `allowReportingAndTracking` setting)
- Custom `SentryAdapter` abstraction for cross-process error reporting

### Deep Links
- Custom protocol: `chatbox://` for MCP server installation and provider import
- Handled in `src/main/deeplinks.ts`

## External Dependencies

### AI Provider SDKs
- `@ai-sdk/openai`, `@ai-sdk/anthropic`, `@ai-sdk/google`, `@ai-sdk/azure`, `@ai-sdk/mistral`, `@ai-sdk/perplexity` — Vercel AI SDK provider packages
- `@ai-sdk/openai-compatible` — Generic OpenAI-compatible provider adapter
- `@ai-sdk/mcp` — Model Context Protocol integration
- `cohere-ai` — Cohere client for reranking in RAG pipeline

### RAG / Knowledge Base
- `@mastra/core`, `@mastra/rag`, `@mastra/libsql` — RAG framework with LibSQL vector store
- `@libsql/client` — LibSQL database client (native dependency, installed in `release/app/`)
- `officeparser` — Office document parsing (PDF, DOCX, PPTX, XLSX)
- `epub` — EPUB file parsing
- `chardet`, `iconv-lite` — Character encoding detection and conversion

### Mobile
- `@capacitor/core`, `@capacitor/android`, `@capacitor/ios` — Capacitor for mobile builds
- Various Capacitor plugins: filesystem, keyboard, browser, share, toast, splash-screen, device, sqlite

### Monitoring & Analytics
- `@sentry/react`, `@sentry/node` — Error tracking (renderer and main process)
- Google Analytics 4 via Measurement Protocol (`src/main/analystic-node.ts`)

### Desktop
- `electron`, `electron-updater` — Desktop app framework with auto-update
- `electron-store` — Persistent config storage
- `auto-launch` — OS auto-launch on boot

### UI Framework
- `@mantine/core`, `@mantine/form`, `@mantine/hooks`, `@mantine/modals`, `@mantine/spotlight` — Component library
- `@mui/material` — Used selectively (e.g., SwipeableDrawer)
- `@dnd-kit/*` — Drag-and-drop for session reordering
- `@tabler/icons-react` — Icon library
- `@emotion/react`, `@emotion/styled` — CSS-in-JS
- `tailwindcss` — Utility CSS

### State & Routing
- `jotai` — Atomic state management
- `@tanstack/react-router` — File-based routing with code generation
- `@tanstack/react-query` — Server state management
- `@ebay/nice-modal-react` — Modal management

### Build Tools
- `webpack` — Bundler (configured via Electron React Boilerplate)
- `typescript`, `ts-loader` — TypeScript compilation
- `biome` — Linting and formatting (primary tool, replacing ESLint for most checks)
- `vitest` — Test runner
- `electron-builder` — Packaging and distribution