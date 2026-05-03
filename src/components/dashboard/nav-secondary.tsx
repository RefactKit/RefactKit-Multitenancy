import React from 'react'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import type { LucideIcon } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

interface NavSecondaryItem {
  title: string
  url: string
  icon: LucideIcon
  isExternal?: boolean
}

export function NavSecondary({
  items,
  ...props
}: {
  items: NavSecondaryItem[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const navigate = useNavigate()

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                {item.isExternal ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 w-full"
                  >
                    <item.icon className="size-4 shrink-0" />
                    <span>{item.title}</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate({ to: item.url })}
                    className="flex items-center gap-2 w-full"
                  >
                    <item.icon className="size-4 shrink-0" />
                    <span>{item.title}</span>
                  </button>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
