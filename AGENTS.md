# AGENTS.md: AI Collaboration Guide

This document provides essential context for AI models interacting with this project. Adhering to these guidelines will ensure consistency and maintain code quality.

## 1. Project Overview & Purpose

* **Primary Goal:** ViuWi is a comprehensive business intelligence and management platform that provides real-time insights and management tools for business operations. It serves as a unified dashboard for managing customers, products, orders, customer service interactions, payments, and analytics.
* **Business Domain:** Business Management & CRM - A complete business operations platform with features for customer relationship management, inventory management, order processing, customer service handover, knowledge base management, and business analytics.

## 2. Core Technologies & Stack

* **Languages:** TypeScript (primary), JavaScript
* **Framework:** Next.js 15.4.6 (App Router)
* **Runtime:** React 19.1.0
* **Styling:** Tailwind CSS 4 + DaisyUI 5.0.50 (Apple-style design with rounded-2xl corners)
* **State Management:** Zustand 5.0.7 (multiple domain-specific stores)
* **Key Libraries/Dependencies:** 
  - `lucide-react` (icons)
  - `papaparse` & `xlsx` (CSV/Excel import/export)
  - `date-fns` (date manipulation)
  - `lodash-es` (utilities)
  - `@lottiefiles/dotlottie-react` (animations)
* **Package Manager:** pnpm (with workspace configuration)
* **Platforms:** Web (responsive design for mobile, tablet, desktop)

## 3. Architectural Patterns

* **Overall Architecture:** Feature-based modular architecture with domain-driven design. Each business domain (customers, products, orders, etc.) has its own components, stores, and utilities organized in dedicated folders.
* **Directory Structure Philosophy:**
  * `/src/app`: Next.js App Router pages with file-based routing
  * `/src/components`: Feature-organized React components (auth, dashboard, customerManagement, etc.)
  * `/src/stores`: Zustand stores for state management (one per domain)
  * `/src/hooks`: Custom React hooks for data aggregation and business logic
  * `/src/utils`: Utility functions and helpers
  * `/src/types`: TypeScript type definitions
  * `/src/lib`: Shared libraries and configurations
  * `/docs`: Comprehensive project documentation
* **Module Organization:** Components are organized by feature/domain rather than by type, promoting cohesion and maintainability.

## 4. Coding Conventions & Style Guide

* **Formatting:** Follows Next.js/React conventions with ESLint and Prettier. Uses 2-space indentation.
* **Naming Conventions:**
  * Components: PascalCase (`CustomerTable`, `DashboardCard`)
  * Files: PascalCase for components (`CustomerTable.tsx`), camelCase for utilities (`routeMapping.ts`)
  * Variables/Functions: camelCase (`customerData`, `handleSubmit`)
  * Constants: SCREAMING_SNAKE_CASE (`MAX_ITEMS_PER_PAGE`)
  * CSS Classes: Follow DaisyUI + Tailwind conventions
* **API Design:**
  * **Style:** Functional React with hooks, component composition over inheritance
  * **Abstraction:** Domain-specific stores abstract business logic from UI components
  * **Extensibility:** Feature-based architecture allows easy addition of new business domains
  * **Trade-offs:** Prioritizes developer experience and maintainability over micro-optimizations
* **Common Patterns & Idioms:**
  * **State Management:** Zustand stores with domain separation (`useCustomerStore`, `useOrderStore`)
  * **Component Patterns:** Compound components, render props, and custom hooks for reusability
  * **Styling:** DaisyUI semantic classes with Apple-style rounded corners (`rounded-2xl`)
  * **Data Flow:** Stores → Custom Hooks → Components → UI
  * **Type Safety:** Comprehensive TypeScript usage with strict type checking
* **Error Handling:** React Error Boundaries for component-level errors, try-catch in async operations, user-friendly error messages with toast notifications.

## 5. Key Files & Entrypoints

* **Main Entrypoint:** `src/app/page.tsx` (landing page), `src/app/dashboard/page.tsx` (main app)
* **Configuration:** 
  - `next.config.ts` (Next.js configuration)
  - `tailwind.config.ts` (Tailwind + DaisyUI configuration)
  - `tsconfig.json` (TypeScript configuration)
  - `eslint.config.mjs` (ESLint configuration)
* **CI/CD Pipeline:** Not currently configured (future enhancement)

## 6. Development & Testing Workflow

* **Local Development Environment:**
  1. **Install Dependencies:** `pnpm install`
  2. **Start Development Server:** `pnpm dev` (runs on http://localhost:3000)
  3. **Build for Production:** `pnpm build`
  4. **Start Production Server:** `pnpm start`
  5. **Lint Code:** `pnpm lint`

* **Task Configuration:**
  * **Development:** `pnpm dev` - Starts Next.js development server with Turbopack
  * **Build:** `pnpm build` - Creates production build
  * **Production:** `pnpm start` - Starts production server
  * **Linting:** `pnpm lint` - Runs ESLint checks

* **Testing:** 
  - Jest and React Testing Library configured for unit/integration tests
  - Test files should be placed in `__tests__` directories or use `.test.tsx` suffix
  - Run tests with `pnpm test` (when test script is added)

* **CI/CD Process:** Currently manual deployment. Future plans include automated testing and deployment pipelines.

## 7. Specific Instructions for AI Collaboration

* **Contribution Guidelines:**
  - Follow the established feature-based architecture
  - Use TypeScript for all new code with proper type definitions
  - Follow DaisyUI + Tailwind styling patterns with Apple-style rounded corners
  - Implement proper error handling and loading states
  - Use Zustand stores for state management, create new stores for new domains
  - Write comprehensive documentation for new features

* **Security:** 
  - Never hardcode API keys or sensitive data
  - Use environment variables for configuration
  - Implement proper input validation and sanitization
  - Follow React security best practices for XSS prevention

* **Dependencies:** 
  - Use `pnpm add <package>` to add new dependencies
  - Prefer established, well-maintained packages
  - Update `pnpm-lock.yaml` when adding dependencies
  - Consider bundle size impact for client-side packages

* **Commit Messages:** 
  - Use conventional commit format: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`
  - Be descriptive about changes made
  - Reference issue numbers when applicable

## 8. Business Domain Context

* **Core Features:**
  - **Customer Management** (`/pelanggan`): CRM functionality with customer profiles, search, and filtering
  - **Product Catalog** (`/katalogproduk`): Inventory management with CSV/Excel import, categories, and status tracking
  - **Order Management** (`/pesanan`): Order processing, status tracking, and multi-product orders
  - **CS Handover** (`/cshandover`): Customer service conversation management and handover functionality
  - **Knowledge Base** (`/knowledgebase`): Document and content management for customer service
  - **Payments** (`/pembayaran`): Payment processing and configuration
  - **Analytics** (`/laporan-analitik`): Business intelligence and reporting
  - **Dashboard** (`/dashboard`): Unified view of all business metrics and quick actions

* **User Journey:** Landing Page → Authentication → Onboarding → Dashboard → Feature Pages
* **Authentication Flow:** Complete auth system with registration, login, password reset, and email verification
* **Onboarding:** 4-step guided setup for new users including business profile and WhatsApp integration

## 9. UI/UX Guidelines

* **Design System:** DaisyUI semantic components with custom brand colors and Apple-style aesthetics
* **Responsive Design:** Mobile-first approach with breakpoints for tablet and desktop
* **Accessibility:** WCAG compliance with proper ARIA labels, keyboard navigation, and screen reader support
* **Theme Support:** Light/dark theme toggle with consistent color schemes
* **Loading States:** Skeleton loading, progress indicators, and error boundaries for better UX

This guide ensures consistent development practices and helps maintain the high quality and cohesive architecture of the ViuWi platform.
