# RefactKit 🚀 — Multi-Tenant SaaS Boilerplate

![Edition](https://img.shields.io/badge/edition-Community-10b981?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![React](https://img.shields.io/badge/React-19-blue?logo=react&style=flat-square)
![Framework](https://img.shields.io/badge/TanStack-Start-orange?style=flat-square)
![Engine](https://img.shields.io/badge/Nitro-v3-green?style=flat-square)
![Auth](https://img.shields.io/badge/Better--Auth-1.6+-purple?style=flat-square)
![DB](https://img.shields.io/badge/Drizzle-ORM-yellow?style=flat-square)
![Deploy](https://img.shields.io/badge/Vercel-Ready-black?logo=vercel&style=flat-square)

> **RefactKit** is a production-ready, high-performance SaaS foundation for building multi-tenant applications. It ships with authentication, organizations, RBAC, internationalization, and a premium design system — all wired together with end-to-end type safety.

> [!NOTE]
> **RefactKit Community Edition** — free and open-source under the MIT license. Build with it, learn from it, share what you create. Contributions, bug reports, and showcases are warmly welcome. 🙌

---

**Table of Contents**

- [🌟 Introduction](#-introduction)
- [🚀 Quick Start](#-quick-start)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Architecture](#️-architecture)
- [🔒 Authentication & Security](#-authentication--security)
- [👥 Roles & RBAC](#-roles--rbac)
- [💻 Frontend Architecture](#-frontend-architecture)
- [⚙️ Backend Architecture](#️-backend-architecture)
- [🗄️ Database & Schema](#️-database--schema)
- [🌐 Internationalization](#-internationalization)
- [📝 Forms & Design System](#-forms--design-system)
- [🧪 DevOps, Observability & Testing](#-devops-observability--testing)
- [💳 Payments & Billing (Pro)](#-payments--billing-pro)
- [🤖 AI-Assisted Development](#-ai-assisted-development)
- [📄 License](#-license)

---

## 🌟 Introduction

**RefactKit** is designed for developers building B2B platforms, B2C SaaS products, or internal tools that require workspace isolation. Every piece of data flows through an organization context, making tenant separation a first-class architectural concern rather than an afterthought.

### Core Philosophy

| Principle | How It's Enforced |
|---|---|
| **Multi-tenancy First** | Every data table includes `organizationId`. Server functions validate tenant membership before any query. |
| **Type-Safety Everywhere** | TypeScript strict mode, Drizzle typed SQL, Zod runtime validation, TanStack typed routes. |
| **Accessible by Default** | Base UI primitives ensure WAI-ARIA compliance. Semantic color tokens prevent hardcoded values. |
| **OWASP-Compliant Security** | Anti-enumeration, rate limiting, JWE-encrypted sessions, audit logging — all built in. |
| **Universal Deployment** | Nitro v3 engine targets Vercel, Cloudflare, Node.js, and AWS with a single build. |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+
- **pnpm** (recommended) — `npm install -g pnpm`
- **Supabase** account with a PostgreSQL project
- **Resend** account for transactional emails

### 1. Clone & Install

```bash
git clone https://github.com/your-org/refactkit-multitenancy.git
cd refactkit-multitenancy
pnpm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"
BETTER_AUTH_SECRET="your-32-char-secret"
BETTER_AUTH_URL="http://localhost:3000"
RESEND_API_KEY="re_..."
VITE_SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
```

### 3. Database Setup

```bash
# Push schema to Supabase
npx drizzle-kit push

# (Optional) Open visual database browser
npx drizzle-kit studio
```

### 4. Supabase Storage

Run in the Supabase SQL Editor:
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');
```

### 5. Launch

```bash
pnpm dev    # → http://localhost:3000
```

---
## 🛠️ Tech Stack

### Core Framework
- **Runtime**: Node.js 22+  
- **Build/Server**: Nitro v3  
- **UI Framework**: React 19  
- **Type System**: TypeScript 5.x  

### Authentication
- **Identity Provider**: Better Auth (self-hosted)  
- **Database Adapter**: Supabase PostgreSQL  
- **Session Storage**: Encrypted cookies (JWE)  

### Data Layer
- **Database**: PostgreSQL (Supabase)  
- **ORM/Query Builder**: Drizzle ORM  
- **Storage**: Supabase Storage (S3-compatible)  

### Forms & State Management
- **Form Builder**: TanStack Form  
- **Validation**: Zod + Superforms  
- **Client State**: TanStack Query  

### UI Components
- **Base Primitives**: Base UI (Google)  
- **Icon System**: Heroicons +lucide-react  
- **Design Tokens**: CSS variables via `@theme`  

### Routing & Navigation
- **Type-Safe Router**: TanStack Router  

### Infrastructure & DevOps
- **Deployment**: Vercel (primary), Cloudflare, Node.js, AWS  
- **Package Manager**: pnpm  
- **Code Quality**: Biome (lint/format)  
- **Testing**: Vitest (unit), Playwright (E2E)  

## 🏗️ Architecture

### High-Level Design (HLD)

```mermaid
graph TB
    subgraph Client["Client — Browser"]
        UI["React 19 UI"]
        Router["TanStack Router"]
        Query["TanStack Query Cache"]
        Form["TanStack Form"]
    end

    subgraph Server["Server — Nitro v3"]
        SSR["SSR / Hydration"]
        SF["Server Functions<br/>(createServerFn)"]
        Auth["Better Auth<br/>Middleware"]
        Email["Resend<br/>Email Service"]
    end

    subgraph Data["Data Layer"]
        DB["PostgreSQL<br/>(Supabase)"]
        S3["Supabase Storage<br/>(S3-compatible)"]
        ORM["Drizzle ORM"]
    end

    UI --> Router
    Router --> Query
    Query --> SF
    Form --> SF
    SF --> Auth
    Auth --> ORM
    ORM --> DB
    SF --> S3
    Auth --> Email
    SSR --> SF
    SSR --> UI
```

### Low-Level Design (LLD) — Module Interaction

```mermaid
graph LR
    subgraph Routes["src/routes/"]
        AuthRoutes["_auth/<br/>login, signup,<br/>forgot-password"]
        AppRoutes["_app/<br/>dashboard, settings"]
        OrgRoutes["$slug/<br/>dashboard, members,<br/>gallery, settings"]
    end

    subgraph ServerFns["src/server/"]
        AuthFns["auth-fns.ts"]
        OrgFns["org-fns.ts"]
        DashFns["dashboard-fns.ts"]
        StorageFns["storage-fns.ts"]
        GalleryFns["gallery-fns.ts"]
        QueryKeys["query-keys.ts"]
    end

    subgraph Core["lib/"]
        AuthConfig["auth.ts<br/>(Better Auth config)"]
        AuthClient["auth-client.ts<br/>(Browser client)"]
        EmailLib["email.ts<br/>(Resend)"]
        EnvLib["env.ts"]
    end

    subgraph DB["db/"]
        Schema["schema.ts"]
        DBConn["index.ts<br/>(postgres.js pool)"]
    end

    AuthRoutes --> AuthFns
    AppRoutes --> OrgFns
    OrgRoutes --> DashFns & GalleryFns & StorageFns
    OrgFns --> AuthConfig
    AuthFns --> AuthConfig
    AuthConfig --> EmailLib
    AuthConfig --> DBConn
    OrgFns --> DBConn
    DashFns --> DBConn
    DBConn --> Schema
```

### Request Lifecycle — SSR + Hydration Flow

```mermaid
sequenceDiagram
    participant B as Browser
    participant N as Nitro v3 (SSR)
    participant R as TanStack Router
    participant SF as Server Function
    participant BA as Better Auth
    participant DB as PostgreSQL

    B->>N: GET /organizations/acme/dashboard
    N->>R: Match route → _app/$slug/dashboard
    R->>R: beforeLoad → check session
    R->>SF: loader → getOrgBySlug("acme")
    SF->>BA: getSession(headers)
    BA->>DB: SELECT session WHERE token = ?
    DB-->>BA: Session { userId, activeOrgId }
    BA-->>SF: Authenticated ✅
    SF->>DB: SELECT org WHERE slug = "acme"
    SF->>DB: SELECT member WHERE orgId AND userId
    DB-->>SF: Org data + role
    SF-->>R: { org, role }
    R->>R: ensureQueryData → seed cache
    N-->>B: Full HTML + dehydrated query cache
    B->>B: Hydrate → React 19 takes over
    B->>B: TanStack Query uses cached data (no refetch)
```

### Folder Structure

```
RefactKit-multitenancy/
├── db/
│   ├── schema.ts              # Single source of truth — all tables & relations
│   └── index.ts               # postgres.js connection pool (Supabase pooler)
├── lib/
│   ├── auth.ts                # Better Auth config (RBAC, rate limiting, hooks)
│   ├── auth-client.ts         # Browser auth client (organizationClient plugin)
│   ├── email.ts               # Resend transactional email service
│   ├── env.ts                 # Environment variable helpers
│   └── supabase.ts            # Supabase client for storage
├── src/
│   ├── components/
│   │   ├── dashboard/         # Sidebar, Navbar, Breadcrumbs
│   │   ├── settings/          # Account, Security, Appearance tabs
│   │   ├── shared/            # Header, AuthShell, shared UI
│   │   ├── landing/           # Landing page components
│   │   └── ui/                # Base UI primitives (Button, Input, Dialog...)
│   ├── hooks/                 # useFont, useTheme
│   ├── i18n/
│   │   ├── context.tsx        # React context provider
│   │   ├── index.ts           # Locale detection & cookie management
│   │   └── locales/           # en, fr, es, pt, ar translations
│   ├── routes/
│   │   ├── __root.tsx         # Root layout (providers, meta, fonts)
│   │   ├── index.tsx          # Landing page
│   │   ├── _auth/             # Public: login, signup, forgot/reset-password
│   │   ├── _app/              # Protected: dashboard shell, settings
│   │   │   └── organizations/
│   │   │       └── $slug/     # Org workspace: dashboard, members, gallery, settings
│   │   ├── api/auth/          # Better Auth API route handler
│   │   ├── onboarding.tsx     # First-time org creation
│   │   └── accept-invite.tsx  # Invitation acceptance flow
│   ├── server/
│   │   ├── auth-fns.ts        # Session helpers
│   │   ├── org-fns.ts         # CRUD organizations + membership checks
│   │   ├── dashboard-fns.ts   # Org statistics
│   │   ├── gallery-fns.ts     # Gallery CRUD
│   │   ├── storage-fns.ts     # Supabase file upload (server-only)
│   │   └── query-keys.ts      # TanStack Query option factories
│   └── styles/
│       └── globals.css        # Tailwind v4, CSS variables, font imports
├── e2e/                       # Playwright E2E test scenarios
├── vite.config.ts             # Vite + TanStack Start + Nitro + Tailwind
├── drizzle.config.ts          # Drizzle Kit configuration
├── playwright.config.ts       # Playwright multi-browser config
├── biome.json                 # Biome linter/formatter config
└── package.json               # Scripts, dependencies
```

---



| Layer | Technology | Version | Role in Architecture |
|---|---|---|---|
| **Meta-Framework** | TanStack Start | latest | Full-stack React framework. Provides SSR, file-based routing, server functions, and hydration via Nitro v3. |
| **Server Engine** | Nitro v3 | 3.0.x-beta | Universal deployment engine. Powers SSR, server functions, and API routes. Single build targets Vercel, Cloudflare, Node.js. |
| **UI Framework** | React | 19.2+ | Core UI library. Uses React 19 features: Server Functions, Actions, `use` hook. |
| **Router** | TanStack Router | latest | Type-safe file-based routing with `beforeLoad` guards, loaders, search params validation, and code splitting. |
| **Data Fetching** | TanStack Query | 5.x | Server-state synchronization. `queryOptions` factory pattern, `ensureQueryData` for SSR cache seeding, automatic background refetching. |
| **Forms** | TanStack Form | 1.x | Type-safe form state management with Zod validators, field-level error tracking, and submit state. |
| **Tables** | TanStack Table | 8.x | Headless table engine for members list, gallery grid, and data tables. |
| **Authentication** | Better Auth | 1.6+ | Full auth system: email/password, OAuth (Google), organizations, RBAC, rate limiting, session management, OWASP compliance. |
| **ORM** | Drizzle ORM | 0.45+ | Type-safe SQL query builder. Schema-as-code with `pgTable`, relational queries, zero-overhead. |
| **Database** | Supabase (PostgreSQL) | — | Managed PostgreSQL with connection pooling (port 6543), Row Level Security, and dashboard for visual data management. |
| **Storage** | Supabase Storage | — | S3-compatible object storage for avatars, logos, gallery images. Server-only uploads via service role key. |
| **Styling** | Tailwind CSS | v4 | Utility-first CSS with CSS variables, `@theme` directives, and ultra-fast Vite plugin compilation. |
| **UI Primitives** | Base UI + Shadcn | 1.4+ / 4.5+ | Accessible component primitives (WAI-ARIA). Shadcn CLI for component scaffolding with Base UI backend. |
| **Emails** | Resend | — | Transactional email API for verification, password reset, invitations, and security alerts. |
| **i18n** | Custom (i18next-based) | — | 5 languages (EN, FR, ES, PT, AR). RTL support. Cookie-based locale persistence. Server-side locale detection. |
| **Icons** | Lucide React | 0.545+ | Consistent, tree-shakeable icon set. |
| **Animations** | Framer Motion | 12.x | Smooth page transitions and micro-interactions. |
| **Validation** | Zod | 4.x | Runtime type validation for server functions, form inputs, and search params. |
| **Code Quality** | Biome | 2.4+ | Rust-based linter + formatter. Replaces ESLint + Prettier with 10x speed. |
| **Unit Tests** | Vitest | 4.x | Fast unit/integration testing with JSDOM, React Testing Library, and v8 coverage. |
| **E2E Tests** | Playwright | 1.59+ | Cross-browser E2E testing (Chromium, Firefox, WebKit). Auto-starts dev server. |
| **Build** | Vite | 8.x | Next-gen build tool. Plugins: TanStack Start, React, Tailwind CSS, Nitro. |

### ⚠️ Dependency Coupling Warnings

> [!WARNING]
> **TanStack Start + Nitro v3**: These are tightly coupled. The `nitro` package is pinned to `3.0.x-beta`. Do **not** blindly run `pnpm update` on `@tanstack/react-start`, `@tanstack/react-router`, or `nitro` — version mismatches crash the SSR server.

> [!WARNING]
> **Better Auth (v1.6+)**: Updates often introduce new DB columns (especially for the `organization` plugin). Always check the changelog and run `npx drizzle-kit push` after updating.

> [!CAUTION]
> **React 19**: This boilerplate uses React 19 features (Server Functions, Actions). Do not install legacy UI libraries requiring React 18, and never downgrade the core `react` packages.

---

## 🔒 Authentication & Security

RefactKit uses **Better Auth** with a hardened, OWASP-compliant configuration. Authentication and organization state are tightly coupled — users can **never** access data outside their workspace.

### Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant BA as Better Auth
    participant DB as Database
    participant E as Resend Email

    Note over U,E: Sign-Up Flow
    U->>C: Fill signup form
    C->>BA: signUp.email({ name, email, password })
    BA->>DB: Check if email exists
    alt New User
        BA->>DB: INSERT user + account (scrypt hash)
        BA->>E: Send verification email
        BA-->>C: 200 OK { user }
        C-->>U: "Check your inbox" screen
    else Existing User (anti-enumeration)
        BA->>E: Send "someone tried to sign up" alert
        BA-->>C: 200 OK (identical response)
        C-->>U: Same "Check your inbox" screen
    end

    Note over U,E: Sign-In Flow
    U->>C: Fill login form
    C->>BA: signIn.email({ email, password })
    BA->>DB: Verify credentials (scrypt)
    BA->>DB: CREATE session token
    BA-->>C: Set-Cookie: session_token (HttpOnly, Secure, SameSite=Lax)
    C-->>U: Redirect to dashboard

    Note over U,E: Subsequent Requests
    C->>BA: Request with cookie
    BA->>BA: Check JWE cookie cache (5 min TTL)
    alt Cache Hit
        BA-->>C: Session from encrypted cache ⚡
    else Cache Miss
        BA->>DB: SELECT session WHERE token = ?
        BA-->>C: Refresh cache + return session
    end
```

### OWASP Security Checklist

Every item below is implemented in `lib/auth.ts`:

| # | OWASP Control | Implementation | Config |
|---|---|---|---|
| 1 | **Account Enumeration Prevention** | Signup returns identical 200 for new + existing emails. `onExistingUserSignUp` notifies real owner. | `requireEmailVerification: true` |
| 2 | **Brute Force Protection** | Rate limiting on all auth endpoints, persisted in DB (survives serverless restarts). | `rateLimit: { storage: 'database' }` |
| 3 | **Rate Limit Rules** | Sign-in: 5/min, Sign-up: 3/min, Forgot-password: 3/min. | `customRules: { ... }` |
| 4 | **Encrypted Session Cache** | JWE (AES-256-GCM) encrypted cookie cache eliminates DB queries for 5 min windows. | `cookieCache: { strategy: 'jwe' }` |
| 5 | **Password Policy** | Min 12 chars, max 128 chars (prevents bcrypt DoS). | `minPasswordLength / maxPasswordLength` |
| 6 | **Session Revocation** | All sessions revoked on password reset. | `revokeSessionsOnPasswordReset: true` |
| 7 | **Reset Token Expiry** | Tokens expire in 30 minutes (default was 1 hour). Single-use. | `resetPasswordTokenExpiresIn: 60 * 30` |
| 8 | **Audit Logging** | `databaseHooks` log session creation and email changes. | `databaseHooks: { session, user }` |
| 9 | **Proxy IP Tracking** | Reads real client IP from `x-forwarded-for` (Vercel proxy). | `ipAddress.ipAddressHeaders` |
| 10 | **CSRF Protection** | Multi-layer: origin validation, Fetch Metadata, first-login protection. | Default enabled |
| 11 | **Generic Error Messages** | Login/forgot-password never reveal if email exists. | Client: `toast.error(l.error)` |
| 12 | **Background Task Safety** | Email sending uses `waitUntil` to prevent timing attacks. | `backgroundTasks.handler` |

### Key Security Files

| File | Purpose |
|---|---|
| `lib/auth.ts` | Server-side Better Auth configuration with all OWASP controls |
| `lib/auth-client.ts` | Browser client with `organizationClient()` + `sentinelClient()` plugins |
| `src/routes/_auth/signup.tsx` | Anti-enumeration safe signup (same UI for new + existing emails) |
| `src/routes/_auth/login.tsx` | Generic error messages only |
| `src/routes/_auth/forgot-password.tsx` | Always shows "check inbox" regardless of email existence |

---

## 👥 Roles & RBAC

RefactKit uses Better Auth's `createAccessControl` with a granular resource→action permission model.

### Permission Matrix

| Resource → Action | Member | Admin | Owner |
|---|:---:|:---:|:---:|
| `dashboard:read` | ✅ | ✅ | ✅ |
| `member:read` | — | ✅ | ✅ |
| `member:create` | — | ✅ | ✅ |
| `member:update` | — | ✅ | ✅ |
| `member:delete` | — | — | ✅ |
| `invitation:read` | — | ✅ | ✅ |
| `invitation:create` | — | ✅ | ✅ |
| `invitation:update` | — | — | ✅ |
| `invitation:delete` | — | ✅ | ✅ |
| `organization:update` | — | — | ✅ |
| `organization:delete` | — | — | ✅ |

### Role Hierarchy

```mermaid
graph TB
    Owner["🔑 Owner<br/>Full control over org,<br/>members, invitations,<br/>settings, deletion"]
    Admin["🛡️ Admin<br/>Manage members (non-owners),<br/>send invitations,<br/>read dashboard"]
    Member["👤 Member<br/>View dashboard only.<br/>No management access."]

    Owner --> Admin --> Member
```

### How RBAC Is Enforced

1. **Server-side** (`lib/auth.ts`): `createAccessControl` defines resources and actions. Roles are assigned via `ac.newRole()`.
2. **Membership check** (`src/server/org-fns.ts`): Every server function queries `member` table to verify the user belongs to the organization and has the required role.
3. **Route guards** (`_app/route.tsx`): `beforeLoad` verifies session existence before rendering any protected route.
4. **Owner protection**: Better Auth prevents removing the last owner. Ownership must be transferred first.

### Adding a New Permission Resource

```typescript
// 1. Add to access control (lib/auth.ts)
const ac = createAccessControl({
  dashboard: ['read'],
  member: ['read', 'create', 'update', 'delete'],
  billing: ['read', 'manage'],  // ← NEW
})

// 2. Assign to roles
const adminRole = ac.newRole({
  billing: ['read'],  // Admin can view billing
})
const ownerRole = ac.newRole({
  billing: ['read', 'manage'],  // Owner can manage billing
})

// 3. Check in server functions
const { data } = await authClient.organization.hasPermission({
  permission: 'billing:manage',
})
```

---

## 💻 Frontend Architecture

### TanStack Router — File-Based Routing

Routes are organized by access level using layout route prefixes:

| Prefix | Access | Layout | Purpose |
|---|---|---|---|
| `_auth/` | Public | `AuthShell` | Login, signup, password flows |
| `_app/` | Protected | Dashboard shell (sidebar + navbar) | Organization workspace |
| `$slug/` | Protected + org-scoped | Inherits `_app` | Org-specific pages (dashboard, members, gallery) |

**Route protection** happens in `_app/route.tsx` via `beforeLoad`:

```typescript
export const Route = createFileRoute('/_app')({
  beforeLoad: async ({ context }) => {
    const session = await getSession({ headers: getRequest().headers })
    if (!session) throw redirect({ to: '/login' })
    return { session }
  },
  component: AppLayout,
})
```

### TanStack Query — Data Fetching Strategy

RefactKit uses a **query options factory pattern** (`src/server/query-keys.ts`) to ensure consistent cache keys across SSR and client:

```typescript
// Define once
export const orgBySlugQuery = (slug: string) =>
  queryOptions({
    queryKey: ['org', slug] as const,
    queryFn: () => getOrgBySlug({ data: { slug } }),
  })

// Use in route loader (SSR)
loader: async ({ context, params }) => {
  await context.queryClient.ensureQueryData(orgBySlugQuery(params.slug))
}

// Use in component (client)
const { data } = useQuery(orgBySlugQuery(slug))
// → No refetch! Data is already in cache from SSR.
```

**Caching configuration** (`src/router.tsx`):

| Setting | Value | Effect |
|---|---|---|
| `staleTime` | 30 seconds | Queries won't refetch for 30s after becoming stale |
| `defaultPreloadStaleTime` | 30 seconds | Preloaded data stays fresh during navigation |
| `scrollRestoration` | `true` | Scroll position restored on back navigation |
| `defaultPreload` | `'intent'` | Routes preload on hover/focus intent |

### Creating a New Page

**Step 1** — Create the route file:
```typescript
// src/routes/_app/organizations/$slug/my-page.tsx
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/_app/organizations/$slug/my-page')({
  component: MyPage,
  loader: async ({ context, params }) => {
    // Seed cache for SSR — no client-side refetch needed
    await context.queryClient.ensureQueryData(myDataQuery(params.slug))
  },
})

function MyPage() {
  const { slug } = Route.useParams()
  const { data } = useQuery(myDataQuery(slug))
  return <div>{/* Your UI */}</div>
}
```

**Step 2** — Create the server function:
```typescript
// src/server/my-fns.ts
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { z } from 'zod'
import { db } from '../../db/index'
import { auth } from '../../lib/auth'

export const getMyData = createServerFn({ method: 'GET' }).handler(async ({ data }) => {
  const { slug } = z.object({ slug: z.string() }).parse(data)
  const request = getRequest()
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) throw new Error('Unauthorized')
  // ... your query logic
})
```

**Step 3** — Create the query option:
```typescript
// src/server/query-keys.ts
export const myDataQuery = (slug: string) =>
  queryOptions({
    queryKey: ['my-data', slug] as const,
    queryFn: () => getMyData({ data: { slug } }),
  })
```

### Reactivity Best Practices

| Pattern | Rule |
|---|---|
| **Stable Keys** | Never use array indexes. Always use `key={item.id}`. |
| **Org Switch Reset** | Use `key={org.id}` on the page container to reset state on org change. |
| **Derived State** | For images: `const currentImg = uploadedImg \|\| defaultValue` to avoid flickering. |
| **Cache Invalidation** | After mutations: `queryClient.invalidateQueries()` + `router.invalidate()`. |

---

## ⚙️ Backend Architecture

### Server Functions (createServerFn)

All backend logic runs through **TanStack Start Server Functions** — type-safe functions that execute exclusively on Nitro v3. They never ship to the client bundle.

```mermaid
graph LR
    Client["Client Component"] -->|"call fn({ data })"| SF["Server Function<br/>(runs on Nitro)"]
    SF -->|"Zod validation"| Val["z.object().parse()"]
    Val --> Auth["getSession(headers)"]
    Auth -->|"membership check"| DB["Drizzle → PostgreSQL"]
    DB -->|"typed result"| SF
    SF -->|"JSON response"| Client
```

**Server function files** (`src/server/`):

| File | Responsibility |
|---|---|
| `auth-fns.ts` | Session retrieval helpers |
| `org-fns.ts` | Create, read, update, delete organizations + membership validation |
| `dashboard-fns.ts` | Organization statistics (member count, etc.) |
| `gallery-fns.ts` | Gallery image CRUD (scoped to org) |
| `storage-fns.ts` | Supabase file upload (server-only, service role key) |
| `query-keys.ts` | TanStack Query option factories for consistent cache keys |

### Server Function Pattern

Every server function follows the same security pattern:

```typescript
export const myFunction = createServerFn({ method: 'POST' }).handler(async ({ data }) => {
  // 1. Validate input with Zod
  const { name, orgId } = z.object({ name: z.string(), orgId: z.string() }).parse(data)

  // 2. Authenticate — get session from cookies
  const request = getRequest()
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) throw new Error('Unauthorized')

  // 3. Authorize — verify org membership + role
  const membership = await db.query.member.findFirst({
    where: and(eq(member.organizationId, orgId), eq(member.userId, session.user.id)),
  })
  if (!membership || membership.role !== 'owner') throw new Error('Forbidden')

  // 4. Execute business logic
  return await db.insert(myTable).values({ name, organizationId: orgId }).returning()
})
```

### Storage — Secure Upload Workflow

Uploads are **server-only** to protect the `SUPABASE_SERVICE_ROLE_KEY`:

```mermaid
sequenceDiagram
    participant C as Client (ImageUpload)
    participant SF as Server Function (storage-fns.ts)
    participant S3 as Supabase Storage

    C->>C: User selects file
    C->>SF: FormData { file, bucket: "avatars" }
    SF->>SF: Validate: size ≤ 2MB, type check
    SF->>SF: Generate random filename
    SF->>S3: upload(fileName, arrayBuffer, { contentType })
    S3-->>SF: Success
    SF->>S3: getPublicUrl(fileName)
    S3-->>SF: https://...supabase.co/storage/v1/object/public/...
    SF-->>C: { url: publicUrl }
    C->>C: setState(url) → instant preview via derived state
```

### API Routes

Better Auth handles its own API at `src/routes/api/auth/`:

| Endpoint | Handler |
|---|---|
| `/api/auth/*` | Better Auth catch-all (sign-in, sign-up, session, OAuth callbacks, org operations) |
| `/api/test` | Health check endpoint |

### How to Add a New API Endpoint

```typescript
// src/routes/api/my-endpoint.ts
import { createAPIFileRoute } from '@tanstack/react-start/api'

export const APIRoute = createAPIFileRoute('/api/my-endpoint')({
  GET: async ({ request }) => {
    return new Response(JSON.stringify({ status: 'ok' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  },
})
```

---

## 🗄️ Database & Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    USER {
        text id PK
        text name
        text email UK
        boolean email_verified
        text image
        text image_url
        timestamp created_at
        timestamp updated_at
    }

    SESSION {
        text id PK
        timestamp expires_at
        text token UK
        text ip_address
        text user_agent
        text user_id FK
        text active_organization_id
    }

    ACCOUNT {
        text id PK
        text account_id
        text provider_id
        text user_id FK
        text access_token
        text refresh_token
        text password
    }

    VERIFICATION {
        text id PK
        text identifier
        text value
        timestamp expires_at
    }

    ORGANIZATION {
        text id PK
        text name
        text slug UK
        text logo
        text logo_url
        text metadata
        timestamp created_at
    }

    MEMBER {
        text id PK
        text organization_id FK
        text user_id FK
        text role
        timestamp created_at
    }

    INVITATION {
        text id PK
        text organization_id FK
        text email
        text role
        text status
        timestamp expires_at
        text inviter_id FK
    }

    GALLERY_IMAGE {
        text id PK
        text name
        text url
        text size
        text organization_id FK
        timestamp created_at
    }

    USER ||--o{ SESSION : "has"
    USER ||--o{ ACCOUNT : "has"
    USER ||--o{ MEMBER : "belongs to"
    USER ||--o{ INVITATION : "invites"
    ORGANIZATION ||--o{ MEMBER : "has"
    ORGANIZATION ||--o{ INVITATION : "has"
    ORGANIZATION ||--o{ GALLERY_IMAGE : "owns"
```

### Multi-Tenancy Pattern

Every tenant-scoped table includes an `organizationId` foreign key with cascade delete:

```typescript
export const myTable = pgTable("my_table", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("my_table_organizationId_idx").on(table.organizationId),
])
```

> [!TIP]
> Always add an index on `organizationId` — it's queried on every tenant-scoped request.

### Database Connection

`db/index.ts` uses `postgres.js` with Supabase transaction pooler settings:

```typescript
const client = postgres(process.env.DATABASE_URL, {
  ssl: 'require',
  prepare: false,    // CRITICAL for Supabase Pooler (port 6543)
  max: 10,           // Connection pool size
  idle_timeout: 20,  // Seconds before idle connection is closed
  connect_timeout: 10,
})
export const db = drizzle(client, { schema })
```

### Database Commands

| Command | Purpose |
|---|---|
| `npx drizzle-kit push` | Sync schema.ts changes directly to PostgreSQL |
| `npx drizzle-kit studio` | Visual database browser at https://local.drizzle.studio |
| `npx drizzle-kit generate` | Generate SQL migration files (for version control) |

---

## 🌐 Internationalization

RefactKit uses a **custom React context** wrapping i18next for full SSR-compatible internationalization.

### Supported Locales

| Locale | Language | Direction | Default Font |
|---|---|---|---|
| `en` | English | LTR | Google Sans Flex |
| `fr` | French | LTR | Google Sans Flex |
| `es` | Spanish | LTR | Google Sans Flex |
| `pt` | Portuguese | LTR | Google Sans Flex |
| `ar` | Arabic | RTL | Zain |

### How It Works

1. **Server**: `getServerLocale()` reads the `locale` cookie from the request headers during SSR.
2. **Root layout**: Passes locale to `<I18nProvider initialLocale={locale}>` and sets `<html lang dir>`.
3. **Components**: Use `const { t, locale, dir } = useI18n()` to access translations.
4. **Switching**: `setLocale('ar')` updates state + persists cookie + flips `document.dir`.

### Adding a New Locale

1. Create `src/i18n/locales/de.ts` with all translation keys.
2. Register it in `src/i18n/index.ts`:
   ```typescript
   import de from './locales/de'
   const translations = { en, fr, es, pt, ar, de }
   export type Locale = 'en' | 'fr' | 'es' | 'pt' | 'ar' | 'de'
   ```
3. Add the font (if needed) in `src/styles/globals.css`.

---

## 📝 Forms & Design System

### TanStack Form + Zod Validation

Forms use **TanStack Form** with Zod schema validators and **Base UI** primitives:

```tsx
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
})

const form = useForm({
  defaultValues: { name: '', email: '' },
  validators: { onSubmit: schema },
  onSubmit: async ({ value }) => {
    await myServerFunction({ data: value })
  },
})
```

### Design System Rules

| Rule | Do | Don't |
|---|---|---|
| **Colors** | `bg-primary`, `text-muted-foreground` | `bg-blue-500`, `dark:bg-slate-900` |
| **Spacing** | `flex flex-col gap-4` | `space-y-4` |
| **Dimensions** | `size-10` (equal w/h) | `w-10 h-10` |
| **Icons** | `data-icon="inline-start"` | Raw SVG inline |
| **Themes** | CSS variables via `@theme` | Hardcoded color values |

### Applying a New Theme

Generate a preset at [ui.shadcn.com](https://ui.shadcn.com) and apply:
```bash
npx shadcn@latest apply --preset <your-preset-code>
```

---

## 🧪 DevOps, Observability & Testing

### Deployment

#### Vercel (Primary — Recommended)

Pre-configured in `package.json`:
```bash
"build": "NITRO_PRESET=vercel vite build"
```

**Required environment variables** (Vercel Dashboard → Settings → Environment Variables):

| Variable | Value | Required |
|---|---|---|
| `DATABASE_URL` | Supabase connection string (port 6543 for pooler) | ✅ |
| `BETTER_AUTH_SECRET` | `openssl rand -base64 32` | ✅ |
| `BETTER_AUTH_URL` | `https://your-domain.com` | ✅ |
| `RESEND_API_KEY` | `re_...` from Resend dashboard | ✅ |
| `VITE_SUPABASE_URL` | `https://xxx.supabase.co` | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase dashboard | ✅ |
| `VITE_APP_URL` | `https://your-domain.com` | Optional |

#### Other Targets (Cloudflare, Node.js)

Change the Nitro preset:
```bash
# Cloudflare Workers
NITRO_PRESET=cloudflare-module vite build

# Standalone Node.js
NITRO_PRESET=node vite build
node .output/server/index.mjs
```

### Observability

| Tool | What It Shows | How to Access |
|---|---|---|
| **Drizzle Studio** | Visual database browser — view/edit all tables | `npx drizzle-kit studio` |
| **Supabase Dashboard** | Database logs, storage browser, RLS policies | `https://app.supabase.com` |
| **Server Audit Logs** | `[AUDIT]` prefixed console logs for session/email events | Terminal / Vercel Function Logs |
| **Better Auth Dash** | Built-in admin panel (`dash()` plugin) | `/api/auth/admin` |
| **TanStack DevTools** | Query cache inspector, router state | Auto-loaded in dev mode |

### Code Quality

| Tool | Command | Purpose |
|---|---|---|
| **Biome Lint** | `pnpm lint` | Catch code issues (Rust-speed) |
| **Biome Format** | `pnpm format` | Auto-format all files |
| **Biome Check** | `pnpm check` | Lint + format in one pass |
| **TypeScript** | Strict mode enabled in `tsconfig.json` | Compile-time type safety |

### Testing

#### Unit & Integration Tests (Vitest)

```bash
pnpm test              # Run all tests (includes Biome check)
pnpm test:watch        # Watch mode for development
pnpm test:coverage     # Generate v8 coverage report → coverage/
npx vitest --ui        # Visual test runner in browser
```

- **Framework**: Vitest 4.x + React Testing Library + JSDOM
- **Location**: `src/**/*.{test,spec}.{ts,tsx}`
- **Setup**: `src/test/setup.ts`

#### End-to-End Tests (Playwright)

```bash
pnpm test:e2e                  # Run all E2E tests
npx playwright test --ui       # Interactive mode with trace viewer
npx playwright test --headed   # See browser during test
```

- **Framework**: Playwright 1.59+ (Chromium, Firefox, WebKit)
- **Location**: `e2e/` directory
- **Auto-server**: Playwright starts `pnpm dev` automatically before tests
- **Config**: `playwright.config.ts` — HTML reporter, trace on first retry

### Pre-Deploy Checklist

```bash
pnpm check           # Biome lint + format
pnpm test            # Unit tests pass
pnpm test:e2e        # E2E tests pass
npx drizzle-kit push # Schema synced
```

---


---

## 🤖 AI-Assisted Development

RefactKit includes specialized **Skills** in `.agents/skills/` that teach AI coding assistants the exact patterns, APIs, and conventions of this stack.

### Available Skills

| Skill | When to Use |
|---|---|
| `better-auth-best-practices` | Auth config, sessions, plugins, database adapters |
| `better-auth-security-best-practices` | Rate limiting, CSRF, cookies, IP tracking, audit logging |
| `email-and-password-best-practices` | Email verification, password reset, hashing |
| `organization-best-practices` | Orgs, members, invitations, RBAC, teams |
| `create-auth-skill` | Scaffolding auth from scratch |
| `shadcn` | UI components, theming, presets |

### How to Use with Your AI

When prompting your AI assistant, **@mention** the relevant skill:

```
"Add a billing page with Stripe integration.
 Read @.agents/skills/shadcn/SKILL.md for UI patterns
 and @AGENTS.md for the overall architecture."
```

### Adding New Skills

```bash
pnpm dlx skills add shadcn/ui    # UI & Base UI components
pnpm dlx skills add tanstack     # Router, Query, Start, Form
pnpm dlx skills add drizzle      # Database & ORM
pnpm dlx skills add supabase     # Storage & Infrastructure
pnpm dlx skills add better-auth  # Authentication & Organizations
```

> [!TIP]
> The more explicitly you reference skill files in your prompts, the less hallucination you get — code will match the project's strict typing and composition rules.

---

## 💳 Payments & Billing (Pro)

> [!NOTE]
> Payment and billing features are **not included in the Community Edition**. They are reserved for **RefactKit Pro**, currently in development.

RefactKit Pro will ship with a complete, production-ready billing system built around two providers:

### Stripe — Subscriptions & One-Time Payments

| Feature | Details |
|---|---|
| Checkout | Stripe Checkout (hosted) + Elements (custom UI) |
| Pricing models | Flat-rate, per-seat (synced with org `membershipLimit`), metered usage, one-off payments |
| Subscription lifecycle | `trial → active → past_due → cancelled → expired` with automatic status sync via webhooks |
| Webhook handler | `/api/billing/webhook` — signature verification, event routing, DB sync |
| Customer portal | Self-service billing: manage plans, payment methods, download invoices |
| Test/Live mode | Single `STRIPE_SECRET_KEY` env swap — no code changes needed |

### Polar — Open-Source Friendly Monetization

| Feature | Details |
|---|---|
| Subscriptions | Usage-based and flat-rate plans |
| One-time purchases | Lifetime licenses, add-ons |
| Open-source integration | Designed for developer tools and open-core products |
| Benefits | Grant GitHub repo access, Discord roles, or file downloads on purchase |

### What Billing Unlocks in Pro

```
Community (this repo)          Pro (coming soon)
──────────────────────         ──────────────────
✅ Auth & Organizations         ✅ Everything in Community
✅ RBAC                         ✅ Stripe Subscriptions & Webhooks
✅ Multi-tenancy                ✅ Polar Integration
✅ i18n (5 languages)           ✅ Admin Dashboard
✅ Storage uploads              ✅ Super-admin Impersonation
✅ Gallery module               ✅ Per-seat Billing
                                ✅ Customer Portal
                                ✅ Priority Support
```

> [!TIP]
> Want to be notified when RefactKit Pro launches? Star the repo and watch for releases.

---

## 📄 License

RefactKit is released under the **MIT License** — free to use, modify, and distribute, for any purpose, including commercial projects.

See [LICENSE](LICENSE) for the full text.

---

### 🤝 Contributing

This project is community-driven and every contribution matters — whether it's a bug fix, a new feature, a translation, or simply spreading the word.

- **Found a bug?** [Open an issue](https://github.com/your-org/refactkit-multitenancy/issues)
- **Have an idea?** [Start a discussion](https://github.com/your-org/refactkit-multitenancy/discussions)
- **Want to contribute code?** Fork the repo, create a branch, and open a pull request. Make sure `pnpm format` and `pnpm lint` pass before submitting.
- **Built something with RefactKit?** Share it in the [Discussions → Show & Tell](https://github.com/your-org/refactkit-multitenancy/discussions) section — we'd love to see what you build. 🚀

> [!TIP]
> If RefactKit saves you time, the best way to give back is to ⭐ **star the repo** — it helps other developers discover the project and grows the community.

