import { Folder, User, Trash2, Pencil, Globe, MoreVertical, Copy, Share2, ExternalLink } from 'lucide-react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {

  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { useI18n } from '@/i18n/context'
import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { authClient } from 'lib/auth-client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

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
  topImages?: string[] | null
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
  topImages,
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
          <div className="row-span-2 flex items-center gap-3 min-w-0">
            {topImages && topImages.length > 0 ? (
              <div className="flex -space-x-2 shrink-0">
                {topImages.map((src, index) => (
                  <Avatar key={index} className="size-8 ring-background ring-2">
                    <AvatarImage src={src} className="object-cover" />
                    <AvatarFallback className="text-[10px]">IMG</AvatarFallback>
                  </Avatar>
                ))}
                {fileCount > 3 && (
                  <Avatar className="size-8 ring-background ring-2 bg-muted/50 flex items-center justify-center">
                    <AvatarFallback className="text-xs font-medium text-muted-foreground bg-transparent">
                      +{fileCount - 3}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ) : (
              <div className="rounded-xl bg-primary/10 p-2.5 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground shrink-0">
                <Folder className="size-5" />
              </div>
            )}
            <div className="flex flex-col gap-0.5 min-w-0 overflow-hidden">
              <div className="group-hover:text-primary transition-colors truncate">
                <CardTitle className="truncate">
                  <Link
                    to="/organizations/$slug/projects/$projectId"
                    params={{ slug: orgSlug, projectId: id }}
                    className="block truncate"
                  >
                    {title}
                  </Link>
                </CardTitle>
              </div>
              <CardDescription className="truncate">
                {fileCount} {fileCount === 1 ? t.projects.card.files : t.projects.card.files_plural}
              </CardDescription>
            </div>
          </div>
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="size-8 rounded-full bg-muted/50 hover:bg-muted/80">
                  <MoreVertical className="size-4 text-foreground/70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <DropdownMenuItem asChild>
                  <Link
                    to="/organizations/$slug/projects/$projectId"
                    params={{ slug: orgSlug, projectId: id }}
                    className="cursor-pointer"
                  >
                    <ExternalLink className="mr-2 size-4 text-muted-foreground" />
                    Open Project
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    navigator.clipboard.writeText(id)
                    toast.success('Project ID copied to clipboard')
                  }}
                >
                  <Copy className="mr-2 size-4 text-muted-foreground" />
                  Copy ID
                </DropdownMenuItem>
                
                {canUpdate && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit?.()
                    }}
                  >
                    <Pencil className="mr-2 size-4 text-muted-foreground" />
                    Edit Project
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    const url = `${window.location.origin}/organizations/${orgSlug}/projects/${id}`
                    navigator.clipboard.writeText(url)
                    toast.success('Project link copied to clipboard')
                  }}
                >
                  <Share2 className="mr-2 size-4 text-muted-foreground" />
                  Share Link
                </DropdownMenuItem>

                {canDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                        >
                          <Trash2 className="mr-2 size-4" />
                          Delete Project
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t.projects.card.deleteTitle}</AlertDialogTitle>
                          <AlertDialogDescription>{t.projects.card.deleteDesc}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>{t.common.cancel}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={(e) => {
                              e.stopPropagation()
                              onDelete?.()
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {t.actions.delete}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>

        <CardContent className="flex-1">
          <div className="flex flex-col gap-2">
            <CardDescription className="truncate">
              {description || t.projects.form.noDescription}
            </CardDescription>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <User className="size-3.5" />
            <span className="truncate max-w-[120px]">{ownerName}</span>
          </div>
          <div className="text-xs font-medium text-muted-foreground">
            {formattedDate}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
