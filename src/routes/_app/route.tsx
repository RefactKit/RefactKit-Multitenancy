import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, Outlet, redirect, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { HeaderBreadcrumb } from '@/components/dashboard/header-breadcrumb'
import { SearchCommand } from '@/components/dashboard/search-command'
import { UserAvatar } from '@/components/dashboard/user-avatar'
import { LangSwitcher } from '@/components/shared/lang-switcher'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { getServerSession } from '@/server/auth-fns'
import { userOrgsQuery } from '@/server/query-keys'

export const Route = createFileRoute('/_app')({
  loader: async ({ context, location }) => {
    // Avoid redirecting to login if we are on the public landing page
    if (location.pathname === '/') {
      return { session: null, orgs: [] }
    }

    const { session } = await getServerSession()
    if (!session) throw redirect({ to: '/login' })

    // Seed the cache — downstream routes read from it for free
    const { orgs } = await context.queryClient.ensureQueryData(userOrgsQuery())
    return { session, orgs }
  },
  component: AppLayout,
})

function AppLayout() {
  const { orgs: initialOrgs } = Route.useLoaderData()
  const params = useParams({ strict: false }) as { slug?: string }

  // Use useQuery with initialData from loader to be perfectly reactive
  // but also safe for hydration.
  const { data } = useQuery({
    ...userOrgsQuery(),
    initialData: { orgs: initialOrgs },
  })
  const orgs = data.orgs

  // Keep track of the last active organization slug
  const [lastSlug, setLastSlug] = useState<string | undefined>(params.slug)

  useEffect(() => {
    if (params.slug) {
      setLastSlug(params.slug)
      localStorage.setItem('last-org-slug', params.slug)
    } else {
      const saved = localStorage.getItem('last-org-slug')
      if (saved && orgs.some((o) => o.slug === saved)) {
        setLastSlug(saved)
      }
    }
  }, [params.slug, orgs])

  const effectiveSlug = params.slug || lastSlug || orgs[0]?.slug
  const currentOrg = orgs.find((o) => o.slug === effectiveSlug)

  return (
    <SidebarProvider>
      <AppSidebar orgs={orgs} currentSlug={effectiveSlug} currentOrg={currentOrg} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ms-1" />
            <div className="hidden items-center gap-2 sm:flex">
              <Separator orientation="vertical" className="mx-2 h-4" />
              <HeaderBreadcrumb orgName={currentOrg?.name} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SearchCommand orgs={orgs} />
            <LangSwitcher />
            <ThemeToggle />
            <Link to="/settings" className="ml-1 transition-opacity hover:opacity-80">
              <UserAvatar className="size-8 cursor-pointer ring-1 ring-border" />
            </Link>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
