'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLocaleStore } from '@/stores/localeStore';
import { t } from '@/lib/i18n';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

function RoleTable({ rows }: { rows: [string, string][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([label, value], i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-bg-elevated/40' : 'bg-bg-card'}>
              <td className="px-4 py-3 font-semibold text-primary whitespace-nowrap w-40">{label}</td>
              <td className="px-4 py-3 text-text-primary">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 ml-1">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-text-muted text-sm leading-relaxed">
          <span className="text-accent mt-1.5 shrink-0">&#8226;</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function CareersPage() {
  const locale = useLocaleStore((s) => s.locale);

  const mainRoleRows: [string, string][] = [
    [t('jd.position', locale), t('jd.positionVal', locale)],
    [t('jd.type', locale), t('jd.typeVal', locale)],
    [t('jd.stipend', locale), t('jd.stipendVal', locale)],
    [t('jd.schedule', locale), t('jd.scheduleVal', locale)],
    [t('jd.languages', locale), t('jd.languagesVal', locale)],
    [t('jd.location', locale), t('jd.locationVal', locale)],
    [t('jd.positions', locale), t('jd.positionsVal', locale)],
    [t('jd.startDate', locale), t('jd.startDateVal', locale)],
  ];

  const optRoleRows: [string, string][] = [
    [t('jd.position', locale), t('jd.opt.positionVal', locale)],
    [t('jd.type', locale), t('jd.opt.typeVal', locale)],
    [t('jd.stipend', locale), t('jd.opt.stipendVal', locale)],
    [t('jd.schedule', locale), t('jd.opt.scheduleVal', locale)],
    [t('jd.languages', locale), t('jd.opt.languageVal', locale)],
    [t('jd.location', locale), t('jd.opt.locationVal', locale)],
  ];

  return (
    <div className="pt-20 min-h-screen pb-20 md:pb-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div {...fadeUp} className="text-center mb-10 space-y-2">
          <h1 className="font-display font-extrabold text-4xl md:text-5xl gradient-text">
            {t('jd.title', locale)}
          </h1>
          <p className="font-display font-bold text-xl text-primary">
            {t('jd.subtitle', locale)}
          </p>
          <p className="text-accent italic text-sm">{t('jd.tagline', locale)}</p>
          <div className="flex justify-center gap-3 pt-4">
            <Link
              href="/apply"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gold text-white text-sm font-bold hover:bg-orange hover:shadow-[0_0_20px_rgba(245,166,35,0.3)] transition-all duration-300"
            >
              {t('jd.applyNow', locale)}
            </Link>
            <a
              href="/Mentors_for_Kids_JD.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl border border-primary/20 text-primary text-sm font-semibold hover:bg-primary/5 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {t('jd.downloadPdf', locale)}
            </a>
          </div>
        </motion.div>

        {/* About */}
        <motion.section {...fadeUp} transition={{ delay: 0.1 }} className="space-y-4 mb-10">
          <h2 className="font-display font-bold text-2xl text-text-primary border-b-2 border-accent/30 pb-2">
            {t('jd.aboutTitle', locale)}
          </h2>
          <p className="text-text-muted text-sm leading-relaxed">{t('jd.aboutP1', locale)}</p>
          <p className="text-text-muted text-sm leading-relaxed">{t('jd.aboutP2', locale)}</p>
          <p className="text-text-muted text-sm leading-relaxed">{t('jd.aboutP3', locale)}</p>
        </motion.section>

        {/* Role Overview */}
        <motion.section {...fadeUp} transition={{ delay: 0.15 }} className="space-y-4 mb-10">
          <h2 className="font-display font-bold text-2xl text-text-primary border-b-2 border-accent/30 pb-2">
            {t('jd.roleOverview', locale)}
          </h2>
          <RoleTable rows={mainRoleRows} />
        </motion.section>

        {/* Key Responsibilities */}
        <motion.section {...fadeUp} transition={{ delay: 0.2 }} className="space-y-6 mb-10">
          <h2 className="font-display font-bold text-2xl text-text-primary border-b-2 border-accent/30 pb-2">
            {t('jd.keyResponsibilities', locale)}
          </h2>
          {(['resp1', 'resp2', 'resp3'] as const).map((key) => (
            <div key={key} className="space-y-3">
              <h3 className="font-display font-semibold text-lg text-text-primary">
                {t(`jd.${key}.title`, locale)}
              </h3>
              <BulletList items={t(`jd.${key}.items`, locale).split('|')} />
            </div>
          ))}
        </motion.section>

        {/* Substitution Policy */}
        <motion.section {...fadeUp} transition={{ delay: 0.25 }} className="space-y-3 mb-10">
          <h2 className="font-display font-bold text-2xl text-text-primary border-b-2 border-accent/30 pb-2">
            {t('jd.substitutionTitle', locale)}
          </h2>
          <p className="text-text-muted text-sm leading-relaxed">{t('jd.substitutionText', locale)}</p>
        </motion.section>

        {/* Optional Gig */}
        <motion.section {...fadeUp} transition={{ delay: 0.3 }} className="space-y-4 mb-10 glass rounded-2xl p-6">
          <h2 className="font-display font-bold text-2xl text-accent">
            {t('jd.optionalTitle', locale)}
          </h2>
          <RoleTable rows={optRoleRows} />
          <h3 className="font-display font-semibold text-lg text-text-primary pt-2">
            {t('jd.opt.keyResp', locale)}
          </h3>
          <p className="text-text-muted text-sm leading-relaxed">{t('jd.opt.respP1', locale)}</p>
          <p className="text-text-muted text-sm leading-relaxed">{t('jd.opt.respP2', locale)}</p>
          <p className="text-text-muted text-sm leading-relaxed">{t('jd.opt.respP3', locale)}</p>
        </motion.section>

        {/* Who We're Looking For */}
        <motion.section {...fadeUp} transition={{ delay: 0.35 }} className="space-y-4 mb-10">
          <h2 className="font-display font-bold text-2xl text-text-primary border-b-2 border-accent/30 pb-2">
            {t('jd.whoTitle', locale)}
          </h2>
          <BulletList items={t('jd.whoItems', locale).split('|')} />
        </motion.section>

        {/* Why Join */}
        <motion.section {...fadeUp} transition={{ delay: 0.4 }} className="space-y-4 mb-10">
          <h2 className="font-display font-bold text-2xl text-text-primary border-b-2 border-accent/30 pb-2">
            {t('jd.whyTitle', locale)}
          </h2>
          <BulletList items={t('jd.whyItems', locale).split('|')} />
        </motion.section>

        {/* How to Apply */}
        <motion.section {...fadeUp} transition={{ delay: 0.45 }} className="text-center space-y-4 glass rounded-2xl p-8">
          <h2 className="font-display font-bold text-2xl text-text-primary">
            {t('jd.howTitle', locale)}
          </h2>
          <p className="text-text-muted text-sm">{t('jd.howText', locale)}</p>
          <a href="mailto:ask@mentorforkids.in" className="text-primary font-semibold text-lg hover:underline block">
            ask@mentorforkids.in
          </a>
          <div className="text-text-muted text-sm space-y-1">
            <p className="font-semibold text-text-primary">S Shashank Reddy</p>
            <p>+91 97421 33344</p>
            <a href="mailto:shashank@bcl.in" className="text-primary hover:underline">shashank@bcl.in</a>
          </div>
          <Link
            href="/apply"
            className="inline-flex items-center gap-1.5 px-8 py-3 rounded-xl bg-gold text-white font-bold text-lg hover:bg-orange hover:shadow-[0_0_20px_rgba(245,166,35,0.3)] transition-all duration-300 mt-4"
          >
            {t('jd.applyNow', locale)}
          </Link>
        </motion.section>
      </div>
    </div>
  );
}
