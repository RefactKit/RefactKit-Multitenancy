import { Folder, User, Mail, Trash2, Pencil, Globe } from 'lucide-react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/context'
import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { authClient } from 'lib/auth-client'

interface ProjectCardProps {
  id: string
  slug: string
  title: string
  description: string | null
  fileCount: number
  ownerName: string
  ownerEmail: string
  updatedAt: Date | string
  type?: string | null
  onDelete?: () => void
  onEdit?: () => void
  userRole?: string
  orgSlug: string
  permissions?: any
}

export function ProjectCard({
  id,
  title,
  description,
  fileCount,
  ownerName,
  ownerEmail,
  updatedAt,
  type,
  onDelete,
  onEdit,
  userRole,
  orgSlug,
  permissions,
}: ProjectCardProps) {
  const { t, dateLocale } = useI18n()

  const hasPermission = (resource: string, action: string) => {
    if (userRole === 'owner') return true
    if (permissions && permissions[resource]) {
      return permissions[resource].includes(action)
    }
    // Fallback to static check if no dynamic permissions loaded
    if (userRole) {
      return authClient.organization.checkRolePermission({
        role: userRole,
        permission: {
          [resource]: [action as any],
        },
      })
    }
    return false
  }

  const canDelete = hasPermission('project', 'delete')
  const canUpdate = hasPermission('project', 'update')

  const formattedDate = new Date(updatedAt).toLocaleDateString(dateLocale, {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  })

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className="h-full">
      <Card
        size="sm"
        className="h-full flex flex-col overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-colors hover:border-primary/30 group"
      >
        <CardHeader>
          <div className="row-span-2 flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Folder className="size-5" />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <div className="group-hover:text-primary transition-colors">
                <CardTitle className="truncate">
                  <Link
                    to="/organizations/$slug/projects/$projectId"
                    params={{ slug: orgSlug, projectId: id }}
                  >
                    {title}
                  </Link>
                </CardTitle>
              </div>
              <CardDescription>
                {fileCount} {fileCount === 1 ? t.projects.card.files : t.projects.card.files_plural}
              </CardDescription>
            </div>
          </div>
          <CardAction>
            <Badge
              variant="outline"
              className="shrink-0 px-2 py-0.5 text-xs font-medium rounded-lg"
            >
              {fileCount}
            </Badge>
          </CardAction>
        </CardHeader>

        <CardContent className="flex-1">
          <div className="flex flex-col gap-2">
            <CardDescription className="line-clamp-2">
              {description || t.projects.form.noDescription}
            </CardDescription>

            {type && (
              <Badge
                variant="secondary"
                className="px-1.5 py-0 text-[10px] font-semibold uppercase tracking-wider"
              >
                {type}
              </Badge>
            )}

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <User className="size-3.5 text-muted-foreground" />
                <span className="truncate">{ownerName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <Mail className="size-3.5 text-muted-foreground" />
                <span className="truncate">{ownerEmail}</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5">
            {canUpdate && (
              <Button
                variant="ghost"
                size="icon-xs"
                className="bg-muted/40 hover:bg-primary/10 hover:text-primary"
                onClick={onEdit}
              >
                <Pencil data-icon="inline-start" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon-xs"
              className="bg-muted/40 hover:bg-primary/10 hover:text-primary"
              render={
                <Link
                  to="/organizations/$slug/projects/$projectId"
                  params={{ slug: orgSlug, projectId: id }}
                />
              }
            >
              <Globe data-icon="inline-start" />
            </Button>
            {canDelete && (
              <Button
                variant="ghost"
                size="icon-xs"
                className="bg-muted/40 hover:bg-destructive/10 hover:text-destructive"
                onClick={onDelete}
              >
                <Trash2 data-icon="inline-start" />
              </Button>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            {t.projects.card.lastUpdated} {formattedDate}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
