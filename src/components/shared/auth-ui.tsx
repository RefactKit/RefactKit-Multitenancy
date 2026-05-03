import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Languages, Monitor, Moon, Sun } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useI18n } from '@/i18n/context'
import type { Locale } from '@/i18n'

const languageMap: Record<Locale, { label: string; flag: string }> = {
  en: { label: 'English', flag: '🇺🇸' },
  fr: { label: 'Français', flag: '🇫🇷' },
  es: { label: 'Español', flag: '🇪🇸' },
  ar: { label: 'العربية', flag: '🇦🇪' },
  pt: { label: 'Português', flag: '🇧🇷' },
}

export function LanguageToggle() {
  const { locale, setLocale } = useI18n()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:text-foreground transition-all hover:bg-muted dark:bg-muted/10 dark:hover:bg-muted/20">
        <Languages className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuRadioGroup value={locale} onValueChange={(v) => setLocale(v as Locale)}>
          {(Object.entries(languageMap) as [Locale, (typeof languageMap)['en']][]).map(
            ([code, { label, flag }]) => (
              <DropdownMenuRadioItem key={code} value={code} className="gap-2">
                <span className="text-base">{flag}</span>
                <span>{label}</span>
              </DropdownMenuRadioItem>
            ),
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted)
    return (
      <div
        className={`h-8 w-[90px] rounded-full bg-muted/50 dark:bg-muted/10 ${className ?? ''}`}
      />
    )

  return (
    <div
      className={`flex items-center gap-0.5 rounded-full border border-border/40 bg-muted/50 p-0.5 dark:bg-muted/10 ${className ?? ''}`}
    >
      {(
        [
          ['light', Sun],
          ['system', Monitor],
          ['dark', Moon],
        ] as const
      ).map(([v, Icon]) => (
        <button
          type="button"
          key={v}
          onClick={() => setTheme(v)}
          className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${
            theme === v
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  )
}
