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
      <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
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
        className={`h-8 w-[90px] rounded-full bg-gray-100 dark:bg-gray-900 ${className ?? ''}`}
      />
    )
  return (
    <div
      className={`flex items-center gap-0.5 rounded-full border border-gray-200 bg-gray-100 p-0.5 dark:border-gray-800 dark:bg-gray-900 ${className ?? ''}`}
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
          className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${theme === v ? 'bg-white shadow-sm dark:bg-gray-800' : 'text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300'}`}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  )
}
