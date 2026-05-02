import { dash } from '@better-auth/infra'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { createAccessControl, organization } from 'better-auth/plugins'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { db } from '../db/index'
import { sendEmail } from './email'
import { getBaseURL } from './env'

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
    'https://launch-kit-multitenancy.vercel.app', // Your production domain
    'https://refactkit.com',
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ],

  database: drizzleAdapter(db, { provider: 'pg' }),

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
    minPasswordLength: 12,
    maxPasswordLength: 128, // Prevent DoS via bcrypt long-password attacks
    resetPasswordTokenExpiresIn: 60 * 30, // 30 min (default is 1 hour)
    sendResetPassword: async ({ user, url }) => {
      sendEmail({
        to: user.email,
        subject: 'Reset your password',
        html: `<p>Click the link below to reset your password:</p><a href="${url}">Reset Password</a>`,
      })
    },
    // Called when someone tries to sign up with an already-registered email.
    // Because requireEmailVerification: true enables anti-enumeration mode,
    // the API always returns 200 OK — so we notify the real account owner instead.
    onExistingUserSignUp: async ({ user }) => {
      const loginUrl = `${getBaseURL()}/login`
      sendEmail({
        to: user.email,
        subject: 'Sign-in attempt on your account',
        html: `
          <p>Hi ${user.name || 'there'},</p>
          <p>Someone tried to create a new account using your email address <strong>${user.email}</strong>.</p>
          <p>If this was you and you've forgotten your password, you can reset it from the login page:</p>
          <p><a href="${loginUrl}">Go to login</a></p>
          <p>If this wasn't you, you can safely ignore this email — your account is secure.</p>
        `,
      })
    },
  },

  // OWASP: Brute force protection — persistent DB storage survives Vercel restarts
  rateLimit: {
    enabled: true,
    storage: 'database',
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
          console.log(`[AUDIT] New session created for user: ${data.userId}`)
        },
      },
    },
    user: {
      update: {
        after: async ({ data, oldData }) => {
          if (oldData?.email !== data.email) {
            console.log(`[AUDIT] Email changed for user ${data.id}: ${oldData?.email} → ${data.email}`)
          }
        },
      },
    },
  },

  advanced: {
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
        html: `<p>Click the link below to verify your email:</p><a href="${url}">Verify Email</a>`,
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
          subject: `Join ${data.organization.name} on LaunchKIT`,
          html: `
            <p><strong>${data.inviter.user.name || 'Someone'}</strong> invited you to join <strong>${data.organization.name}</strong>.</p>
            <p><a href="${acceptUrl}">Click here to accept the invitation</a></p>
          `,
        })
      },
    }),
    tanstackStartCookies(),
  ], // must be last
})
