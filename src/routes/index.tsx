import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Cpu,
  Globe,
  Lightning,
  RocketLaunch,
  ShieldCheck,
  Stack,
} from '@phosphor-icons/react'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { getServerSession } from '@/server/auth-fns'
import { userOrgsQuery } from '@/server/query-keys'

import { DotPattern } from '@/components/ui/dot-pattern'
import { Marquee } from '@/components/ui/marquee'
import { Header } from '@/components/shared/header'
import { useI18n } from '@/i18n/context'

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    const { session } = await getServerSession()
    if (session) {
      const { orgs } = await context.queryClient.ensureQueryData(userOrgsQuery())
      if (orgs.length === 0) throw redirect({ to: '/onboarding' })

      throw redirect({
        to: '/organizations/$slug/dashboard',
        params: { slug: orgs[0]?.slug },
        search: { page: 1 },
      })
    }
    return {}
  },
  component: LandingPage,
})

const techLogos = [
  { name: 'TanStack Start', src: '/tanstack.png' },
  { name: 'Better Auth', src: '/better.png' },
  { name: 'Drizzle ORM', src: '/drizzle.png' },
  { name: 'Tailwind CSS v4', src: '/tailwind.png' },
  { name: 'Base UI', src: '/shadcn.png' },
  { name: 'i18next', src: '/i18.png' },
  { name: 'Stripe', src: '/stripe.png' },
  { name: 'Resend', src: '/resend.png' },
]

const features = [
  {
    title: 'Multi-Tenant Architecture',
    description:
      'Isolated data and custom settings for every organization, built on a robust RBAC system.',
    icon: ShieldCheck,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    title: 'TanStack Start Power',
    description:
      'Leverage the latest full-stack framework with seamless server-client coordination.',
    icon: Lightning,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    title: 'Type-Safe Everything',
    description: 'End-to-end type safety from database to UI with Drizzle ORM and TypeScript.',
    icon: Cpu,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    title: 'Global Ready',
    description: 'Built-in i18n support with RTL support (Arabic) and automatic font switching.',
    icon: Globe,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
]

const TechCard = ({ name, src }: { name: string; src: string }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-[2.5rem] border bg-background p-8 shadow-sm transition-all hover:shadow-md hover:border-primary/20 group w-64 shrink-0">
      <div className="size-20 flex items-center justify-center rounded-2xl bg-muted/30 group-hover:bg-primary/5 transition-colors">
        <img
          src={src}
          alt={name}
          className="h-12 w-auto object-contain transition-transform group-hover:scale-110"
        />
      </div>
      <span className="text-sm font-bold text-foreground tracking-tight">{name}</span>
    </div>
  )
}

function LandingPage() {
  const { t } = useI18n()
  const l = t.landing
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground overflow-x-hidden">
      <Header />

      <main className="flex flex-1 flex-col items-center">
        {/* Hero Section */}
        <section className="relative flex w-full flex-col items-center justify-center px-6 pt-32 pb-16 text-center sm:px-12 lg:px-24">
          <DotPattern
            cr={1.5}
            className="[mask-image:radial-gradient(800px_circle_at_center,white,transparent)] opacity-40 text-primary/30"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <Badge
              variant="outline"
              className="mb-8 gap-2 rounded-full border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm"
            >
              <span className="flex size-2 animate-pulse rounded-full bg-primary" />
              {l.hero.badge}
            </Badge>

            <h1 className="text-balance mb-8 max-w-5xl mx-auto text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl">
              {l.hero.title}
            </h1>

            <p className="text-balance mb-12 max-w-3xl mx-auto text-lg leading-relaxed text-muted-foreground sm:text-xl md:text-2xl">
              {l.hero.subheading}
            </p>

            <div className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
              <Link to="/login" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="h-14 w-full gap-2 rounded-full px-8 text-base shadow-lg shadow-primary/25 transition-all hover:scale-105 sm:w-auto"
                >
                  {l.hero.getStarted} <ArrowRight weight="bold" className="size-5" />
                </Button>
              </Link>

              <a
                href="https://docs.refactkit.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 w-full gap-2 rounded-full border-2 px-8 text-base transition-all hover:bg-muted/50 sm:w-auto"
                >
                  <BookOpen weight="duotone" className="size-5" />
                  {l.hero.viewDocs}
                </Button>
              </a>
            </div>
          </motion.div>
        </section>

        {/* Dashboard Showcase Section (Peeking from bottom of hero) */}
        <section className="w-full pb-24 px-6 lg:px-24">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="relative mx-auto max-w-5xl rounded-3xl shadow-[0_0_100px_-20px_rgba(var(--primary-rgb),0.2)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />
              <img src="/dashboard.png" alt="RefactKit Dashboard" className="w-full h-auto" />
            </motion.div>
          </div>
        </section>

        {/* Tech Stack Section (Card Grid) */}
        <section className="w-full py-24 bg-muted/20 border-y border-border/40">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">
                The tech stack
              </span>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">{l.techStack.title}</h2>
              <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
                {l.techStack.subtitle}
              </p>
            </div>

            <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
              <Marquee pauseOnHover className="[--duration:30s] py-4">
                {techLogos.slice(0, 4).map((logo) => (
                  <TechCard key={logo.name} {...logo} />
                ))}
              </Marquee>
              <Marquee reverse pauseOnHover className="[--duration:30s] py-4">
                {techLogos.slice(4).map((logo) => (
                  <TechCard key={logo.name} {...logo} />
                ))}
              </Marquee>
              <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r via-background/50 to-transparent"></div>
              <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l via-background/50 to-transparent"></div>
            </div>
          </div>
        </section>

        {/* Features Grid Section */}
        <section className="w-full py-32 bg-background relative">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-24">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {l.detailedFeatures.title}
              </h2>
              <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                {l.detailedFeatures.subtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col gap-4 rounded-[2.5rem] border bg-card p-10 shadow-sm transition-all hover:shadow-lg hover:border-primary/20"
                >
                  <div
                    className={`flex size-16 items-center justify-center rounded-2xl ${feature.bg} ${feature.color}`}
                  >
                    <feature.icon weight="duotone" className="size-9" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight">{feature.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-32 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="relative rounded-[3.5rem] bg-primary px-8 py-24 text-center text-primary-foreground shadow-2xl shadow-primary/40 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-4xl font-bold tracking-tight sm:text-6xl mb-8 leading-tight">
                  {l.cta.title}
                </h2>
                <p className="text-xl text-primary-foreground/80 mb-12 leading-relaxed">
                  {l.cta.subtitle}
                </p>
                <Link to="/login">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="h-16 px-12 rounded-full text-lg font-bold shadow-xl transition-all hover:scale-105 active:scale-95"
                  >
                    {l.cta.button} <RocketLaunch weight="bold" className="ml-2 size-6" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/40 py-16 text-center text-sm text-muted-foreground bg-background">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10 max-w-6xl">
          <div className="flex flex-col items-center md:items-start gap-4">
            <img src="/logo.png" alt="RefactKit" className="h-8 w-auto opacity-80" />
            <p className="max-w-xs text-muted-foreground/60 text-center md:text-left">
              The high-performance SaaS boilerplate for modern developers.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-6">
            <p>{l.footer.madeWith} Y.BERDAI</p>
            <div className="flex items-center gap-8 font-medium">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms
              </a>
              <a href="https://twitter.com" className="hover:text-primary transition-colors">
                Twitter
              </a>
              <a href="https://github.com" className="hover:text-primary transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
