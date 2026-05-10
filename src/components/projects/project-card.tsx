import { Folder, MoreHorizontal, User, Mail, Trash2, Pencil, Globe, Calendar } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/context'
import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

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
}

export function ProjectCard({
  id,
  slug,
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
}: ProjectCardProps) {
  const { t, dateLocale } = useI18n()
  const canDelete = userRole === 'owner' || userRole === 'admin'

  const formattedDate = new Date(updatedAt).toLocaleDateString(dateLocale, {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  })

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="h-full">
      <Card className="h-full flex flex-col overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-colors hover:border-primary/30 group">
        <CardHeader className="flex flex-row items-start justify-between p-6 pb-2">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Folder className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg leading-tight tracking-tight group-hover:text-primary transition-colors">
                <Link
                  to="/organizations/$slug/projects/$projectId"
                  params={{ slug: orgSlug, projectId: id }}
                >
                  {title}
                </Link>
              </h3>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="px-1.5 py-0 text-[10px] font-semibold uppercase tracking-wider"
                >
                  {fileCount}{' '}
                  {fileCount === 1 ? t.projects.card.files : t.projects.card.files_plural}
                </Badge>
                {type && (
                  <Badge
                    variant="outline"
                    className="px-1.5 py-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {type}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-4 flex-1">
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-6">
            {description || 'No description provided.'}
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-sm text-foreground/70">
              <User className="size-4 text-muted-foreground" />
              <span className="truncate">{ownerName}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-foreground/70">
              <Mail className="size-4 text-muted-foreground" />
              <span className="truncate">{ownerEmail}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-2 border-t border-border/40 bg-muted/20 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg hover:bg-primary/10 hover:text-primary"
              onClick={onEdit}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg hover:bg-primary/10 hover:text-primary"
              asChild
            >
              <Link
                to="/organizations/$slug/projects/$projectId"
                params={{ slug: orgSlug, projectId: id }}
              >
                <Globe className="size-4" />
              </Link>
            </Button>
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
            {t.projects.card.lastUpdated} {formattedDate}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
