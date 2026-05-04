'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { useLocaleStore } from '@/stores/localeStore';
import { t } from '@/lib/i18n';


const sectionAnim = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function AboutPage() {
  const locale = useLocaleStore((s) => s.locale);

  const dailyHabits = t('about.habits', locale).split('|');

  const studyRoutine = [
    { step: '1', title: t('about.study.1.title', locale), desc: t('about.study.1.desc', locale) },
    { step: '2', title: t('about.study.2.title', locale), desc: t('about.study.2.desc', locale) },
    { step: '3', title: t('about.study.3.title', locale), desc: t('about.study.3.desc', locale) },
    { step: '4', title: t('about.study.4.title', locale), desc: t('about.study.4.desc', locale) },
  ];

  const rewardTiers = [
    { condition: t('about.tier.full', locale), foundation: '₹250', parent: '₹250', total: '₹750' },
    { condition: t('about.tier.one', locale), foundation: '₹125', parent: '₹250', total: '₹500' },
    { condition: t('about.tier.two', locale), foundation: '₹62.50', parent: '₹250', total: '₹375' },
    { condition: t('about.tier.further', locale), foundation: t('about.tier.halved', locale), parent: '₹250', total: t('about.tier.varies', locale) },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Page Header */}
        <motion.div {...sectionAnim} className="text-center space-y-4">
          <span className="text-gold text-sm font-semibold uppercase tracking-wider font-mono">{t('about.badge', locale)}</span>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-text-primary">
            {t('about.title', locale)}
          </h1>
          <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto text-balance">
            {t('about.subtitle', locale)}
          </p>
        </motion.div>

        {/* ── What We Do ── */}
        <motion.section {...sectionAnim} id="what-we-do" className="scroll-mt-24 space-y-8">
          <div>
            <span className="text-mint text-sm font-semibold uppercase tracking-wider font-mono">01</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-text-primary mt-2">{t('about.whatWeDo', locale)}</h2>
          </div>

          <div className="space-y-6">
            <p className="text-text-muted text-lg leading-relaxed max-w-3xl">
              {t('about.whatP1', locale)}
            </p>
            <p className="text-text-muted text-lg leading-relaxed max-w-3xl">
              {t('about.whatP2', locale)}
            </p>

            {/* YouTube Video Embed */}
            <GlassCard className="overflow-hidden">
              <div className="aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/8-1ZzcgXD7g"
                  title="What We Do — Mentors for Kids"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            </GlassCard>

            {/* Monthly Reward Table */}
            <GlassCard className="p-6 space-y-4">
              <h3 className="font-display font-bold text-lg text-text-primary">{t('about.rewardTitle', locale)}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 pr-4 text-text-muted font-medium">{t('about.col.condition', locale)}</th>
                      <th className="text-right py-3 px-4 text-text-muted font-medium">{t('about.col.foundation', locale)}</th>
                      <th className="text-right py-3 px-4 text-text-muted font-medium">{t('about.col.parent', locale)}</th>
                      <th className="text-right py-3 pl-4 text-mint font-medium">{t('about.col.total', locale)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rewardTiers.map((tier) => (
                      <tr key={tier.condition} className="border-b border-border/50">
                        <td className="py-3 pr-4 text-text-primary">{tier.condition}</td>
                        <td className="text-right py-3 px-4 text-text-muted font-mono">{tier.foundation}</td>
                        <td className="text-right py-3 px-4 text-text-muted font-mono">{tier.parent}</td>
                        <td className="text-right py-3 pl-4 text-mint font-mono font-bold">{tier.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-text-muted text-xs">{t('about.rewardNote', locale)}</p>
            </GlassCard>
          </div>
        </motion.section>

        {/* ── How We Do It ── */}
        <motion.section {...sectionAnim} id="how-we-do-it" className="scroll-mt-24 space-y-8">
          <div>
            <span className="text-mint text-sm font-semibold uppercase tracking-wider font-mono">02</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-text-primary mt-2">{t('about.howWeDoIt', locale)}</h2>
          </div>

          {/* Daily Habits */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-xl text-text-primary">{t('about.habitTitle', locale)}</h3>
            <p className="text-text-muted text-base leading-relaxed">
              {t('about.habitDesc', locale)}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-flow-col sm:grid-rows-7 gap-3">
              {dailyHabits.map((habit) => (
                <div key={habit} className="flex items-start gap-3 px-4 py-3 rounded-xl bg-bg-elevated/50 border border-border/50">
                  <span className="text-mint mt-0.5 shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="text-text-muted text-sm">{habit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Study Routine */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-xl text-text-primary">{t('about.studyTitle', locale)}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {studyRoutine.map((item) => (
                <GlassCard key={item.step} className="p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-mono text-sm text-primary font-bold">{item.step}</span>
                    <h4 className="font-display font-bold text-text-primary">{item.title}</h4>
                  </div>
                  <p className="text-text-muted text-sm leading-relaxed">{item.desc}</p>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Spoken English */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-xl text-text-primary">{t('about.spokenTitle', locale)}</h3>
            <p className="text-text-muted text-sm font-medium">{t('about.spokenLangs', locale)}</p>
            <GlassCard className="p-6 space-y-3">
              <p className="text-text-muted text-base leading-relaxed">
                {t('about.spokenP1', locale)}
              </p>
              <p className="text-text-muted text-base leading-relaxed">
                {t('about.spokenP2', locale)}
              </p>
            </GlassCard>
          </div>
        </motion.section>

        {/* ── Mentors ── */}
        <motion.section {...sectionAnim} id="mentors" className="scroll-mt-24 space-y-8">
          <div>
            <span className="text-mint text-sm font-semibold uppercase tracking-wider font-mono">03</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-text-primary mt-2">{t('about.mentors', locale)}</h2>
            <p className="text-text-muted text-lg mt-3">{t('about.mentorsSubtitle', locale)}</p>
          </div>

          <GlassCard className="p-6 space-y-3">
            <p className="text-text-muted text-base leading-relaxed">
              {t('about.mentorDesc', locale)}
            </p>
          </GlassCard>

          {/* Leadership hierarchy */}
          <div className="space-y-6">
            {/* CEO */}
            <div className="flex justify-center">
              <GlassCard className="p-6 text-center space-y-3 max-w-sm w-full border-gold/30" glow>
                <div className="w-20 h-20 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center mx-auto">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <h3 className="font-display font-bold text-lg text-text-primary">Pavan Sharma</h3>
                <p className="text-gold text-sm font-semibold uppercase tracking-wider">{t('about.ceo', locale)}</p>
              </GlassCard>
            </div>

            {/* Connector line */}
            <div className="flex justify-center">
              <div className="w-0.5 h-8 bg-border" />
            </div>

            {/* Chief Mentor */}
            <div className="flex justify-center">
              <GlassCard className="p-6 text-center space-y-3 max-w-sm w-full border-primary/30" glow>
                <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5B4DB1" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <h3 className="font-display font-bold text-lg text-text-primary">Hartej Singh</h3>
                <p className="text-primary text-sm font-semibold uppercase tracking-wider">{t('about.chiefMentor', locale)}</p>
              </GlassCard>
            </div>

            {/* Connector line */}
            <div className="flex justify-center">
              <div className="w-0.5 h-8 bg-border" />
            </div>

            {/* Mentors grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {['Intern 1', 'Intern 2', 'Intern 3'].map((name) => (
                <GlassCard key={name} className="p-6 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5B4DB1" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <h3 className="font-display font-bold text-text-primary">{name}</h3>
                  <p className="text-text-muted text-sm">{t('about.intern', locale)}</p>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Hiring CTA */}
          <GlassCard className="p-8 text-center space-y-5 border-primary/20" glow>
            <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="1.5">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            </div>
            <h3 className="font-display font-bold text-2xl text-text-primary">{t('about.hiring', locale)}</h3>
            <p className="text-text-muted text-base max-w-lg mx-auto">
              {t('about.hiringDesc', locale)}
            </p>
            <p className="text-text-muted text-sm">
              <a
                href="/Mentors_for_Kids_JD.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium inline-flex items-center gap-1"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                {t('about.readJD', locale)}
              </a>
            </p>
            <Link href="/apply">
              <Button variant="gold" size="lg">
                {t('about.applyNow', locale)}
              </Button>
            </Link>
          </GlassCard>
        </motion.section>

        {/* ── Partners ── */}
        <motion.section {...sectionAnim} id="partners" className="scroll-mt-24 space-y-8">
          <div>
            <span className="text-mint text-sm font-semibold uppercase tracking-wider font-mono">04</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-text-primary mt-2">{t('about.partners', locale)}</h2>
          </div>

          <GlassCard className="p-6 flex items-center gap-6">
            <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="1.5">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-text-primary">Zerodha</h3>
              <p className="text-text-muted text-sm">{t('about.zerodhaDesc', locale)}</p>
            </div>
          </GlassCard>
        </motion.section>

        {/* ── Volunteers ── */}
        <motion.section {...sectionAnim} id="volunteers" className="scroll-mt-24 space-y-8">
          <div>
            <span className="text-mint text-sm font-semibold uppercase tracking-wider font-mono">05</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-text-primary mt-2">{t('about.volunteers', locale)}</h2>
          </div>

          <GlassCard className="p-6 flex items-center gap-6">
            <div className="w-14 h-14 rounded-xl bg-mint/10 border border-mint/20 flex items-center justify-center shrink-0">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#06D6A0" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-text-primary">{t('about.communityVol', locale)}</h3>
              <p className="text-text-muted text-sm">{t('about.volDesc', locale)}</p>
            </div>
          </GlassCard>
        </motion.section>

        {/* ── Technology ── */}
        <motion.section {...sectionAnim} id="technology" className="scroll-mt-24 space-y-8">
          <div>
            <span className="text-mint text-sm font-semibold uppercase tracking-wider font-mono">06</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-text-primary mt-2">{t('about.technology', locale)}</h2>
          </div>

          <GlassCard className="p-8 space-y-6">
            <p className="text-text-muted text-lg leading-relaxed">
              {t('about.techDesc', locale)}
            </p>

            {/* Tech Stack Diagram */}
            <div className="rounded-2xl border border-border bg-bg-elevated/50 p-6 space-y-6">
              <h4 className="font-display font-bold text-base text-text-primary text-center">{t('about.techStack', locale)}</h4>

              {/* Frontend Layer */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">{t('about.frontend', locale)}</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { name: 'Next.js 16', desc: 'App Router' },
                    { name: 'React 19', desc: 'UI Library' },
                    { name: 'TypeScript', desc: 'Type Safety' },
                    { name: 'Tailwind CSS', desc: 'Styling' },
                  ].map((tech) => (
                    <div key={tech.name} className="text-center px-3 py-3 rounded-xl bg-bg-card border border-border">
                      <span className="text-sm font-mono text-primary font-medium block">{tech.name}</span>
                      <span className="text-xs text-text-muted">{tech.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted/30">
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </div>

              {/* Backend Layer */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-accent uppercase tracking-wider">{t('about.backend', locale)}</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { name: 'Firebase', desc: 'Auth & DB' },
                    { name: 'UPI', desc: 'Payments' },
                    { name: 'Cloudinary', desc: 'Media CDN' },
                    { name: 'Google Maps', desc: 'Geolocation' },
                  ].map((tech) => (
                    <div key={tech.name} className="text-center px-3 py-3 rounded-xl bg-bg-card border border-border">
                      <span className="text-sm font-mono text-accent font-medium block">{tech.name}</span>
                      <span className="text-xs text-text-muted">{tech.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted/30">
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </div>

              {/* Infrastructure */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-mint uppercase tracking-wider">{t('about.infrastructure', locale)}</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { name: 'Vercel', desc: 'Hosting & CDN' },
                    { name: 'DigitalOcean', desc: 'Video Storage' },
                    { name: 'GitHub', desc: 'Version Control' },
                    { name: 'Analytics', desc: 'Usage Insights' },
                  ].map((tech) => (
                    <div key={tech.name} className="text-center px-3 py-3 rounded-xl bg-bg-card border border-border">
                      <span className="text-sm font-mono text-mint font-medium block">{tech.name}</span>
                      <span className="text-xs text-text-muted">{tech.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Tech Lead Profile */}
          <Link href="/mentors/tech-lead">
            <GlassCard className="p-6 flex items-center gap-5 group cursor-pointer hover:border-primary/40 transition-colors">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5B4DB1" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-lg text-text-primary group-hover:text-primary transition-colors">{t('about.techLead', locale)}</h3>
                <p className="text-text-muted text-sm mt-1">{t('about.techLeadDesc', locale)}</p>
                <p className="text-primary text-xs font-medium mt-2">{t('about.viewProfile', locale)}</p>
              </div>
              <svg className="text-text-muted group-hover:text-primary transition-colors shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </GlassCard>
          </Link>

          {/* Security & Privacy */}
          <GlassCard className="p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-mint/10 border border-mint/20 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-xl text-text-primary">{t('about.security', locale)}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: t('about.sec.encrypt.title', locale), desc: t('about.sec.encrypt.desc', locale) },
                { title: t('about.sec.otp.title', locale), desc: t('about.sec.otp.desc', locale) },
                { title: t('about.sec.minimal.title', locale), desc: t('about.sec.minimal.desc', locale) },
                { title: t('about.sec.upi.title', locale), desc: t('about.sec.upi.desc', locale) },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 px-4 py-3 rounded-xl bg-bg-elevated/50 border border-border/50">
                  <span className="text-mint mt-0.5 shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <div>
                    <span className="text-text-primary text-sm font-semibold block">{item.title}</span>
                    <span className="text-text-muted text-xs">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.section>
      </div>
    </div>
  );
}
