# Creative Research Writer

## Overview

Creative Research Writer is an AI-native web application designed to assist researchers in writing academic papers through intelligent brainstorming and feedback. The application provides a dual-mode interface: a **Brainstorming Mode** for ideation and hypothesis development through conversational AI, and a **Feedback Mode** for section-by-section writing with real-time quality assessment and actionable suggestions.

The application features a modern, minimalist dark-mode-first interface with a three-column resizable layout, allowing users to manage reference papers, view auto-generated summaries, write content, and receive contextual feedback all in one integrated workspace.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Language**
- Built with React 18+ using TypeScript for type safety
- Vite as the build tool and development server for fast HMR (Hot Module Replacement)
- Wouter for lightweight client-side routing

**UI Component System**
- Shadcn UI component library (New York variant) with Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Component-driven architecture with modular, reusable components
- Dark mode first with CSS variables for theming
- Inter font for clean typography, Lucide React for iconography

**State Management & Data Fetching**
- TanStack Query (React Query) for server state management
- Local component state using React hooks
- Optimistic updates and automatic cache invalidation
- Polling for real-time updates (chat messages with 2-second refetch interval)

**Layout System**
- Three-column responsive layout using react-resizable-panels
- Fixed header with mode toggle (Brainstorming/Feedback)
- Left sidebar: Reference papers + auto-summary panel (resizable, 15-30% width)
- Main content area: Mode-dependent workspace (fluid, minimum 30% width)
- Right sidebar: Context-aware tips/feedback panel (resizable, 20-35% width)

### Backend Architecture

**Server Framework**
- Express.js with TypeScript
- ESM (ES Modules) throughout the codebase
- Custom middleware for request logging and JSON parsing
- Vite integration for development mode with HMR

**Data Layer**
- Drizzle ORM configured for PostgreSQL
- Schema-first approach with Zod validation
- In-memory storage implementation (MemStorage) for development
- Designed to be swappable with database-backed storage

**API Design**
- RESTful API endpoints following resource-based conventions
- Type-safe request/response with shared schema definitions
- Endpoints for references, chat messages, feedback, quality scores, and section content
- Mock AI responses with randomized delays to simulate LLM interactions

**Key Endpoints**
- `GET/POST /api/references` - Manage reference papers
- `GET/POST /api/chat/messages` - Brainstorming chat interface
- `GET /api/feedback` - Retrieve feedback items
- `GET /api/quality-scores` - Get quality metrics
- `GET/POST /api/section/:section` - Section content management

### External Dependencies

**UI Libraries**
- @radix-ui/* - Headless UI primitives (20+ component packages)
- Tailwind CSS - Utility-first CSS framework
- class-variance-authority & clsx - Variant and className utilities
- lucide-react - Icon library
- embla-carousel-react - Carousel component
- react-day-picker - Calendar/date picker
- cmdk - Command menu component

**Data & Validation**
- @tanstack/react-query - Server state management
- drizzle-orm & drizzle-zod - ORM and schema validation
- zod - Runtime type validation
- react-hook-form & @hookform/resolvers - Form management

**Database**
- @neondatabase/serverless - PostgreSQL driver
- Drizzle Kit for migrations and schema management
- PostgreSQL dialect configured (migrations in `./migrations`)

**Development Tools**
- Vite with React plugin
- @replit/vite-plugin-* - Replit-specific development enhancements
- TypeScript with strict mode enabled
- Path aliases configured (`@/`, `@shared/`, `@assets/`)

**Session & Storage**
- connect-pg-simple - PostgreSQL session store (for future authentication)
- date-fns - Date manipulation utilities

**Build & Runtime**
- esbuild - Production bundler for server code
- tsx - TypeScript execution for development
- Node.js HTTP server for production deployment

### Design Patterns

**Component Composition**
- Atomic design principles with reusable UI components
- Compound component pattern for complex UI elements
- Render props and children composition for flexibility

**Type Safety**
- Shared schema definitions between client and server (`shared/schema.ts`)
- Zod schemas for runtime validation and TypeScript inference
- Drizzle's type inference for database operations

**Error Handling**
- Custom error boundaries for React components
- HTTP status code-based error responses
- Toast notifications for user feedback

**Development Experience**
- Hot module replacement in development
- Runtime error overlay via Replit plugin
- Request/response logging with duration tracking
- TypeScript path aliases for clean imports