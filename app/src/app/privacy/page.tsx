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

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <motion.div {...sectionAnim} className="space-y-3">
          <span className="text-gold text-sm font-semibold uppercase tracking-wider font-mono">Legal</span>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-text-primary">Privacy Policy</h1>
          <p className="text-text-muted text-sm">Last updated: {lastUpdated}</p>
        </motion.div>

        <motion.section {...sectionAnim}>
          <GlassCard className="p-6 md:p-8 space-y-4">
            <p className="text-text-muted leading-relaxed">
              Mentors for Kids Foundation (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;the foundation&rdquo;) operates this
              website and the mentor application. This policy explains what personal data we collect, why we
              collect it, and how we handle it. We comply with the Digital Personal Data Protection Act, 2023
              (&ldquo;DPDP Act&rdquo;) of India.
            </p>
          </GlassCard>
        </motion.section>

        <motion.section {...sectionAnim} className="space-y-4">
          <h2 className="font-display font-bold text-2xl text-text-primary">1. What we collect</h2>
          <GlassCard className="p-6 space-y-3 text-text-muted leading-relaxed">
            <p><strong className="text-text-primary">Children we work with:</strong> name, school, class, attendance, daily journal entries, photographs and videos taken during program activities, mutual fund contribution records, and a stable internal student ID.</p>
            <p><strong className="text-text-primary">Mentors and volunteers:</strong> name, contact details, role, and activity records within the mentor app.</p>
            <p><strong className="text-text-primary">Donors:</strong> name, contact details, and payment confirmations from UPI / payment processors. We do not store card or bank account numbers.</p>
            <p><strong className="text-text-primary">Visitors:</strong> standard server logs and anonymous usage analytics.</p>
          </GlassCard>
        </motion.section>

        <motion.section {...sectionAnim} className="space-y-4">
          <h2 className="font-display font-bold text-2xl text-text-primary">2. Why we collect it</h2>
          <GlassCard className="p-6 space-y-3 text-text-muted leading-relaxed">
            <p>We use this data to run the mentorship program, track each child&rsquo;s progress and rewards, communicate with mentors and donors, share program updates, issue donation receipts, and improve the website. We do not sell personal data and we do not use it for advertising.</p>
          </GlassCard>
        </motion.section>

        <motion.section {...sectionAnim} className="space-y-4">
          <h2 className="font-display font-bold text-2xl text-text-primary">3. Children&rsquo;s privacy</h2>
          <GlassCard className="p-6 space-y-3 text-text-muted leading-relaxed">
            <p>Public surfaces of the website (videos, listings, story pages) display children by an assumed name only. A child&rsquo;s real name is visible only to authorised foundation staff and mentors and is never spoken or shown in published video content. Parents or legal guardians may request access to, correction of, or deletion of their child&rsquo;s data at any time using the contact below.</p>
          </GlassCard>
        </motion.section>

        <motion.section {...sectionAnim} className="space-y-4">
          <h2 className="font-display font-bold text-2xl text-text-primary">4. Where the data lives</h2>
          <GlassCard className="p-6 space-y-3 text-text-muted leading-relaxed">
            <p>We use the following processors:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-text-primary">Firebase (Google)</strong> &mdash; authentication and primary database</li>
              <li><strong className="text-text-primary">Cloudinary</strong> &mdash; image storage and delivery</li>
              <li><strong className="text-text-primary">DigitalOcean</strong> &mdash; video storage and delivery</li>
              <li><strong className="text-text-primary">Vercel</strong> &mdash; website hosting</li>
              <li><strong className="text-text-primary">Google Maps</strong> &mdash; school location display</li>
              <li><strong className="text-text-primary">UPI &amp; payment partners</strong> &mdash; donations</li>
            </ul>
            <p>These processors may store data outside India in line with their own infrastructure. Each is bound by their own privacy commitments and applicable data-protection law.</p>
          </GlassCard>
        </motion.section>

        <motion.section {...sectionAnim} className="space-y-4">
          <h2 className="font-display font-bold text-2xl text-text-primary">5. How long we keep it</h2>
          <GlassCard className="p-6 space-y-3 text-text-muted leading-relaxed">
            <p>We keep program data (journal entries, attendance, videos, photographs and contribution records) for one year after a child graduates from or otherwise exits the program, after which it is anonymised or deleted. Donation and accounting records are kept for the period required by Indian tax and audit law. Server logs are retained for up to 90 days. See our <Link href="/data-retention" className="text-primary hover:underline">Data Retention Policy</Link> for the full schedule.</p>
          </GlassCard>
        </motion.section>

        <motion.section {...sectionAnim} className="space-y-4">
          <h2 className="font-display font-bold text-2xl text-text-primary">6. Your rights</h2>
          <GlassCard className="p-6 space-y-3 text-text-muted leading-relaxed">
            <p>Under the DPDP Act you (or, for a child, the parent or legal guardian) have the right to access the personal data we hold about you, to ask us to correct or update it, to ask us to delete it, and to withdraw any consent you have previously given. To exercise any of these rights, write to us at the address below. We respond within 30 days.</p>
          </GlassCard>
        </motion.section>

        <motion.section {...sectionAnim} className="space-y-4">
          <h2 className="font-display font-bold text-2xl text-text-primary">7. Security</h2>
          <GlassCard className="p-6 space-y-3 text-text-muted leading-relaxed">
            <p>Personal data is transmitted over HTTPS and stored in access-controlled systems. Authentication uses one-time passwords. We collect only the minimum data needed to operate the program. Payments are handled by UPI partners; we never store payment instrument numbers.</p>
          </GlassCard>
        </motion.section>

        <motion.section {...sectionAnim} className="space-y-4">
          <h2 className="font-display font-bold text-2xl text-text-primary">8. Changes to this policy</h2>
          <GlassCard className="p-6 space-y-3 text-text-muted leading-relaxed">
            <p>We may update this policy from time to time. The &ldquo;last updated&rdquo; date at the top of the page reflects the most recent change. Material changes will be notified through the website.</p>
          </GlassCard>
        </motion.section>

        <motion.section {...sectionAnim} className="space-y-4">
          <h2 className="font-display font-bold text-2xl text-text-primary">9. Contact</h2>
          <GlassCard className="p-6 space-y-3 text-text-muted leading-relaxed">
            <p>For any privacy question or to exercise your rights, write to us at <a href="mailto:ask@mentorsforkids.in" className="text-primary hover:underline">ask@mentorsforkids.in</a>.</p>
            <p className="text-sm">Mentors for Kids Foundation &mdash; a not-for-profit initiative by BCL India.</p>
          </GlassCard>
        </motion.section>
      </div>
    </div>
  );
}
