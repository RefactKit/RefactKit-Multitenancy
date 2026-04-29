import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import Cookies from 'js-cookie'
import { ar } from './locales/ar'
import { en, type Translations } from './locales/en'
import { es } from './locales/es'
import { fr } from './locales/fr'
import { pt } from './locales/pt'

// Re-export so context.tsx can import Translations from '.'
export type { Translations } from './locales/en'

export type Locale = 'en' | 'fr' | 'ar' | 'es' | 'pt'

export const LOCALE_COOKIE = 'lk_locale'

const locales: Record<Locale, Translations> = { en, fr, ar, es, pt }

export function getTranslations(locale: Locale): Translations {
  return locales[locale] ?? en
}

/** Read locale from the cookie on the client (browser) */
export function detectLocale(): Locale {
  if (typeof document !== 'undefined') {
    const val = Cookies.get(LOCALE_COOKIE)
    if (val === 'ar') return 'ar'
    if (val === 'es') return 'es'
    if (val === 'pt') return 'pt'
    if (val === 'en') return 'en'
    return 'fr'
  }
  return 'fr'
}

/** Read locale from the request cookie on the server */
export const getServerLocale = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()
  const cookieHeader = request.headers.get('Cookie') ?? ''
  const match = cookieHeader.match(new RegExp(`(^|; ) ?${LOCALE_COOKIE}=([^;]+)`))
  const val = match ? match[2] : null
  if (val === 'ar') return 'ar'
  if (val === 'es') return 'es'
  if (val === 'pt') return 'pt'
  if (val === 'en') return 'en'
  return 'fr'
})

export function setLocaleCookie(locale: Locale) {
  Cookies.set(LOCALE_COOKIE, locale, { expires: 365, sameSite: 'lax' })
}

export { ar, en, es, fr, pt }
