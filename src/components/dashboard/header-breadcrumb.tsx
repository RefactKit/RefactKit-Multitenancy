import { useLocation, useParams } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Image,
  Users,
  Settings,
  LayoutGrid,
} from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
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
  const lastSegment = segments[segments.length - 1]

  // Detect current view/page for titles
  const getPageConfig = () => {
    if (lastSegment === 'dashboard') return { title: t.sidebar.dashboard, icon: LayoutDashboard }
    if (lastSegment === 'gallery') return { title: t.sidebar.gallery, icon: Image }
    if (lastSegment === 'members') return { title: t.sidebar.members, icon: Users }
    if (lastSegment === 'settings') return { title: t.sidebar.settings, icon: Settings }
    if (lastSegment === 'projects') return { title: t.projects.title, icon: LayoutGrid }

    // Individual Project Page
    if (pathname.includes('/projects/') && lastSegment !== 'projects') {
      return {
        parent: { title: t.projects.title, to: `/organizations/${slug}/projects` },
        title: t.projects.studio.labeling,
        icon: LayoutGrid,
      }
    }

    // Global Settings Page
    if (pathname.includes('/settings')) {
      const search = window.location.search
      let subPage = 'Général'
      if (search.includes('view=security')) subPage = 'Sécurité'
      if (search.includes('view=appearance')) subPage = 'Apparence'

      return {
        parent: { title: t.sidebar.accountSettings, to: '/settings' },
        title: subPage,
        icon: Settings,
      }
    }

    return { title: '' }
  }

  const { title: pageTitle, icon: PageIcon } = getPageConfig()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pageTitle && (
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              {PageIcon && <PageIcon className="size-3.5" />}
              {pageTitle}
            </BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
