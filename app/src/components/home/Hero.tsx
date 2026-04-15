'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Button } from '@/components/ui/Button';
import { useLocaleStore } from '@/stores/localeStore';
import { t } from '@/lib/i18n';

export function Hero() {
  const locale = useLocaleStore((s) => s.locale);

  const stats: { value: number; suffix: string; label: string; prefix?: string }[] = [
    { value: 28, suffix: '', label: t('hero.schools', locale) },
    { value: 8400, suffix: '+', label: t('hero.students', locale) },
    { value: 4500, suffix: '+', label: t('hero.storiesShared', locale) },
  ];

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="hero-mesh" />

      {/* Additional floating orbs */}
      <div className="absolute top-1/4 left-[10%] w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-[15%] w-96 h-96 bg-mint/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/3 right-[30%] w-48 h-48 bg-gold/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '5s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-primary font-medium mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
                {t('hero.badge', locale)}
              </motion.span>

              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.08] tracking-tight text-balance">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="block text-text-primary"
                >
                  {t('hero.heading1', locale)}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="block gradient-text"
                >
                  {t('hero.heading2', locale)}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="block text-text-primary"
                >
                  {t('hero.heading3', locale)}
                </motion.span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="text-text-muted text-lg md:text-xl leading-relaxed max-w-lg text-balance"
            >
              {t('hero.body', locale)}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/stories">
                <Button variant="primary" size="lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  {t('hero.cta.stories', locale)}
                </Button>
              </Link>
              <Link href="/map">
                <Button variant="secondary" size="lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                    <line x1="8" y1="2" x2="8" y2="18" />
                    <line x1="16" y1="6" x2="16" y2="22" />
                  </svg>
                  {t('hero.exploreMap', locale)}
                </Button>
              </Link>
            </motion.div>

            {/* Floating stat pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              className="flex flex-wrap gap-3 pt-4"
            >
              {stats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 + idx * 0.15 }}
                  className="glass rounded-full px-5 py-2.5 flex items-center gap-2 animate-float"
                  style={{ animationDelay: `${idx * 2}s` }}
                >
                  <span className="font-display font-bold text-lg text-mint">
                    <AnimatedCounter
                      end={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      decimals={stat.value < 10 ? 1 : 0}
                    />
                  </span>
                  <span className="text-text-muted text-sm">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right — Video / Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-3xl overflow-hidden glass primary-glow">
              {/* Video placeholder with animated background */}
              <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-bg-card via-bg-elevated to-bg-card">
                {/* Animated mesh background */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(91,77,177,0.15),transparent_60%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(245,166,35,0.1),transparent_60%)]" />
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  {/* Animated school icons grid */}
                  <div className="grid grid-cols-3 gap-5 opacity-30">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -6, 0], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 3 + (i % 3), delay: i * 0.3, repeat: Infinity }}
                        className="w-16 h-16 rounded-2xl bg-primary/10 backdrop-blur-sm flex items-center justify-center border border-primary/10"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5B4DB1" strokeWidth="1.5">
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                          <path d="M6 12v5c3 3 9 3 12 0v-5" />
                        </svg>
                      </motion.div>
                    ))}
                  </div>

                  {/* Central play button */}
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/30 shadow-[0_0_60px_rgba(91,77,177,0.2)]">
                      <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(91,77,177,0.4)]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF">
                          <polygon points="8,5 19,12 8,19" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-card via-bg-card/50 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between">
                  <p className="text-text-muted text-sm">{t('hero.storyReel', locale)}</p>
                  <span className="text-xs text-primary/60 font-mono">28 {t('hero.schools', locale).toLowerCase()}</span>
                </div>
              </div>
            </div>

            {/* Floating decoration cards */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-6 -left-6 glass rounded-xl px-4 py-3 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-lg">🎬</div>
              <div>
                <p className="text-sm font-semibold text-text-primary">{t('hero.videos', locale)}</p>
                <p className="text-xs text-text-muted">{t('hero.videosDesc', locale)}</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              className="absolute -top-4 -right-4 glass rounded-xl px-4 py-3 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-mint/20 flex items-center justify-center text-lg">✨</div>
              <div>
                <p className="text-sm font-semibold text-text-primary">{t('hero.newStory', locale)}</p>
                <p className="text-xs text-text-muted">{t('hero.newStoryDesc', locale)}</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
