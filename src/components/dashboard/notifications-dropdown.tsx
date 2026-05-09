import { useQuery } from '@tanstack/react-query'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
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
import { Bell } from 'lucide-react'
import { authClient, useSession } from '../../../lib/auth-client'

interface NotificationsDropdownProps {
  organizationId?: string
}

interface ActivityItem {
  id: string
  type: 'member_joined' | 'invitation_received' | 'invitation_accepted'
  userName: string
  userImage?: string | null
  initials: string
  description: string
  target: string
  time: string
  unread: boolean
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export function NotificationsDropdown({ organizationId }: NotificationsDropdownProps) {
  const { t } = useI18n()
  const { data: session } = useSession()
  const currentUserId = session?.user?.id

  // ── Query 1: Org-level activity (for admins) ──
  // Shows: members who recently JOINED (accepted invitations)
  // Does NOT show: pending invitations the admin sent (they already know)
  const { data: orgActivities = [] } = useQuery<ActivityItem[]>({
    queryKey: ['org-activity', organizationId],
    enabled: !!organizationId,
    refetchInterval: 30000,
    queryFn: async () => {
      if (!organizationId) return []

      await authClient.organization.setActive({ organizationId })
      const { data } = await authClient.organization.getFullOrganization()
      if (!data) return []

      const items: ActivityItem[] = []
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

      // Recent members who JOINED (exclude yourself)
      for (const member of data.members ?? []) {
        if (member.userId === currentUserId) continue // Skip self
        const joinedDate = new Date(member.createdAt)
        if (joinedDate > sevenDaysAgo) {
          items.push({
            id: `member-${member.id}`,
            type: 'member_joined',
            userName: member.user?.name || 'Unknown',
            userImage: member.user?.image,
            initials: getInitials(member.user?.name || 'U'),
            description: t.notifications?.memberJoined ?? 'joined the organization',
            target: data.name,
            time: timeAgo(member.createdAt),
            unread: joinedDate > oneDayAgo,
          })
        }
      }

      return items
    },
  })

  // ── Query 2: User-level invitations (for the current user) ──
  // Shows: invitations the current user has RECEIVED from any org
  // This is the key fix: dorosera sees "You were invited to join RefactKit Studio"
  const { data: userInvitations = [] } = useQuery<ActivityItem[]>({
    queryKey: ['user-invitations', currentUserId],
    enabled: !!currentUserId,
    refetchInterval: 30000,
    queryFn: async () => {
      if (!currentUserId) return []

      const { data: invitations } = await authClient.organization.listUserInvitations()
      if (!invitations) return []

      const items: ActivityItem[] = []

      for (const inv of invitations) {
        if (inv.status === 'pending') {
          items.push({
            id: `inv-received-${inv.id}`,
            type: 'invitation_received',
            userName: inv.inviter?.name || inv.inviter?.email || 'Someone',
            userImage: inv.inviter?.image || null,
            initials: getInitials(inv.inviter?.name || inv.inviter?.email || 'S'),
            description: t.notifications?.invitedYou ?? 'invited you to join',
            target: inv.organization?.name || inv.organizationId,
            time: timeAgo(inv.createdAt ?? new Date().toISOString()),
            unread: true,
          })
        }
      }

      return items
    },
  })

  // Merge both sources: user invitations first (more urgent), then org activity
  const activities = [...userInvitations, ...orgActivities].slice(0, 10)
  const unreadCount = activities.filter((n) => n.unread).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon-sm" className="rounded-full" />}
      >
        <div className="relative">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2 rounded-full bg-red-400 ring-1.5 ring-background">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            </span>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" sideOffset={8}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center justify-between">
            <span className="font-semibold text-sm">{t.sidebar.notifications}</span>
            {unreadCount > 0 && (
              <span className="text-primary text-xs font-medium">
                {unreadCount} {t.notifications?.newLabel ?? 'new'}
              </span>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
            {activities.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {t.notifications?.empty ?? 'No recent activity'}
              </div>
            ) : (
              activities.map((activity) => (
                <DropdownMenuItem
                  key={activity.id}
                  className="flex items-start gap-3 py-3 px-3 cursor-pointer"
                >
                  <Avatar className="mt-0.5 size-8 shrink-0">
                    <AvatarImage src={activity.userImage || undefined} alt={activity.userName} />
                    <AvatarFallback className="text-[10px]">{activity.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <p className="text-sm leading-snug">
                      <span className="font-semibold">{activity.userName}</span>{' '}
                      <span className="text-muted-foreground">{activity.description}</span>{' '}
                      <span className="font-semibold">{activity.target}</span>
                    </p>
                    <span className="text-[11px] text-muted-foreground/70 font-medium">
                      {activity.time}
                    </span>
                  </div>
                  {activity.unread && (
                    <span className="bg-primary mt-2 size-2 shrink-0 rounded-full" />
                  )}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="justify-center text-xs font-medium text-muted-foreground hover:text-foreground py-2 cursor-pointer">
            {t.notifications?.viewAll ?? 'View all notifications'}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
