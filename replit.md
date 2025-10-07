# AI Detector & Humanizer

## Overview

A full-stack web application that analyzes text for AI-generated content and humanizes AI-written text using DeepSeek v3 AI model via Router API. Features a modern Gen-Z style UI with glassmorphism design, gradient backgrounds, and smooth animations. The app provides two core features: AI detection (analyzing text for AI probability with confidence levels) and text humanization (rewriting AI text to appear more natural and human-like while preserving meaning).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool for fast development and optimized production builds
- Tailwind CSS for utility-first styling with custom design tokens
- Framer Motion for animations and micro-interactions
- TanStack Query for server state management and API calls
- shadcn/ui component library built on Radix UI primitives

**Design System:**
- Gen-Z aesthetic with glassmorphism effects (backdrop-blur, transparency)
- Gradient backgrounds using primary (purple) to secondary (pink) color scheme
- Neon accent colors and rounded corners throughout
- Dark theme optimized with custom CSS variables for theming
- Responsive design supporting mobile, tablet, and desktop viewports

**Component Structure:**
- Page-based routing using wouter (lightweight router)
- Reusable UI components in `/client/src/components/ui/`
- Feature components (AIDetector, Humanizer) with isolated state
- Landing page sections (Hero, Features, HowItWorks) for marketing content
- Tab-based interface for switching between detector and humanizer tools

**State Management:**
- Local component state using React hooks (useState)
- Server state managed by TanStack Query with custom apiRequest wrapper
- Form validation using Zod schemas shared between frontend and backend
- Toast notifications for user feedback via shadcn/ui toast system

### Backend Architecture

**Technology Stack:**
- Node.js with Express framework
- TypeScript for type safety across the stack
- Zod for runtime request/response validation
- CORS enabled for cross-origin requests

**API Design:**
- RESTful endpoints:
  - `POST /api/check` - AI detection analysis
  - `POST /api/humanize` - Text humanization
- Request body size limit set to 50MB to support large documents (5000+ words)
- Shared Zod schemas between frontend/backend for consistent validation
- Mock responses available in development mode when Router API is not configured

**AI Integration:**
- DeepSeek v3 accessed through Router API endpoint
- Prompts stored in `/server/scripts.ts` as reusable constants:
  - AI_CHECKER_SCRIPT: Analyzes text for AI probability with structured JSON response
  - HUMANIZER_SCRIPT: Rewrites text to appear human-written while preserving 97%+ meaning
- Dynamic prompt construction by prepending scripts to user input
- Environment-based configuration for API key and URL

**Development Features:**
- Vite integration in development mode for HMR (Hot Module Replacement)
- Static file serving from built frontend in production
- Request/response logging middleware with truncation for readability
- Runtime error overlay for development debugging

**Data Storage:**
- In-memory session storage using Map for temporary result caching
- No persistent database - user inputs not permanently stored
- Session results stored with UUID, limited to last 100 entries to prevent memory overflow
- Optional localStorage for client-side session persistence

### External Dependencies

**AI Service Integration:**
- DeepSeek v3 AI model via Router API
- Requires ROUTER_API_KEY environment variable for authentication
- Configurable ROUTER_API_URL (defaults to placeholder URL)
- Bearer token authentication for all API requests
- Graceful fallback to mock responses in development mode

**Third-Party Libraries:**
- @neondatabase/serverless - Database driver (configured but not actively used)
- Drizzle ORM - Database toolkit with PostgreSQL dialect configured
- Radix UI primitives - Accessible component foundation
- Embla Carousel - Carousel functionality
- date-fns - Date manipulation utilities
- react-hook-form with @hookform/resolvers - Form handling
- vaul - Drawer component library

**Database Configuration:**
- Drizzle ORM configured with PostgreSQL dialect
- Schema defined in `/shared/schema.ts`
- Migrations folder structure in `/migrations`
- DATABASE_URL environment variable expected (currently not used in active features)
- Connection via @neondatabase/serverless driver

**Build & Deployment:**
- Vite for frontend bundling with path aliases (@, @shared, @assets)
- esbuild for backend bundling (ESM format, Node platform)
- Environment-based configuration (NODE_ENV)
- Setup script for initial configuration collection
- HTTPS recommended for production deployment

**Development Tools:**
- @replit/vite-plugin-runtime-error-modal - Error overlay in Replit
- @replit/vite-plugin-cartographer - Replit development features
- @replit/vite-plugin-dev-banner - Development mode indicator
- TypeScript with strict mode enabled
- Incremental compilation with build info caching