import { CheckIcon, GlobeIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Locale } from '@/i18n'
import { useI18n } from '@/i18n/context'
import { cn } from '@/lib/utils'

const languages: { code: Locale; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ar', name: 'العربية', flag: '🇦🇪' },
  { code: 'zh', name: '简体中文', flag: '🇨🇳' },
]

export function LangSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n()

  const _currentLang = languages.find((l) => l.code === locale)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className={cn('rounded-full transition-colors hover:bg-muted', className)}
          />
        }
      >
        <GlobeIcon className="size-[18px] opacity-70" />
        <span className="sr-only">Switch language</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40 rounded-xl p-1 shadow-lg ring-1 ring-black/5"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLocale(lang.code)}
            className={cn(
              'flex items-center justify-between px-3 py-2 text-sm transition-colors cursor-pointer rounded-lg',
              locale === lang.code
                ? 'bg-muted font-medium text-foreground'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-base">{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
            {locale === lang.code && <CheckIcon className="size-3.5 opacity-60" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
