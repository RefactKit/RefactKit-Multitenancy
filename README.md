# RefactKit 🚀 — SaaS Multi-tenancy Boilerplate

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Framework](https://img.shields.io/badge/TanStack-Start-orange?logo=tanstack)
![Engine](https://img.shields.io/badge/Nitro-v3-green?logo=nitro)
![Auth](https://img.shields.io/badge/Better--Auth-1.6+-purple?logo=better-auth)

<p align="center">
  <img src="https://raw.githubusercontent.com/tanstack/router/main/media/repo-header.png" width="400px" alt="TanStack Logo" />
</p>

> 🇬🇧 [English version](#english-version) &nbsp;|&nbsp; 🇫🇷 [Version française](#version-française)
> &nbsp;
> **Table of Contents**
> - [🇬🇧 English Version](#english-version)
>   - [🌟 Introduction](#introduction)
>   - [🛠️ Tech Stack](#tech-stack)
>   - [⚡ Powered by Nitro v3](#powered-by-nitro)
>   - [🏗️ Architecture](#architecture)
>   - [🛠️ Development Guide](#development-guide)
>     - [🏗️ Backend](#backend)
>     - [💻 Frontend](#frontend)
>   - [🧪 Testing](#testing)
>   - [🌐 i18n & Typography](#i18n)
>   - [🔒 Auth & Security](#auth)
>   - [👥 Roles & RBAC](#roles)
>   - [📝 Forms](#forms)
>   - [📧 Email Setup](#emails)
>   - [🎨 Design System](#design)
>   - [🖼️ Media & Storage](#storage)
>   - [🚀 DevOps & Setup](#devops)
> - [🇫🇷 Version Française](#version-française)

<a name="english-version"></a>
# 🇬🇧 English Version

<a id="introduction"></a>
## 🌟 Introduction
**RefactKit** is a high-performance SaaS foundation designed for developers building multi-tenant applications (B2B, B2C, or internal tools). It provides a full-featured workspace environment with advanced permission management, localized interfaces, and a premium developer experience.

### Core Philosophy
- **Multi-tenancy First**: Every piece of data is isolated within an organization context.
- **Type-Safety Everywhere**: From your database schema to your UI components, powered by TypeScript.
- **Base UI Foundation**: We use **Base UI** (formerly Radix UI rival) primitives to ensure perfect accessibility and styling freedom.
- **Modern Performance**: Built on React 19 and the Nitro v3 server engine.

---

<a id="tech-stack"></a>
## 🛠️ Tech Stack & Detailed Tools

| Layer | Technology | Key Features |
|---|---|---|
| **Meta-Framework** | <img src="https://tanstack.com/favicons/favicon-32x32.png" width="20" /> **TanStack Start** | React 19, Full-stack Router, Server Functions. |
| **Server Engine**  | <img src="https://nitro.unjs.io/icon.svg" width="20" /> **Nitro v3** | Universal deployment, high-performance runtime. |
| **Authentication** | <img src="https://www.better-auth.com/favicon.ico" width="20" /> **Better Auth 1.6+** | Organizations, RBAC, Sentinel (Dash), TanStack Start integration. |
| **UI Components** | <img src="https://base-ui.com/favicon.ico" width="20" /> **Base UI / Shadcn** | Accessible primitives, premium design system. |
| **Styling** | <img src="https://tailwindcss.com/favicons/favicon-32x32.png" width="20" /> **Tailwind CSS v4** | Next-gen utility-first CSS, ultra-fast compilation. |
| **Database** | <img src="https://supabase.com/favicons/favicon-32x32.png" width="20" /> **Supabase** | Scalable cloud database with connection pooling. |
| **ORM** | <img src="https://orm.drizzle.team/favicon-32x32.png" width="20" /> **Drizzle ORM** | Type-safe SQL, easy migrations, Drizzle Studio. |
| **State Management**| <img src="https://tanstack.com/favicons/favicon-32x32.png" width="20" /> **TanStack Query** | Robust data fetching and server-state sync. |
| **Emails** | <img src="https://resend.com/static/favicon.ico" width="20" /> **Resend** | Transactional emails with modern API. |
| **Quality** | <img src="https://biomejs.dev/favicon.ico" width="20" /> **Biome** | Ultra-fast Rust-based toolchain. |
| **Magic UI** | <img src="https://magicui.design/favicon.ico" width="20" /> **Magic UI** | Beautiful animated components (Marquee, etc.). |
| **Testing** | <img src="https://vitest.dev/favicon.ico" width="20" /> **Vitest & Playwright**| Unit & E2E testing for mission-critical apps. |

### ⚠️ Dependency Update Warnings (Must Read)
When maintaining this project, please follow these strict rules for updating dependencies:

1. **TanStack Start & Nitro v3**: The `nitro` dependency is currently pinned to a `beta` channel (`3.0.x-beta`) to support Start. **Do not blindly run `pnpm update`** on `@tanstack/react-start`, `@tanstack/react-router`, or `nitro`. These packages are tightly coupled, and version mismatches can easily crash the SSR server.
2. **Better Auth (v1.6+)**: If you update `better-auth`, always check their changelog. Updates often introduce new columns to the database schema (especially for the `organization` plugin). You must manually verify and update your `db/schema.ts` to match their core schema requirements before pushing changes.
3. **React 19**: This boilerplate relies heavily on React 19 features (Server Functions, Actions, `use` hook). Do not install legacy UI libraries that strictly require React 18, and never downgrade the core `react` packages.

---

<a id="powered-by-nitro"></a>
## ⚡ Powered by Nitro v3

This project is built on **Nitro v3**, the most advanced web server engine for the modern web.

- **Universal Deployment**: Run your app anywhere (Vercel, Cloudflare Workers, Node.js, AWS, Netlify) with a single build.
- **Extreme Performance**: Ultra-fast cold starts and a minimal footprint optimized for the edge.
- **Integrated Server Functions**: Seamlessly bridge your frontend and backend with type-safe server handlers.
- **Dynamic Caching**: Advanced caching layers to keep your SaaS responsive and scalable.

---

<a id="architecture"></a>
<a id="fr-architecture"></a>
## 🏗️ Architecture Breakdown

### Logical Folder Structure

- **`db/`**: Database core.
    - `schema.ts`: Single source of truth for tables and RBAC relationships.
    - `index.ts`: Optimized connection setup using `postgres.js`.
- **`lib/`**: Core infrastructure.
    - `auth.ts`: Better Auth configuration (Roles: Member, Admin, Owner).
    - `auth-client.ts`: Browser client with organization support.
- **`src/components/`**: Modular UI components.
    - `dashboard/`: Sidebar (compact), Navbar, Breadcrumbs.
    - `settings/`: New Tab-based settings (Account, Security, Appearance).
    - `ui/`: Base UI primitives.
- **`src/routes/`**: File-based routing (TanStack Router).
    - `_auth/`: Public routes (Login, Signup, Verification).
    - `_app/`: Secure root for organizations and settings.
    - `$slug/`: Context-aware organization workspace.
- **`src/i18n/`**: Full internationalization with Arabic (RTL), French, Spanish, and Portuguese support.
- **`src/hooks/`**: Custom hooks for theme and font management.
- **`src/components/shared/`**: Unified components (Header, Auth UI) shared across the platform.

---

<a id="development-guide"></a>
## 🛠️ Development Guide

This section explains how to extend LaunchKit-Better by adding new features, database tables, and routes while respecting the core architecture.

<a id="backend"></a>
### 🏗️ Backend (API & Database)

#### 1. Server Functions & Zod
LaunchKit handles backend logic using **TanStack Start Server Functions** (`createServerFn`). These are type-safe functions that run strictly on the server (Nitro) and use **Zod** for validation.

```typescript
import { createServerFn } from '@tanstack/start'
import { z } from 'zod'
import { db } from '@/db'
import { myTable } from '@/db/schema'

export const createItem = createServerFn({ method: 'POST' })
  .validator((data: unknown) => z.object({ name: z.string() }).parse(data))
  .handler(async ({ data }) => {
    // This runs strictly on the server
    const newItem = await db.insert(myTable).values({ name: data.name }).returning();
    return { item: newItem[0] };
  });
```

#### 2. Database Schema (Drizzle)
To add a new table or modify existing ones:
1. **Modify Schema**: Open `db/schema.ts` and define your table.
   ```typescript
   export const myTable = pgTable("my_table", {
     id: text("id").primaryKey(),
     name: text("name").notNull(),
     organizationId: text("organization_id").references(() => organization.id),
   });
   ```
2. **Push Changes**: Synchronize with your database immediately:
   ```bash
   npx drizzle-kit push
   ```
3. **Explore Data**: Use `npx drizzle-kit studio` to manage records visually.

> [!TIP]
> Always include an `organizationId` in your tables to ensure strict tenant isolation (Multi-tenancy).

<a id="frontend"></a>
### 💻 Frontend (Routing & UI)

#### 1. Creating a New Route
LaunchKit uses **file-based routing**. To create a new page within an organization workspace:
1. Create a file: `src/routes/_app/organizations/$slug/my-page.tsx`.
2. Define the route:
   ```tsx
   import { createFileRoute } from '@tanstack/react-router'

   export const Route = createFileRoute('/_app/organizations/$slug/my-page')({
     component: MyPage,
     loader: async ({ context }) => {
       // Seed the TanStack Query cache for SSR
       await context.queryClient.ensureQueryData(myQueryOptions(context.params.slug));
     }
   })
   ```

#### 2. Making Requests with SSR (Best Practices)
To ensure high performance and SEO-friendly pages, follow these rules:
- **Seed the Cache**: Always use `queryClient.ensureQueryData` in the route `loader`. This avoids extra network requests on the client during hydration.
- **Internal SSR Fetching**: Never `fetch` your own API over the network during SSR. Use direct server function calls or relative URLs through Nitro's internal bridge.
- **Route Protection**: Use `beforeLoad` in your routes to verify sessions and roles before any rendering occurs.

#### 3. Reactivity & UX Excellence
- **Stable Keys**: Never use array indexes as keys. Always use unique database IDs (e.g., `key={item.id}`).
- **Form State Reset**: When a user switches organizations, reset local state by using the organization ID as a `key` on the main container (e.g., `<div key={org.id}>`).
- **Derived State Pattern**: For media (avatars/logos), use a derived state to avoid UI flickering:
  ```tsx
  const [uploadedImg, setUploadedImg] = useState<string | undefined>()
  const currentImg = uploadedImg || defaultValue // defaultValue from SSR/Query
  ```

---

<a id="testing"></a>
## 🧪 Testing Strategy

LaunchKit-Better implements a multi-layered testing strategy to ensure reliability across the entire stack.

### 1. Unit & Integration Tests (Vitest)
Used for testing server functions, hooks, and UI components in isolation.
- **Commands**:
  - Run all tests: `pnpm test`
  - Watch mode: `pnpm test:watch`
  - UI Mode: `npx vitest --ui`
- **Setup**: Powered by **Vitest** and **React Testing Library** with a JSDOM environment.
- **Location**: Files ending in `.test.ts` or `.test.tsx` located within the `src/` directory.

### 2. End-to-End Tests (Playwright)
Used for testing complete user flows in real browsers.
- **Commands**:
  - Run E2E tests: `pnpm test:e2e`
  - Interactive mode: `npx playwright test --ui`
- **Location**: Scenarios are located in the `e2e/` directory.

### 3. Code Coverage
Monitor your testing progress and identify untested logic paths.
- **Run Coverage**: `pnpm test:coverage`
- **Setup**: Uses the `v8` provider. Ensure you have `@vitest/coverage-v8` installed.
- **Report**: A detailed HTML report is generated in the `coverage/` directory after execution.

---

<a id="i18n"></a>
## 🌐 Internationalization & Typography

LaunchKit-Better uses a dynamic, direction-aware typography system.

### Direction-Aware Fonts
The application automatically switches between premium fonts based on the document direction:
- **LTR (English, French, etc.)**: Uses **Google Sans Flex** by default.
- **RTL (Arabic)**: Uses **Zain** by default.

### Adding a New Font
1. **Install the font**: `pnpm add @fontsource/font-name`
2. **Import in `globals.css`**: `@import "@fontsource/font-name";`
3. **Register the variable**:
   ```css
   [data-font="my-font"] {
     --font-family: "My Font", sans-serif;
   }
   ```
4. **Update the hook**: Add the font key to `src/hooks/use-font.ts`.
5. **Add to Settings**: Update the dropdown in `src/components/settings/account/appearance.tsx`.

---

<a id="auth"></a>
## 🔒 Authentication & Security

LaunchKit relies on **Better Auth** for robust, modern authentication and security.

### How Better Auth Works Here
- **Core Authentication**: Handles email/password flows, OAuth (Google), and session management securely out of the box.
- **Session & Cookie Management**: By default, sessions use secure, HTTP-only cookies valid for 7 days. Better Auth automatically handles session refreshing (rolling sessions), ensuring active users stay logged in securely without manual refresh token logic.
- **Authentication Flow**: When a user logs in, an opaque session token is generated in the database. The browser receives the secure cookie, and every subsequent request is validated by the server. OAuth access/refresh tokens are securely stored in the `account` table.
- **Multi-tenancy via Plugins**: We use the Better Auth `organization` plugin to seamlessly manage workspaces, meaning tenants and users are intrinsically linked at the auth layer.
- **Middleware & RBAC**: Every request is intercepted by our server middleware. It verifies the session, identifies the active organization context, and strictly enforces Role-Based Access Control (RBAC). 
- **Extensibility (SSO & OIDC)**: You can easily add Enterprise Single Sign-On (SSO) or OpenID Connect (OIDC). Simply prompt the AI assistant to use the provided `better-auth-best-practices` and `create-auth-skill` skills to integrate these features in minutes.

### The Advantage
Because authentication and organization state are tightly coupled through Better Auth, the application guarantees that users can **never** access data belonging to a workspace they aren't part of. Permissions are validated on the server before the UI even renders.

---

<a id="roles"></a>
## 👥 Roles & Permissions (RBAC)

RefactKit uses a granular permission matrix powered by the Better Auth Organization plugin.

| Capability | Member | Admin | Owner |
|---|---|---|---|
| View Dashboard | ✅ | ✅ | ✅ |
| Create New Organizations | ❌ | ✅ | ✅ |
| Access Team Management | ❌ | ✅ | ✅ |
| Invite New People | ❌ | ✅ (Up to Admin) | ✅ (Full) |
| Manage Member Roles | ❌ | ✅ (non-owners) | ✅ |
| Workspace Settings | ❌ | ❌ | ✅ |
| Delete Organization | ❌ | ❌ | ✅ |

---

        </Button>
      </CardContent>
    </Card>
  )
}
```

---

<a id="forms"></a>
## 📝 Forms Management (TanStack Form)

LaunchKit-Better uses **TanStack Form** for complex state management and validation. We enforce strict UI composition rules based on Base UI primitives.

### Best Practices for Forms
- **Composition**: Always use `<FieldGroup>` and `<Field>` to structure your forms. Do not use generic `<div>` tags with arbitrary spacing classes.
- **Validation State**: Validation is handled via `data-invalid` and `aria-invalid` attributes.
- **Example**:
  ```tsx
  import { useForm } from '@tanstack/react-form'
  import { FieldGroup, Field, FieldLabel, Input, FieldDescription } from '@/components/ui'

  export function ProfileForm() {
    const form = useForm({ defaultValues: { email: '' } })
    return (
      <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
        <FieldGroup>
          <form.Field name="email">
            {(field) => (
              <Field data-invalid={field.state.meta.errors.length > 0}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input 
                  id={field.name} 
                  value={field.state.value} 
                  onChange={(e) => field.handleChange(e.target.value)} 
                  aria-invalid={field.state.meta.errors.length > 0} 
                />
                {field.state.meta.errors.map(err => <FieldDescription key={err}>{err}</FieldDescription>)}
              </Field>
            )}
          </form.Field>
        </FieldGroup>
      </form>
    )
  }
  ```

---

<a id="emails"></a>
## 📧 Email Configuration (Resend)

Transactional emails (invitations, password resets, verification) are powered by **Resend**.

### Setup Instructions
1. **Create an Account**: Go to [Resend.com](https://resend.com) and sign up.
2. **Verify your Domain**: In the Resend dashboard, add your domain and configure the provided DNS records (TXT/MX).
3. **Generate an API Key**: Create an API key with sending permissions.
4. **Environment Setup**: Add your key to `.env`:
   ```env
   RESEND_API_KEY="re_123456789"
   ```
5. **Usage**: The logic is pre-configured in `lib/email.ts`. Better Auth automatically triggers emails via the `sendEmail` utility during core authentication flows.

---

<a id="design"></a>
## 🎨 Design System & Theming (Base UI / Shadcn)

Our UI foundation relies on **Base UI** primitives composed via a specialized Shadcn CLI.

### Theming Principles
- **Semantic Colors Only**: Use tokens like `bg-primary` or `text-muted-foreground`. **Never** use hardcoded values like `bg-blue-500` or `dark:bg-slate-900`.
- **Spacing**: Avoid `space-y-*` or `space-x-*`. Instead, use `flex flex-col gap-4`.
- **Dimensions**: Use `size-*` for equal width/height (e.g., `size-10`).
- **Icons**: Use the `data-icon="inline-start"` property when placing icons inside buttons.
- **Presets & Customization**: You can apply a completely new theme by generating a preset code from [ui.shadcn.com](https://ui.shadcn.com) and running:
  ```bash
  npx shadcn@latest apply --preset <your-preset-code>
  ```

---

<a id="storage"></a>
## 🖼️ Media & Storage (Supabase)

LaunchKit-Better uses **Supabase Storage** for avatars, logos, and gallery images.

### 1. Secure Upload Workflow
To keep your `SUPABASE_SERVICE_ROLE_KEY` secure, we **never** perform uploads directly from the client. Instead, we use a dedicated server function:

1. **Client**: The `ImageUpload` component sends a `FormData` containing the file to the server.
2. **Server**: The `uploadImage` function (`src/server/storage-fns.ts`) receives the file, validates its size/type, and uploads it to Supabase using the service role key.
3. **Response**: The server returns the `publicUrl` of the uploaded file.

### 2. Global State Invalidation & Reactivity
When an avatar or logo is updated, we ensure the UI reflects the change globally:
```tsx
const { mutate } = useMutation({
  onSuccess: () => {
    // 1. Invalidate TanStack Query caches
    queryClient.invalidateQueries({ queryKey: ['user-orgs'] })
    // 2. Invalidate TanStack Router loaders (refreshes session and global state)
    router.invalidate()
  }
})
```

**Pro-tip for Low Latency**: In your components, use the **Derived State Pattern** to avoid flickering:
```tsx
const [uploadedImg, setUploadedImg] = useState<string | undefined>()
const currentImg = uploadedImg || defaultValue // defaultValue comes from TanStack Query prop
```
This ensures that the cached logo from the previous organization is replaced **instantly** by the new one from the cache, without waiting for a re-render cycle.

### 3. Configuration
Ensure your `.env` contains:
- `VITE_SUPABASE_URL`: Your Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: Your service role key (kept on server).
- **Bucket**: Ensure a bucket named `avatars` exists in your Supabase dashboard with public read access.

#### SQL Setup (Supabase Dashboard)
Run this in your Supabase SQL Editor to initialize the storage:
```sql
-- 1. Create the "avatars" bucket
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 2. Allow public access to read files
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'avatars' );

-- 3. Allow service role (server) to manage files (already default, but good to ensure)
-- Note: Our server functions use the Service Role Key, which bypasses RLS.
```

---

<a id="devops"></a>
## 🚀 DevOps & Deployment

### Vercel Deployment (Nitro v3)
This project is optimized for **Vercel** using the high-performance Nitro v3 engine.

1. **Preset Configuration**: The build command is pre-configured in `package.json`:
   ```bash
   "build": "NITRO_PRESET=vercel vite build"
   ```
2. **Environment Variables**: Ensure the following are set in your Vercel Dashboard:
   - `DATABASE_URL`: Your Supabase connection string.
   - `BETTER_AUTH_SECRET`: Generate via `openssl rand -base64 32`.
   - `BETTER_AUTH_URL`: Your production URL (e.g., `https://myapp.com`).
3. **Database Sync**: Run migrations before/after deployment using:
   ```bash
   npx drizzle-kit push
   ```

---

## 🚀 Setup Guide

### 1. Environment Configuration
Create a `.env` file based on `.env.example`:
```env
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="..."
BETTER_AUTH_URL="http://localhost:3000"
RESEND_API_KEY="re_..."
```

### 2. Installation & DB Sync
```bash
pnpm install
npx drizzle-kit push  # Sync schema with DB
pnpm dev              # Launch dev server on port 3000
```

---

## 🤖 AI-Assisted Development (Using Skills)

RefactKit is built with AI coding assistants in mind (Antigravity/Gemini, Windsurf, Claude, Cursor, etc.). The repository includes specialized "Skills" in the `.agents/skills/` directory that teach the AI exactly how to write code for this specific stack.

### How to use Skills with your AI
When asking your AI assistant to build a feature, explicitly `@mention` the relevant skill file or ask the AI to read it before coding.

- **UI & Components**: "Create a new Pricing table component using the guidelines in `@.agents/skills/shadcn/SKILL.md`." (This forces the AI to use Base UI, `FieldGroup`, and semantic colors).
- **Authentication**: "Add a Google SSO login button. Read `@.agents/skills/better-auth-best-practices/SKILL.md` first to understand our auth setup."
- **General Architecture**: Always refer the AI to `@AGENTS.md`, which acts as the supreme context file for the whole repository.

### 🛠️ Adding Specialized Skills
To provide even deeper context for your AI agent, you can add specialized skills for each technology in our stack:
```bash
pnpm dlx skills add shadcn/ui    # UI & Base UI components
pnpm dlx skills add tanstack    # Router, Query, Start, Form
pnpm dlx skills add drizzle     # Database & ORM
pnpm dlx skills add supabase    # Storage & Infrastructure
pnpm dlx skills add better-auth # Authentication & Organizations
```

*Pro tip: The more you explicitly reference these markdown skills in your prompt, the less hallucination you'll get, and the code will perfectly match the project's strict typing and composition rules.*

---
<a name="version-française"></a>
# 🇫🇷 Version Française

<a id="fr-introduction"></a>
## 🌟 Introduction
**RefactKit** est une fondation SaaS haute performance conçue pour les développeurs créant des applications multi-tenant (B2B, B2C ou outils internes). Il offre un environnement de travail complet avec gestion avancée des rôles, interfaces localisées et une expérience développeur premium.

### Philosophie Coeur
- **Multi-tenancy Natif** : Chaque donnée est isolée dans le contexte d'une organisation.
- **Sûreté Typée** : Du schéma de base de données aux composants UI, tout est rigoureusement typé avec TypeScript.
- **Base UI Foundation** : Utilisation des primitives **Base UI** pour une accessibilité parfaite et une liberté de design totale.
- **Performance Moderne** : Propulsé par React 19 et le moteur de serveur Nitro v3.

---

<a id="fr-tech-stack"></a>
## 🛠️ Stack Technique & Outils Détaillés

  - [🏗️ Architecture](#fr-architecture)
  - [🛠️ Guide de Développement](#fr-development-guide)
    - [🏗️ Backend](#fr-backend)
    - [💻 Frontend](#fr-frontend)
  - [🧪 Stratégie de Tests](#fr-testing)
  - [🌐 i18n & Typographie](#fr-i18n)
  - [🔒 Auth & Sécurité](#fr-auth)
  - [👥 Rôles & RBAC](#fr-roles)
  - [📝 Formulaires](#fr-forms)
  - [📧 Emails](#fr-emails)
  - [🎨 Design Système](#fr-design)
  - [🖼️ Médias & Stockage](#fr-storage)
  - [🚀 DevOps & Déploiement](#fr-devops)

---

<a id="fr-i18n"></a>
## 🌐 Internationalisation & Typographie

LaunchKit-Better utilise un système de typographie dynamique qui s'adapte à la direction de lecture.

### Polices Sensibles à la Direction
L'application change automatiquement de police selon la direction du document :
- **LTR (Français, Anglais, etc.)** : Utilise **Google Sans Flex** par défaut.
- **RTL (Arabe)** : Utilise **Zain** par défaut.

### Ajouter une Nouvelle Police
1. **Installer la police** : `pnpm add @fontsource/nom-de-la-police`
2. **Importer dans `globals.css`** : `@import "@fontsource/nom-de-la-police";`
3. **Enregistrer la variable** :
   ```css
   [data-font="ma-police"] {
     --font-family: "Ma Police", sans-serif;
   }
   ```
4. **Mettre à jour le hook** : Ajoutez la clé de la police dans `src/hooks/use-font.ts`.
5. **Ajouter aux paramètres** : Mettez à jour le menu déroulant dans `src/components/settings/account/appearance.tsx`.

---

<a id="fr-auth"></a>
## 🔒 Authentification & Sécurité

LaunchKit s'appuie sur **Better Auth** pour une authentification robuste et moderne.

### Comment Better Auth gère la sécurité
- **Authentification Centrale** : Gère nativement les flux e-mail/mot de passe, OAuth (Google), et la sécurité des sessions.
- **Gestion des Sessions & Cookies** : Les sessions utilisent des cookies sécurisés (HTTP-only) valides pour 7 jours par défaut. Better Auth gère automatiquement le rafraîchissement des sessions (rolling sessions) pour maintenir les utilisateurs actifs connectés en toute sécurité.
- **Le Flux d'Authentification** : Lors de la connexion, un token de session opaque est généré en base de données. Le navigateur reçoit le cookie sécurisé, et chaque requête suivante est validée par le serveur. Les tokens d'accès/rafraîchissement OAuth sont stockés en toute sécurité dans la table `account`.
- **Multi-tenancy via Plugins** : L'utilisation du plugin `organization` de Better Auth permet de lier intrinsèquement les utilisateurs à leurs espaces de travail dès la couche d'authentification.
- **Middleware & RBAC** : Chaque requête est interceptée par notre middleware serveur. Il vérifie la session, identifie le contexte de l'organisation active et applique strictement le contrôle d'accès basé sur les rôles (RBAC).
- **Extensibilité (SSO & OIDC)** : Vous pouvez facilement ajouter le Single Sign-On (SSO) d'entreprise ou OpenID Connect (OIDC). Demandez simplement à l'assistant IA d'utiliser les compétences `better-auth-best-practices` et `create-auth-skill` pour intégrer ces fonctionnalités en quelques minutes.

### L'Avantage
Étant donné que l'authentification et l'état de l'organisation sont étroitement couplés via Better Auth, l'application garantit qu'un utilisateur ne peut **jamais** accéder aux données d'un espace de travail dont il ne fait pas partie. Les permissions sont validées côté serveur avant même le rendu de l'interface.

---

<a id="fr-roles"></a>
## 👥 Matrice des Permissions (RBAC)

RefactKit utilise une matrice de permissions granulaire via le plugin Organization de Better Auth.

| Capacité | Membre | Admin | Propriétaire |
|---|---|---|---|
| Voir le Dashboard | ✅ | ✅ | ✅ |
| Créer des Organisations | ❌ | ✅ | ✅ |
| Accéder à l'Équipe | ❌ | ✅ | ✅ |
| Inviter des Membres | ❌ | ✅ (Admin max) | ✅ (Tous) |
| Gérer les Rôles | ❌ | ✅ (Sauf Owner) | ✅ |
| Paramètres Workspace | ❌ | ❌ | ✅ |
| Supprimer l'Organisation | ❌ | ❌ | ✅ |

---

<a id="fr-development-guide"></a>
## 🛠️ Guide de Développement

Cette section explique comment étendre LaunchKit-Better en ajoutant de nouvelles fonctionnalités, des tables de base de données et des routes, tout en respectant l'architecture de base.

<a id="fr-backend"></a>
### 🏗️ Backend (API & Base de données)

#### 1. Fonctions Serveur & Zod
LaunchKit gère la logique backend via les **TanStack Start Server Functions** (`createServerFn`). Ce sont des fonctions typées qui s'exécutent strictement sur le serveur (Nitro) et utilisent **Zod** pour la validation.

```typescript
import { createServerFn } from '@tanstack/start'
import { z } from 'zod'
import { db } from '@/db'
import { maTable } from '@/db/schema'

export const createItem = createServerFn({ method: 'POST' })
  .validator((data: unknown) => z.object({ name: z.string() }).parse(data))
  .handler(async ({ data }) => {
    // S'exécute uniquement sur le serveur
    const newItem = await db.insert(maTable).values({ name: data.name }).returning();
    return { item: newItem[0] };
  });
```

#### 2. Schéma de Base de Données (Drizzle)
Pour ajouter une nouvelle table ou modifier l'existant :
1. **Modifier le Schéma** : Ouvrez `db/schema.ts` et définissez votre table.
   ```typescript
   export const maTable = pgTable("ma_table", {
     id: text("id").primaryKey(),
     name: text("name").notNull(),
     organizationId: text("organization_id").references(() => organization.id),
   });
   ```
2. **Pousser les Changements** : Synchronisez immédiatement avec votre base de données :
   ```bash
   npx drizzle-kit push
   ```
3. **Explorer les Données** : Utilisez `npx drizzle-kit studio` pour gérer vos enregistrements visuellement.

> [!TIP]
> Incluez toujours un `organizationId` dans vos tables pour garantir une isolation stricte des données (Multi-tenancy).

<a id="fr-frontend"></a>
### 💻 Frontend (Routage & UI)

#### 1. Créer une Nouvelle Route
LaunchKit utilise un **routage basé sur les fichiers**. Pour créer une nouvelle page dans un espace de travail :
1. Créez un fichier : `src/routes/_app/organizations/$slug/ma-page.tsx`.
2. Définissez la route :
   ```tsx
   import { createFileRoute } from '@tanstack/react-router'

   export const Route = createFileRoute('/_app/organizations/$slug/ma-page')({
     component: MaPage,
     loader: async ({ context }) => {
       // Alimente le cache TanStack Query pour le SSR
       await context.queryClient.ensureQueryData(maQueryOptions(context.params.slug));
     }
   })
   ```

#### 2. Requêtes avec SSR (Bonnes Pratiques)
Pour garantir des performances élevées et des pages optimisées pour le SEO :
- **Alimenter le Cache** : Utilisez toujours `queryClient.ensureQueryData` dans le `loader` de la route. Cela évite des requêtes réseau inutiles sur le client lors de l'hydratation.
- **Appels SSR Internes** : Ne faites jamais de `fetch` vers votre propre API via le réseau pendant le SSR. Utilisez des appels directs de fonctions serveur ou des URL relatives via Nitro.
- **Protection des Routes** : Utilisez `beforeLoad` pour vérifier les sessions et les rôles avant tout rendu.

#### 3. Réactivité & Excellence UX
- **Clés Stables** : N'utilisez jamais les index de tableau comme clés. Utilisez toujours des IDs uniques (ex: `key={item.id}`).
- **Réinitialisation d'État** : Lorsqu'un utilisateur change d'organisation, réinitialisez l'état local en utilisant l'ID de l'organisation comme `key` sur le conteneur principal (ex: `<div key={org.id}>`).
- **Pattern d'État Dérivé** : Pour les médias, utilisez un état dérivé pour éviter tout scintillement :
  ```tsx
  const [uploadedImg, setUploadedImg] = useState<string | undefined>()
  const currentImg = uploadedImg || defaultValue // defaultValue provient du SSR/Query
  ```

---

<a id="fr-testing"></a>
## 🧪 Stratégie de Tests

LaunchKit-Better implémente une stratégie de tests multi-couches pour garantir la fiabilité de l'ensemble de la stack.

### 1. Tests Unitaires & d'Intégration (Vitest)
Utilisés pour tester les fonctions serveur, les hooks et les composants UI isolés.
- **Commandes** :
  - Lancer les tests : `pnpm test`
  - Mode Watch : `pnpm test:watch`
  - Mode UI : `npx vitest --ui`
- **Configuration** : Propulsé par **Vitest** et **React Testing Library** avec un environnement JSDOM.
- **Emplacement** : Fichiers se terminant par `.test.ts` ou `.test.tsx` dans le dossier `src/`.

### 2. Tests End-to-End (Playwright)
Utilisés pour tester les flux utilisateurs complets dans de vrais navigateurs.
- **Commandes** :
  - Lancer les tests E2E : `pnpm test:e2e`
  - Mode Interactif : `npx playwright test --ui`
- **Emplacement** : Les scénarios sont situés dans le dossier `e2e/`.

### 3. Couverture de Code (Code Coverage)
Suivez l'avancement de vos tests et identifiez les chemins logiques non testés.
- **Lancer la Couverture** : `pnpm test:coverage`
- **Configuration** : Utilise le fournisseur `v8`. Assurez-vous que `@vitest/coverage-v8` est installé.
- **Rapport** : Un rapport HTML détaillé est généré dans le dossier `coverage/` après l'exécution.

---

<a id="fr-forms"></a>
## 📝 Gestion des Formulaires (TanStack Form)

LaunchKit-Better utilise **TanStack Form** pour la gestion d'état et la validation. Nous imposons des règles strictes de composition d'interface basées sur Base UI.

### Bonnes Pratiques
- **Composition** : Utilisez toujours `<FieldGroup>` et `<Field>` pour structurer vos formulaires. N'utilisez pas de `<div>` avec des classes d'espacement arbitraires.
- **Validation** : Les états d'erreur utilisent les attributs `data-invalid` et `aria-invalid`.
- **Exemple** :
  ```tsx
  import { useForm } from '@tanstack/react-form'
  import { FieldGroup, Field, FieldLabel, Input, FieldDescription } from '@/components/ui'

  export function ProfileForm() {
    const form = useForm({ defaultValues: { email: '' } })
    return (
      <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
        <FieldGroup>
          <form.Field name="email">
            {(field) => (
              <Field data-invalid={field.state.meta.errors.length > 0}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input 
                  id={field.name} 
                  value={field.state.value} 
                  onChange={(e) => field.handleChange(e.target.value)} 
                  aria-invalid={field.state.meta.errors.length > 0} 
                />
                {field.state.meta.errors.map(err => <FieldDescription key={err}>{err}</FieldDescription>)}
              </Field>
            )}
          </form.Field>
        </FieldGroup>
      </form>
    )
  }
  ```

---

<a id="fr-emails"></a>
## 📧 Envoi d'E-mails (Resend)

Les e-mails transactionnels (invitations, réinitialisation de mot de passe) sont gérés par **Resend**.

### Configuration
1. **Créer un Compte** : Inscrivez-vous sur [Resend.com](https://resend.com).
2. **Vérifier le Domaine** : Ajoutez votre domaine dans le dashboard et configurez vos enregistrements DNS.
3. **Générer une clé API** : Créez une clé avec les droits d'envoi.
4. **Environnement** : Ajoutez-la au fichier `.env` :
   ```env
   RESEND_API_KEY="re_123456789"
   ```
5. **Utilisation** : La logique est centralisée dans `lib/email.ts`. Better Auth utilise automatiquement `sendEmail` pour les flux d'authentification.

---

<a id="fr-design"></a>
## 🎨 Design Système & Theming (Base UI / Shadcn)

Notre fondation UI repose sur **Base UI** et est gérée via un CLI Shadcn spécialisé.

### Principes de Theming
- **Couleurs Sémantiques Uniquement** : Utilisez `bg-primary` ou `text-muted-foreground`. N'utilisez **jamais** de valeurs brutes comme `bg-blue-500` ou `dark:bg-slate-900`.
- **Espacement** : Évitez `space-y-*` ou `space-x-*`. Privilégiez `flex flex-col gap-4`.
- **Dimensions** : Utilisez `size-*` pour les largeurs/hauteurs égales (ex: `size-10`).
- **Icônes** : Utilisez `data-icon="inline-start"` pour aligner correctement les icônes dans les boutons.
- **Presets & Personnalisation** : Vous pouvez appliquer un nouveau thème global généré sur [ui.shadcn.com](https://ui.shadcn.com) en lançant :
  ```bash
  npx shadcn@latest apply --preset <votre-code-preset>
  ```

---

<a id="fr-storage"></a>
## 🖼️ Médias & Stockage (Supabase)

LaunchKit-Better utilise **Supabase Storage** pour les avatars, les logos et la galerie d'images.

### 1. Workflow d'Upload Sécurisé
Pour garantir la sécurité de votre `SUPABASE_SERVICE_ROLE_KEY`, nous n'effectuons **jamais** d'uploads directement depuis le client. Nous utilisons une fonction serveur dédiée :

1. **Client** : Le composant `ImageUpload` envoie un `FormData` contenant le fichier au serveur.
2. **Serveur** : La fonction `uploadImage` (`src/server/storage-fns.ts`) reçoit le fichier, valide sa taille/type, et l'upload vers Supabase via la clé service role.
3. **Réponse** : Le serveur renvoie la `publicUrl` du fichier uploadé.

### 2. Invalidation de l'État Global & Réactivité
Lorsqu'un avatar ou un logo est mis à jour, nous forçons l'UI à se rafraîchir partout :
```tsx
const { mutate } = useMutation({
  onSuccess: () => {
    // 1. Invalider les caches TanStack Query
    queryClient.invalidateQueries({ queryKey: ['user-orgs'] })
    // 2. Invalider les loaders TanStack Router (rafraîchit la session et l'état global)
    router.invalidate()
  }
})
```

**Astuce pour une latence zéro** : Dans vos composants, utilisez le **Pattern d'État Dérivé** pour éviter tout scintillement :
```tsx
const [uploadedImg, setUploadedImg] = useState<string | undefined>()
const currentImg = uploadedImg || defaultValue // defaultValue provient de TanStack Query
```
Ceci garantit que le logo en cache de la nouvelle organisation s'affiche **immédiatement**, sans attendre un cycle de re-rendu ou un délai d'effet.

### 3. Configuration
Assurez-vous que votre `.env` contient :
- `VITE_SUPABASE_URL` : L'URL de votre projet Supabase.
- `SUPABASE_SERVICE_ROLE_KEY` : Votre clé service role (uniquement côté serveur).
- **Bucket** : Créez un bucket nommé `avatars` dans votre dashboard Supabase avec un accès public en lecture.

#### Configuration SQL (Supabase Dashboard)
Exécutez ceci dans votre éditeur SQL Supabase pour initialiser le stockage :
```sql
-- 1. Créer le bucket "avatars"
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 2. Autoriser l'accès public en lecture
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'avatars' );

-- 3. Note : Nos fonctions serveur utilisent la Service Role Key, qui contourne les politiques RLS.
```

---

<a id="fr-devops"></a>
## 🚀 DevOps & Déploiement

### Déploiement sur Vercel (Nitro v3)
Ce projet est optimisé pour **Vercel** grâce au moteur ultra-performant Nitro v3.

1. **Configuration du Build** : La commande est pré-configurée dans le `package.json` :
   ```bash
   "build": "NITRO_PRESET=vercel vite build"
   ```
2. **Variables d'Environnement** : Assurez-vous que les variables suivantes sont définies dans votre tableau de bord Vercel :
   - `DATABASE_URL` : Votre chaîne de connexion Supabase.
   - `BETTER_AUTH_SECRET` : Généré via `openssl rand -base64 32`.
   - `BETTER_AUTH_URL` : Votre URL de production (ex: `https://monapp.com`).
3. **Synchronisation DB** : Lancez les synchronisations de schéma avant/après le déploiement :
   ```bash
   npx drizzle-kit push
   ```

---

<a id="fr-setup"></a>
## 🚀 Guide d'Installation

### 1. Variables d'Environnement
Créez votre `.env` à partir de `.env.example` :
```env
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="..."
BETTER_AUTH_URL="http://localhost:3000"
RESEND_API_KEY="re_..."
```

### 2. Synchronisation & Lancement
```bash
pnpm install
npx drizzle-kit push  # Synchronise le schéma avec la base de données
pnpm dev              # Lance le serveur de dev (port 3000)
```

---

<a id="fr-ai"></a>
## 🤖 Développement Assisté par l'IA (Utilisation des Skills)

LaunchKit-Better est conçu pour être utilisé avec des assistants de codage IA (Antigravity/Gemini, Windsurf, Claude, Cursor, etc.). Le dépôt inclut des "Skills" spécialisés dans le dossier `.agents/skills/` qui apprennent à l'IA exactement comment coder pour cette stack technique spécifique.

### Comment utiliser les Skills avec votre IA
Lorsque vous demandez à votre assistant IA de créer une fonctionnalité, mentionnez explicitement (`@mention`) le fichier de skill pertinent ou demandez à l'IA de le lire avant de coder.

- **UI & Composants** : "Crée un nouveau composant de tableau de prix en suivant les règles de `@.agents/skills/shadcn/SKILL.md`." (Cela force l'IA à utiliser Base UI, `FieldGroup`, et les couleurs sémantiques).
- **Authentification** : "Ajoute un bouton de connexion SSO Google. Lis d'abord `@.agents/skills/better-auth-best-practices/SKILL.md` pour comprendre notre configuration."
- **Architecture Générale** : Renvoyez toujours l'IA vers le fichier `@AGENTS.md`, qui agit comme le fichier de contexte suprême pour tout le dépôt.

### 🛠️ Ajouter des Skills Spécialisés
Pour fournir un contexte encore plus riche à votre agent IA, vous pouvez ajouter des "skills" spécialisés pour chaque technologie de notre stack :
```bash
pnpm dlx skills add shadcn/ui    # Composants UI & Base UI
pnpm dlx skills add tanstack    # Router, Query, Start, Form
pnpm dlx skills add drizzle     # Base de données & ORM
pnpm dlx skills add supabase    # Stockage & Infrastructure
pnpm dlx skills add better-auth # Authentification & Organisations
```

*Astuce pro : Plus vous référencez explicitement ces skills markdown dans votre prompt, moins l'IA hallucine, et plus le code généré respectera parfaitement les règles strictes de typage et de composition du projet.*
