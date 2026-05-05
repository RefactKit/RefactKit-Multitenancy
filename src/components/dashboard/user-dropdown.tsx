import { useAuth } from '@better-auth-ui/react'
import { Bell, CreditCard, SealCheck, SignOut, Sparkle } from '@phosphor-icons/react'
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
import { useI18n } from '@/i18n/context'
import { useSession } from '../../../lib/auth-client'
import { UserAvatar } from './user-avatar'

interface UserDropdownProps {
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
}

export function UserDropdown({ children, side = 'bottom', align = 'end' }: UserDropdownProps) {
  const { data: session } = useSession()
  const { basePaths, viewPaths, Link } = useAuth()
  const { t } = useI18n()
  const router = useRouter()

  if (!session) return null
  const user = session.user

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent side={side} align={align} sideOffset={4} className="min-w-56 rounded-lg">
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
  )
}
