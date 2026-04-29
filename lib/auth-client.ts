import { sentinelClient } from '@better-auth/infra/client'
import { inferAdditionalFields, organizationClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import type { auth } from './auth'

export const authClient = createAuthClient({
  // Use VITE_APP_URL if provided, otherwise default to undefined
  // to force relative URLs which works best for unified SSR apps.
  baseURL: import.meta.env.VITE_APP_URL || undefined,
  plugins: [organizationClient(), sentinelClient(), inferAdditionalFields<typeof auth>()],
})

declare module '@better-auth-ui/react' {
  interface AuthConfig {
    AuthClient: typeof authClient
  }
}

export const { signIn, signUp, signOut, useSession } = authClient
