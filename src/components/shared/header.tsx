import { Link } from '@tanstack/react-router'
import { LanguageToggle, ThemeToggle } from '@/components/shared/auth-ui'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/context'

export function Header() {
  const { t } = useI18n()
  const l = t.landing

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border/40 bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-12">
      <div className="flex items-center gap-2">
        <Link to="/">
          <img src="/logo.png" alt="RefactKit" className="h-8 w-auto object-contain sm:h-10" />
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/login" className="hidden sm:block">
          <Button variant="ghost" className="rounded-full">
            {l.header.signIn}
          </Button>
        </Link>
        <Link to="/login" className="hidden sm:block">
          <Button className="rounded-full shadow-sm shadow-primary/20">
            {l.header.getStarted}
          </Button>
        </Link>
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  )
}
