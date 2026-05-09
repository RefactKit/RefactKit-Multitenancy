import { Badge } from '@/components/ui/badge'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell } from 'lucide-react'

const notifications = [
  {
    id: "1",
    user: "Sarah",
    avatar:
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
    initials: "SC",
    action: "commented on",
    target: "Design System v2",
    time: "2 min ago",
    unread: false,
  },
  {
    id: "2",
    user: "James Wilson",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&dpr=2&q=80",
    initials: "JW",
    action: "shared",
    target: "Q4 Report",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: "3",
    user: "Emily Davis",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80",
    initials: "ED",
    action: "invited you to",
    target: "Project Alpha",
    time: "3 hours ago",
    unread: false,
  },
]

export function NotificationsDropdown() {
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon-sm" className="relative rounded-full" />}
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <Badge
            className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-background p-0 text-[10px]"
          >
            {unreadCount}
          </Badge>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" sideOffset={8}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center justify-between">
            <span className="font-semibold text-sm">Notifications</span>
            <button className="text-primary text-xs font-medium hover:underline cursor-pointer">
              Mark all as read
            </button>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex items-start gap-3 py-3 px-3 cursor-pointer"
              >
                <Avatar className="mt-0.5 size-8 shrink-0">
                  <AvatarImage
                    src={notification.avatar}
                    alt={notification.user}
                  />
                  <AvatarFallback className="text-[10px]">{notification.initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col gap-0.5">
                  <p className="text-sm leading-snug">
                    <span className="font-semibold">{notification.user}</span>{" "}
                    <span className="text-muted-foreground">
                      {notification.action}
                    </span>{" "}
                    <span className="font-semibold">{notification.target}</span>
                  </p>
                  <span className="text-[11px] text-muted-foreground/70 font-medium">
                    {notification.time}
                  </span>
                </div>
                {notification.unread && (
                  <span className="bg-primary mt-2 size-2 shrink-0 rounded-full" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="justify-center text-xs font-medium text-muted-foreground hover:text-foreground py-2 cursor-pointer">
            View all notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
