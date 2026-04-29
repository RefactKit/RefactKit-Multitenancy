import { useForm } from '@tanstack/react-form'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { Building2, Check } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { LangSwitcher } from '@/components/shared/lang-switcher'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useI18n } from '@/i18n/context'
import { getServerSession } from '@/server/auth-fns'
import { createOrganization } from '@/server/org-fns'
import { Logo } from './_auth/-shared'
import { ThemeToggle } from '@/components/shared/auth-ui'

export const Route = createFileRoute('/onboarding')({
  loader: async () => {
    const { session } = await getServerSession()
    if (!session) throw redirect({ to: '/login' })
    return {}
  },
  component: OnboardingPage,
})

function OnboardingPage() {
  const { t } = useI18n()
  const l = t.onboarding
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const schema = z.object({
    name: z.string().min(2, l.nameMin).max(64, l.nameMax),
  })

  const form = useForm({
    defaultValues: { name: '' },
    validators: { onSubmit: schema },
    onSubmit: async ({ value }) => {
      try {
        const result = await createOrganization({ data: { name: value.name } } as any)
        queryClient.invalidateQueries({ queryKey: ['user-orgs'] })
        // Navigate to the new org's dashboard using its slug
        navigate({
          to: '/organizations/$slug/dashboard',
          params: { slug: result.org.slug },
          search: { page: 1 },
        })
      } catch (err: any) {
        if (err?.message === 'Organization name already taken') {
          toast.error(t.onboarding.nameTaken)
        } else {
          toast.error(err?.message ?? l.error)
        }
      }
    },
  })

  return (
    <div className="flex min-h-screen overflow-hidden bg-white dark:bg-gray-950">
      {/* Left */}
      <div className="relative hidden w-1/2 flex-col lg:flex">
        <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-teal-500/5 blur-[140px]" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <Logo />
          <div className="max-w-md">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/8 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              <span className="text-xs font-medium text-teal-700 dark:text-teal-400">
                {l.badge}
              </span>
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-gray-900 dark:text-white">
              {l.heading}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-gray-500 dark:text-gray-400">
              {l.subheading}
            </p>
            <ul className="mt-8 space-y-3">
              {l.features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-500/20">
                    <Check className="h-3 w-3 text-teal-600 dark:text-teal-400" strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-600">
            {t.common.copyright.replace('{{year}}', String(new Date().getFullYear()))}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex w-full flex-col overflow-y-auto lg:w-1/2">
        <header className="flex h-14 items-center justify-between border-b border-gray-200 px-5 dark:border-gray-800 lg:hidden">
          <Logo />
          <div className="flex items-center gap-2">
            <LangSwitcher />
            <ThemeToggle />
          </div>
        </header>
        <div className="absolute right-6 top-5 hidden items-center gap-2 lg:flex">
          <LangSwitcher />
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-5 py-10">
          <div className="w-full max-w-[360px] flex flex-col gap-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/10">
                <Building2 className="h-7 w-7 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{l.title}</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{l.subtitle}</p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
              className="flex flex-col gap-4"
            >
              <form.Field name="name">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={field.name}>{l.nameLabel}</Label>
                    <Input
                      id={field.name}
                      type="text"
                      autoComplete="organization"
                      placeholder={l.namePlaceholder}
                      autoFocus
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.isTouched && field.state.meta.errors[0] && (
                      <p className="text-xs text-red-500">{String(field.state.meta.errors[0])}</p>
                    )}
                  </div>
                )}
              </form.Field>
              <form.Subscribe selector={(s) => s.isSubmitting}>
                {(isSubmitting) => (
                  <Button type="submit" disabled={isSubmitting} className="h-10 w-full">
                    {isSubmitting ? l.submitting : l.submit}
                  </Button>
                )}
              </form.Subscribe>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
