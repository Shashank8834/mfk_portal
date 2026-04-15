'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { useLocaleStore } from '@/stores/localeStore';
import { t } from '@/lib/i18n';

const stepIcons = [
  <svg key="explore" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5B4DB1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
    <path d="M8 11h6" />
    <path d="M11 8v6" />
  </svg>,
  <svg key="watch" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#06D6A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>,
  <svg key="fund" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>,
  <svg key="track" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FB8500" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>,
];

const colorClasses: Record<string, string> = {
  primary: 'bg-primary/10 border-primary/20 group-hover:border-primary/40 group-hover:shadow-[0_0_30px_rgba(91,77,177,0.1)]',
  mint: 'bg-mint/10 border-mint/20 group-hover:border-mint/40 group-hover:shadow-[0_0_30px_rgba(6,214,160,0.1)]',
  gold: 'bg-gold/10 border-gold/20 group-hover:border-gold/40 group-hover:shadow-[0_0_30px_rgba(255,183,3,0.1)]',
  orange: 'bg-orange/10 border-orange/20 group-hover:border-orange/40 group-hover:shadow-[0_0_30px_rgba(251,133,0,0.1)]',
};

const colors = ['primary', 'mint', 'gold', 'orange'];

export function MissionStrip() {
  const locale = useLocaleStore((s) => s.locale);

  const stepKeys = [
    { titleKey: 'mission.explore', descKey: 'mission.exploreDesc' },
    { titleKey: 'mission.watch', descKey: 'mission.watchDesc' },
    { titleKey: 'mission.fund', descKey: 'mission.fundDesc' },
    { titleKey: 'mission.track', descKey: 'mission.trackDesc' },
  ];

  return (
    <>
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-gold text-sm font-semibold uppercase tracking-wider font-mono">{t('mission.howItWorks', locale)}</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-text-primary mt-3">
              {t('mission.fourSteps', locale)}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stepKeys.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="group relative"
              >
                <GlassCard className={`p-8 h-full text-center ${colorClasses[colors[idx]]} transition-all duration-500`}>
                  <span className="absolute top-4 right-4 font-mono text-xs text-text-muted opacity-50">
                    0{idx + 1}
                  </span>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-16 h-16 rounded-2xl bg-bg-elevated flex items-center justify-center mx-auto mb-6 border border-border"
                  >
                    {stepIcons[idx]}
                  </motion.div>
                  <h3 className="font-display font-bold text-xl text-text-primary mb-3">
                    {t(step.titleKey, locale)}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {t(step.descKey, locale)}
                  </p>
                </GlassCard>
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B6590" strokeWidth="1.5" opacity="0.4">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.04] to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/[0.06] rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <h2 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl text-text-primary text-balance">
              {t('mission.ctaHeading', locale)}
            </h2>
            <p className="text-text-muted text-lg md:text-xl max-w-xl mx-auto text-balance">
              {t('mission.ctaBody', locale)}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/donate">
                <Button variant="gold" size="lg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {t('mission.donateNow', locale)}
                </Button>
              </Link>
              <Link href="/stories">
                <Button variant="secondary" size="lg">
                  {t('mission.browseStories', locale)}
                </Button>
              </Link>
            </div>
            <p className="text-text-muted text-xs pt-2">
              <svg className="inline-block w-3.5 h-3.5 mr-1 -mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              {t('mission.taxBenefit', locale)}
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
