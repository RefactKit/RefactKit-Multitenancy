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
import { authClient, useSession } from '../../../../lib/auth-client'

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
  const { data: session } = useSession()
  const navigate = useNavigate()

  const [isRevoking, setIsRevoking] = useState(false)

  const handleRevokeSession = async (sessionToRevoke: Session) => {
    setIsRevoking(true)
    const { error } = await authClient.revokeSession({
      id: sessionToRevoke.id,
    })
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
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
          {isMobile ? <Smartphone className="size-4" /> : <Monitor className="size-4" />}
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span>{ua.browser.name || 'Unknown Browser'}</span>
            <span className="text-muted-foreground/30">•</span>
            <span>{ua.os.name || 'Unknown OS'}</span>
            {ua.platform.model && (
              <>
                <span className="text-muted-foreground/30">•</span>
                <span className="text-muted-foreground">{ua.platform.model}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 mt-1">
            {isCurrentSession && (
              <span className="rounded-full bg-teal-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-600">
                {localization.settings.currentSession}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {activeSession.ipAddress || 'Unknown IP'}
            </span>
          </div>
        </div>

        <Button
          className="shrink-0"
          variant="ghost"
          size="icon"
          onClick={() =>
            isCurrentSession ? navigate({ to: '/logout' }) : handleRevokeSession(activeSession)
          }
          disabled={isRevoking}
        >
          {isRevoking ? (
            <Spinner />
          ) : isCurrentSession ? (
            <LogOut className="size-4" />
          ) : (
            <X className="size-4" />
          )}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-muted/50 pt-3 md:grid-cols-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            IP Address
          </span>
          <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded w-fit">
            {activeSession.ipAddress}
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            Last seen
          </span>
          <span className="text-xs text-foreground">
            {activeSession.updatedAt ? timeAgo(new Date(activeSession.updatedAt)) : '—'}
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            Created
          </span>
          <span className="text-xs text-foreground">
            {activeSession.createdAt ? timeAgo(new Date(activeSession.createdAt)) : '—'}
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            Status
          </span>
          <div className="flex items-center gap-1.5">
            <div className="size-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-foreground">Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}
