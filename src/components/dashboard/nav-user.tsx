import { useAuth } from '@better-auth-ui/react'
import { Bell, CaretUpDown, CreditCard, SealCheck, SignOut, Sparkle } from '@phosphor-icons/react'
import { useRouter } from '@tanstack/react-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { useI18n } from '@/i18n/context'
import { useSession } from '../../../lib/auth-client'
import { UserAvatar } from './user-avatar'

export function NavUser() {
  const { isMobile } = useSidebar()
  const { data: session, isPending } = useSession()
  const { basePaths, viewPaths, Link } = useAuth()
  const { t } = useI18n()
  const router = useRouter()

  if (isPending) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-3.5 px-3 h-14 w-full">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <div className="grid flex-1 gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  if (!session) return null
  const user = session.user

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="w-full"
            render={
              <SidebarMenuButton
                size="lg"
                className="h-14 gap-3.5 data-[popup-open]:bg-sidebar-accent data-[popup-open]:text-sidebar-accent-foreground px-3"
              />
            }
          >
            <UserAvatar className="rounded-xl size-9" />
            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate font-semibold text-[15px]">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground/70">{user.email}</span>
            </div>
            <CaretUpDown weight="bold" className="ml-auto text-muted-foreground/60" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
            className="min-w-56 rounded-lg"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <UserAvatar className="size-8 rounded-lg" />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkle />
                {t.sidebar.upgradeToPro}
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                render={<Link href={`${basePaths.settings}/${viewPaths.settings.account}`} />}
              >
                <SealCheck />
                {t.sidebar.account}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                {t.sidebar.billing}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                {t.sidebar.notifications}
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.navigate({ to: '/logout' })}
                render={<Link href={`${basePaths.auth}/${viewPaths.auth.signOut}`} />}
              >
                <SignOut />
                {t.sidebar.logOut}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
