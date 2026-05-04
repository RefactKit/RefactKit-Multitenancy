import { CaretRight } from '@phosphor-icons/react'
import { useMatchRoute, useNavigate } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

interface NavItem {
  title: string
  to: string
  search?: Record<string, any>
  icon: React.ElementType
  items?: {
    title: string
    to: string
    search?: Record<string, any>
  }[]
}

export function NavMain({
  items,
  label,
  collapsible = false,
}: {
  items: NavItem[]
  label?: string
  collapsible?: boolean
}) {
  const navigate = useNavigate()
  const matchRoute = useMatchRoute()

  if (items.length === 0) return null

  const groupContent = (
    <SidebarMenu>
      {items.map((item) => {
        const isActive = !!matchRoute({
          to: item.to,
          fuzzy: item.to !== '/organizations',
        })

        if (item.items && item.items.length > 0) {
          return (
            <Collapsible
              key={item.title}
              render={<SidebarMenuItem />}
              defaultOpen={isActive}
              className="group/collapsible"
            >
              <CollapsibleTrigger render={<SidebarMenuButton tooltip={item.title} />}>
                {item.icon && (
                  <item.icon
                    weight={isActive ? 'duotone' : 'regular'}
                    className="size-5 text-primary"
                  />
                )}
                <span>{item.title}</span>
                <CaretRight
                  weight="bold"
                  className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        isActive={!!matchRoute({ to: subItem.to, fuzzy: true })}
                        render={
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              navigate({ to: subItem.to as any, search: subItem.search })
                            }}
                          />
                        }
                      >
                        <span>{subItem.title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          )
        }

        return (
          <SidebarMenuItem key={item.to}>
            <SidebarMenuButton
              isActive={isActive}
              tooltip={item.title}
              onClick={() => navigate({ to: item.to, search: item.search })}
            >
              <item.icon
                weight={isActive ? 'duotone' : 'regular'}
                className="size-5 text-primary"
              />
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )

  if (collapsible) {
    return (
      <Collapsible
        defaultOpen
        className="group/collapsible-group group-data-[collapsible=icon]:hidden"
      >
        <SidebarGroup>
          {label && (
            <SidebarGroupLabel aschild>
              <CollapsibleTrigger className="flex w-full items-center justify-between hover:text-foreground transition-colors group">
                <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
                <ChevronRight className="size-3.5 transition-transform duration-200 group-data-[state=open]/collapsible-group:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
          )}
          <CollapsibleContent>
            <div className="ml-3 mt-1 flex flex-col gap-1 border-l border-border/60 pl-2">
              {groupContent}
            </div>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    )
  }

  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      {groupContent}
    </SidebarGroup>
  )
}
