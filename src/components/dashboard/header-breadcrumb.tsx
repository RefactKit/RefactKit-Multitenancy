import { Link, useLocation, useParams } from '@tanstack/react-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useI18n } from '@/i18n/context'

interface HeaderBreadcrumbProps {
  orgName?: string
}

export function HeaderBreadcrumb({ orgName }: HeaderBreadcrumbProps) {
  const { t } = useI18n()
  const { pathname } = useLocation()
  const { slug } = useParams({ strict: false }) as { slug?: string }

  // Break down the path to determine current page
  const segments = pathname.split('/').filter(Boolean)
  const _isOrgPath = segments.includes('organizations')
  const lastSegment = segments[segments.length - 1]

  // Detect current view/page for titles
  const getPageConfig = () => {
    if (lastSegment === 'dashboard') return { title: t.sidebar.dashboard }
    if (lastSegment === 'gallery') return { title: t.sidebar.gallery }
    if (lastSegment === 'members') return { title: t.sidebar.members }
    if (lastSegment === 'settings') return { title: t.sidebar.settings }

    // Global Settings Page
    if (pathname.includes('/settings')) {
      const search = window.location.search
      let subPage = 'Général' // Fallback to 'Account' / 'Général'
      if (search.includes('view=security')) subPage = 'Sécurité'
      if (search.includes('view=appearance')) subPage = 'Apparence'

      return {
        parent: { title: t.sidebar.accountSettings, to: '/settings' },
        title: subPage,
      }
    }

    return { title: '' }
  }

  const { title: pageTitle, parent } = getPageConfig()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Organization Name (Link to Dashboard) */}
        {slug && (
          <>
            <BreadcrumbItem>
              <Link
                to={`/organizations/${slug}/dashboard`}
                className="font-medium text-foreground transition-colors hover:text-foreground/80"
              >
                {orgName ?? slug}
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        {/* Parent Page (if defined) */}
        {parent && (
          <>
            <BreadcrumbItem>
              <Link
                to={parent.to}
                search={{ view: 'account' }}
                className="font-medium text-foreground transition-colors hover:text-foreground/80"
              >
                {parent.title}
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        {/* Current Page */}
        {pageTitle && (
          <BreadcrumbItem>
            <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
