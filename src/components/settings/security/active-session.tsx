import { useAuth } from '@better-auth-ui/react'
import { useNavigate } from '@tanstack/react-router'
import type { Session } from 'better-auth'
import Bowser from 'bowser'
import { LogOut, Monitor, Smartphone, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { revokeSession, useSession } from '../../../../lib/auth-client'

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
  const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
  ]
  for (const [unit, threshold] of UNITS) {
    if (seconds >= threshold) return rtf.format(-Math.floor(seconds / threshold), unit)
  }
  return rtf.format(0, 'second')
}

interface ActiveSessionProps {
  activeSession: Session
}

export function ActiveSession({ activeSession }: ActiveSessionProps) {
  const { localization } = useAuth()
  const { data: session } = useSession({ refetchOnMount: false })
  const navigate = useNavigate()

  const [isRevoking, setIsRevoking] = useState(false)

  const handleRevokeSession = async (sessionToRevoke: Session) => {
    setIsRevoking(true)
    const { error } = await revokeSession({ token: sessionToRevoke.token })
    setIsRevoking(false)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success(localization.settings.revokeSessionSuccess)
    }
  }

  const isCurrentSession = activeSession.token === session?.session.token
  const ua = Bowser.parse(activeSession.userAgent || '')
  const isMobile = ua.platform.type === 'mobile' || ua.platform.type === 'tablet'

  return (
    <Card className="bg-transparent border-0 ring-0 shadow-none">
      <CardContent className="flex items-center justify-between gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
          {isMobile ? <Smartphone className="size-4" /> : <Monitor className="size-4" />}
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-sm font-medium truncate">
            {ua.browser.name || 'Unknown Browser'}
            {ua.os.name ? `, ${ua.os.name}` : ''}
          </span>

          {isCurrentSession ? (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary w-fit">
              {localization.settings.currentSession}
            </span>
          ) : (
            activeSession.createdAt && (
              <span className="text-xs text-muted-foreground capitalize">
                {timeAgo(new Date(activeSession.createdAt))}
              </span>
            )
          )}
        </div>

        <Button
          className="ml-auto shrink-0"
          variant="outline"
          size="sm"
          onClick={() =>
            isCurrentSession ? navigate({ to: '/logout' }) : handleRevokeSession(activeSession)
          }
          disabled={isRevoking}
        >
          {isRevoking ? <Spinner /> : isCurrentSession ? <LogOut /> : <X />}
          {isCurrentSession ? localization.auth.signOut : localization.settings.revoke}
        </Button>
      </CardContent>
    </Card>
  )
}
