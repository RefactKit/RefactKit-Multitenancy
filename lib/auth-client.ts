import { sentinelClient } from '@better-auth/infra/client'
import { inferAdditionalFields, organizationClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import type { auth } from './auth'

import { getBaseURL } from '@/lib/base-url'

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [organizationClient(), sentinelClient(), inferAdditionalFields<typeof auth>()],
})

declare module '@better-auth-ui/react' {
  interface AuthConfig {
    AuthClient: typeof authClient
  }
}

export const { signIn, signUp, signOut, useSession } = authClient
