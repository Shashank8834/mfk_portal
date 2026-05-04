'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';

const sectionAnim = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const lastUpdated = '4 May 2026';

const schedule = [
  { category: 'Daily journal entries', period: '1 year after the child exits the program', action: 'Anonymised, then deleted' },
  { category: 'Attendance records', period: '1 year after the child exits the program', action: 'Anonymised, then deleted' },
  { category: 'Photographs and videos', period: '1 year after the child exits the program', action: 'Real names removed; aggregate footage may be retained for archive purposes only' },
  { category: 'Mutual fund contribution records', period: 'Retained per Indian tax and audit law (typically 8 years)', action: 'Retained in financial records' },
  { category: 'Donor records and receipts', period: 'Retained per Indian tax and audit law (typically 8 years)', action: 'Retained in financial records' },
  { category: 'Mentor and volunteer accounts', period: '6 months after the account becomes inactive', action: 'Deleted' },
  { category: 'Server access logs', period: 'Up to 90 days', action: 'Deleted' },
  { category: 'Anonymous usage analytics', period: 'Up to 14 months', action: 'Deleted' },
];

export default function DataRetentionPage() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <motion.div {...sectionAnim} className="space-y-3">
          <span className="text-gold text-sm font-semibold uppercase tracking-wider font-mono">Legal</span>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-text-primary">Data Retention Policy</h1>
          <p className="text-text-muted text-sm">Last updated: {lastUpdated}</p>
        </motion.div>

        <motion.section {...sectionAnim}>
          <GlassCard className="p-6 md:p-8 space-y-3 text-text-muted leading-relaxed">
            <p>We keep personal data only as long as we need it to run the mentorship program, meet legal and audit obligations, and protect the children we work with. This page sets out the periods we use. It supplements our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.</p>
          </GlassCard>
        </motion.section>

        <motion.section {...sectionAnim} className="space-y-4">
          <h2 className="font-display font-bold text-2xl text-text-primary">Retention schedule</h2>
          <GlassCard className="p-4 md:p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 pr-4 text-text-muted font-medium">Data category</th>
                    <th className="text-left py-3 px-4 text-text-muted font-medium">Retention period</th>
                    <th className="text-left py-3 pl-4 text-text-muted font-medium">What happens after</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((row) => (
                    <tr key={row.category} className="border-b border-border/50 align-top">
                      <td className="py-3 pr-4 text-text-primary font-medium">{row.category}</td>
                      <td className="py-3 px-4 text-text-muted">{row.period}</td>
                      <td className="py-3 pl-4 text-text-muted">{row.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.section>

        <motion.section {...sectionAnim} className="space-y-4">
          <h2 className="font-display font-bold text-2xl text-text-primary">What &ldquo;exits the program&rdquo; means</h2>
          <GlassCard className="p-6 space-y-3 text-text-muted leading-relaxed">
            <p>A child exits the program when they graduate from school or otherwise stop participating. From that point we hold their program data for one further year &mdash; long enough to issue final reports, address any follow-up questions, and reconcile the year&rsquo;s rewards &mdash; after which the data is anonymised and then deleted.</p>
            <p>Anonymisation means real first and last names, photographs that identify the child, and any other directly identifying information are removed. Aggregate, non-identifying program statistics may be kept for the foundation&rsquo;s historical record.</p>
          </GlassCard>
        </motion.section>

        <motion.section {...sectionAnim} className="space-y-4">
          <h2 className="font-display font-bold text-2xl text-text-primary">Early deletion on request</h2>
          <GlassCard className="p-6 space-y-3 text-text-muted leading-relaxed">
            <p>A child&rsquo;s parent or legal guardian, a mentor, a volunteer, or a donor may request earlier deletion of their personal data at any time by writing to <a href="mailto:ask@mentorsforkids.in" className="text-primary hover:underline">ask@mentorsforkids.in</a>. We will honour the request within 30 days, except where a record must be retained to meet a legal, tax, or audit obligation.</p>
          </GlassCard>
        </motion.section>

        <motion.section {...sectionAnim} className="space-y-4">
          <h2 className="font-display font-bold text-2xl text-text-primary">Backups</h2>
          <GlassCard className="p-6 space-y-3 text-text-muted leading-relaxed">
            <p>Operational backups taken by our processors (Firebase, Cloudinary, DigitalOcean, Vercel) follow each provider&rsquo;s standard schedule. Deleted data is removed from active systems immediately and from backups within the provider&rsquo;s normal backup-rotation window, typically 30 to 90 days.</p>
          </GlassCard>
        </motion.section>

        <motion.section {...sectionAnim} className="space-y-4">
          <h2 className="font-display font-bold text-2xl text-text-primary">Contact</h2>
          <GlassCard className="p-6 space-y-3 text-text-muted leading-relaxed">
            <p>Questions about this policy or about a specific deletion request: <a href="mailto:ask@mentorsforkids.in" className="text-primary hover:underline">ask@mentorsforkids.in</a>.</p>
          </GlassCard>
        </motion.section>
      </div>
    </div>
  );
}
