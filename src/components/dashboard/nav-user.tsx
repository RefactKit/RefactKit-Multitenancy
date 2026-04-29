import { useAuth, useSession } from '@better-auth-ui/react'
import { Bell, CaretUpDown, CreditCard, SealCheck, SignOut, Sparkle } from '@phosphor-icons/react'
import { useRouter } from '@tanstack/react-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useI18n } from '@/i18n/context'
import { UserAvatar } from './user-avatar'

export function NavUser() {
  const { isMobile } = useSidebar()
  const { data: session } = useSession()
  const { basePaths, viewPaths, Link } = useAuth()
  const { t } = useI18n()
  const router = useRouter()

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
            <CaretUpDown weight="bold" className="ml-auto size-4 text-muted-foreground/60" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
            className="min-w-56 rounded-lg"
          >
            <div className="flex items-center gap-2 px-2 py-2 text-left text-sm border-b border-border mb-1">
              <UserAvatar className="rounded-lg" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
            </div>

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkle className="size-5 text-muted-foreground" />
                {t.sidebar.upgradeToPro}
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                render={<Link href={`${basePaths.settings}/${viewPaths.settings.account}`} />}
              >
                <SealCheck className="size-5 text-muted-foreground" />
                {t.sidebar.account}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="size-5 text-muted-foreground" />
                {t.sidebar.billing}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="size-5 text-muted-foreground" />
                {t.sidebar.notifications}
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.navigate({ to: '/logout' })}
                render={<Link href={`${basePaths.auth}/${viewPaths.auth.signOut}`} />}
              >
                <SignOut className="size-5 text-muted-foreground" />
                {t.sidebar.logOut}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
