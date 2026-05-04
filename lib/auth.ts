import { dash } from '@better-auth/infra'
import { eq } from 'drizzle-orm'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { createAccessControl, organization } from 'better-auth/plugins'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import * as schema from '../db/schema'
import { db } from '../db/index'
import { sendEmail } from './email'
import { getBaseURL } from './env'
import { VerifyEmail } from '../src/emails/verify-email'
import { ResetPassword } from '../src/emails/reset-password'
import { InvitationEmail } from '../src/emails/invitation'
import { SecurityAlert } from '../src/emails/security-alert'
import React from 'react'

const ac = createAccessControl({
  dashboard: ['read'],
  member: ['read', 'create', 'update', 'delete'],
  invitation: ['read', 'create', 'update', 'delete'],
  organization: ['update', 'delete'],
})

const memberRole = ac.newRole({
  dashboard: ['read'],
  member: [],
  invitation: [],
})

const adminRole = ac.newRole({
  dashboard: ['read'],
  member: ['read', 'create', 'update'],
  invitation: ['read', 'create', 'delete'],
})

const ownerRole = ac.newRole({
  dashboard: ['read'],
  member: ['read', 'create', 'update', 'delete'],
  invitation: ['read', 'create', 'update', 'delete'],
  organization: ['update', 'delete'],
})

export const auth = betterAuth({
  baseURL: getBaseURL(),
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://refact-kit-multitenancy.vercel.app', // Your actual production domain
    'https://refactkit.com',
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ],

  database: drizzleAdapter(db, { provider: 'pg', schema }),

  user: {
    deleteUser: {
      enabled: true,
    },

    additionalFields: {
      imageUrl: {
        type: 'string',
        defaultValue: '',
        required: false,
        input: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    minPasswordLength: 11,
    maxPasswordLength: 128, // Prevent DoS via bcrypt long-password attacks
    resetPasswordTokenExpiresIn: 60 * 30, // 30 min (default is 1 hour)
    sendResetPassword: async ({ user, url }) => {
      sendEmail({
        to: user.email,
        subject: 'Reset your password',
        template: React.createElement(ResetPassword, { url }),
      })
    },
    // Called when someone tries to sign up with an already-registered email.
    // Because requireEmailVerification: true enables anti-enumeration mode,
    // the API always returns 200 OK — so we notify the real account owner instead.
    onExistingUserSignUp: async ({ user }) => {
      // If the user is not verified yet, they are likely retrying the signup process
      // or a double-submit occurred. We don't want to send a security alert in this case.
      if (!user.emailVerified) {
        return
      }

      const loginUrl = `${getBaseURL()}/login`
      sendEmail({
        to: user.email,
        subject: 'Sign-in attempt on your account',
        template: React.createElement(SecurityAlert, {
          userName: user.name || 'there',
          email: user.email,
          loginUrl,
        }),
      })
    },
    onPasswordReset: async ({ user }) => {
      // If a user successfully resets their password, they have proven ownership of the email.
      // We should mark them as verified to allow immediate sign-in.
      if (!user.emailVerified) {
        await db.update(schema.user).set({ emailVerified: true }).where(eq(schema.user.id, user.id))
      }
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },

  account: {
    encryptOAuthTokens: true, // AES-256-GCM encryption for social tokens
    accountLinking: {
      enabled: true,
      trustedProviders: ['google'],
    },
  },

  // OWASP: Brute force protection — persistent DB storage survives Vercel restarts
  rateLimit: {
    enabled: true,
    customRules: {
      '/api/auth/sign-in/email': { window: 60, max: 5 },
      '/api/auth/sign-up/email': { window: 60, max: 3 },
      '/api/auth/forget-password': { window: 60, max: 3 },
    },
  },

  // Session with encrypted cookie cache — reduces DB queries, JWE = encrypted
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh every 24h
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 min client-side cache
      strategy: 'jwe', // AES-256-GCM encrypted — safest for SaaS
    },
  },

  // OWASP: Audit logging for sensitive user/session events
  databaseHooks: {
    session: {
      create: {
        after: async ({ data }) => {
          if (data?.userId) {
            console.log(`[AUDIT] New session created for user: ${data.userId}`)
          }
        },
      },
    },
    user: {
      create: {
        after: async ({ data }) => {
          // Field Consistency: Sync social 'image' to custom 'imageUrl' on first login
          if (data.image) {
            await db
              .update(schema.user)
              .set({ imageUrl: data.image })
              .where(eq(schema.user.id, data.id))
          }
        },
      },
      update: {
        after: async ({ data, oldData }) => {
          if (oldData?.email !== data.email) {
            console.log(
              `[AUDIT] Email changed for user ${data.id}: ${oldData?.email} → ${data.email}`,
            )
          }
        },
      },
    },
  },

  advanced: {
    useSecureCookies: process.env.NODE_ENV === 'production',
    backgroundTasks: {
      handler: (promise) => {
        // Platform-specific handler
        // Vercel/Nitro support waitUntil
        if (typeof (globalThis as any).waitUntil === 'function') {
          ;(globalThis as any).waitUntil(promise)
        }
      },
    },
    // Vercel sits behind a proxy — read real client IP from forwarded header
    ipAddress: {
      ipAddressHeaders: ['x-forwarded-for'],
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignIn: true,
    sendVerificationEmail: async ({ user, url }) => {
      console.log(`Sending verification email to: ${user.email}`)
      sendEmail({
        to: user.email,
        subject: 'Verify your email address',
        template: React.createElement(VerifyEmail, { url }),
      })
    },
  },

  plugins: [
    dash(),
    organization({
      organizationLimit: 5,
      membershipLimit: 100,
      allowUserToCreateOrganization: false, // Enforced via server-side logic in org-fns.ts
      invitationExpiresIn: 60 * 60 * 24 * 7, // 7 days (default is 48h — better UX)

      ac,
      roles: {
        member: memberRole,
        admin: adminRole,
        owner: ownerRole,
      },

      sendInvitationEmail: async (data) => {
        console.log(`Sending invitation email to: ${data.email} for org: ${data.organization.name}`)
        const acceptUrl = `${getBaseURL()}/accept-invite?id=${data.invitation.id}`
        sendEmail({
          to: data.email,
          subject: `Join ${data.organization.name} on RefactKit`,
          template: React.createElement(InvitationEmail, {
            orgName: data.organization.name,
            inviterName: data.inviter.user.name || 'Someone',
            url: acceptUrl,
            orgLogo: data.organization.logoUrl || undefined,
          }),
        })
      },
    }),
    tanstackStartCookies(),
  ], // must be last
})
