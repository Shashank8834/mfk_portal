'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';

const sectionAnim = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const dailyHabits = [
  'Wake up on time independently',
  'Make the bed and clean the room',
  'Show respect — touch parents\' feet and take blessings',
  'Prepare and serve tea to parents',
  'Exercise vigorously — running, skipping, yoga',
  'Make and eat your own breakfast',
  'Pack snacks and water bottle for school',
  'Be ready 10 minutes before departure',
  'Read the newspaper for 10 minutes before school',
  'After school — shower and rinse clothes in water',
  'Prepare and eat an evening snack',
  'Eat five meals daily',
  'At least 1 hour of vigorous physical play',
];

const studyRoutine = [
  { step: '1', title: 'Read', desc: 'Read the chapter from the textbook.' },
  { step: '2', title: 'Watch', desc: 'Watch YouTube videos — first in native language for concepts, then in English for terminology.' },
  { step: '3', title: 'Re-read', desc: 'Re-read the chapter with deeper comprehension.' },
  { step: '4', title: 'Solve', desc: 'Solve all sample problems and exercises in the notebook — every single one.' },
];

const rewardTiers = [
  { condition: 'Full compliance', foundation: '₹250', parent: '₹250', total: '₹750' },
  { condition: 'One absence/late', foundation: '₹125', parent: '₹250', total: '₹500' },
  { condition: 'Two absences/late', foundation: '₹62.50', parent: '₹250', total: '₹375' },
  { condition: 'Further infractions', foundation: 'Halved each time', parent: '₹250', total: 'Varies' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Page Header */}
        <motion.div {...sectionAnim} className="text-center space-y-4">
          <span className="text-gold text-sm font-semibold uppercase tracking-wider font-mono">About Us</span>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-text-primary">
            Financial Literacy for Every Child
          </h1>
          <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto text-balance">
            We teach underprivileged schoolchildren the value of discipline, good habits, and money management — one journal entry at a time.
          </p>
        </motion.div>

        {/* ── What We Do ── */}
        <motion.section {...sectionAnim} id="what-we-do" className="scroll-mt-24 space-y-8">
          <div>
            <span className="text-mint text-sm font-semibold uppercase tracking-wider font-mono">01</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-text-primary mt-2">What we do</h2>
          </div>

          <div className="space-y-6">
            <p className="text-text-muted text-lg leading-relaxed max-w-3xl">
              Our program has four primary goals: develop good daily habits, cultivate the habit of earning money, encourage saving, and teach how to grow money through investment. Alongside this, we improve spoken English and introduce effective study methods for academic success.
            </p>
            <p className="text-text-muted text-lg leading-relaxed max-w-3xl">
              Students maintain a daily register documenting their tasks, which is submitted to the class teacher each day for review. Consistent completion of tasks and homework earns monthly rewards — ₹250 from the foundation, invested directly into a mutual fund (Large Cap Stock ELSS). Parents can match this amount, bringing the total monthly investment up to ₹750.
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
              <h3 className="font-display font-bold text-lg text-text-primary">Monthly Award System</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 pr-4 text-text-muted font-medium">Condition</th>
                      <th className="text-right py-3 px-4 text-text-muted font-medium">Foundation</th>
                      <th className="text-right py-3 px-4 text-text-muted font-medium">Parent</th>
                      <th className="text-right py-3 pl-4 text-mint font-medium">Total/mo</th>
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
              <p className="text-text-muted text-xs">If parents contribute ₹250 into their Savings Account, we double our reward to Rs. 500 in Mutual Funds.</p>
            </GlassCard>
          </div>
        </motion.section>

        {/* ── How We Do It ── */}
        <motion.section {...sectionAnim} id="how-we-do-it" className="scroll-mt-24 space-y-8">
          <div>
            <span className="text-mint text-sm font-semibold uppercase tracking-wider font-mono">02</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-text-primary mt-2">How we do it</h2>
          </div>

          {/* Daily Habits */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-xl text-text-primary">Daily Habit Tracking</h3>
            <p className="text-text-muted text-base leading-relaxed">
              Students maintain a register documenting these tasks every morning. The register is submitted to the class teacher for review and initials. Our Mentors also review it thrice a week and upload a PDF to our portal for documentation and AI analysis.
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
            <h3 className="font-display font-bold text-xl text-text-primary">Study Routine (6 PM – 9 PM)</h3>
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
            <h3 className="font-display font-bold text-xl text-text-primary">Spoken English Training</h3>
            <GlassCard className="p-6 space-y-3">
              <p className="text-text-muted text-base leading-relaxed">
                Dedicated sessions after school (3:00 PM – 4:30 PM) focused on spoken English. Students read simple books using a dictionary, write down difficult words, and practice in groups of 3 to develop speaking and listening skills.
              </p>
              <p className="text-text-muted text-base leading-relaxed">
                An English mentor visits on alternate days to guide and support. Parental involvement is encouraged during mentor visits. Non-participation results in absence marking from the program.
              </p>
            </GlassCard>
          </div>
        </motion.section>

        {/* ── Mentors ── */}
        <motion.section {...sectionAnim} id="mentors" className="scroll-mt-24 space-y-8">
          <div>
            <span className="text-mint text-sm font-semibold uppercase tracking-wider font-mono">03</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-text-primary mt-2">Mentors</h2>
            <p className="text-text-muted text-lg mt-3">Our interns who work directly with the students every day.</p>
          </div>

          <GlassCard className="p-6 space-y-3">
            <p className="text-text-muted text-base leading-relaxed">
              Paid interns who are dedicated to a school and visit thrice a day. From 2–3 PM, they check all the journals and upload to our portal.
              From 3–4:30, they help the students improve their spoken language skills by participating in group discussions, giving tips, and recognising great performances.
              Then they interact with visiting parents, videotape their observations and concerns, and upload to the portal.
              If parents invite, they also visit student homes to capture their context, videotaping and uploading.
              If there are pressing needs (e.g. table is broken, they need a lamp or chair), they upload it to the portal.
            </p>
          </GlassCard>

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
                <p className="text-text-muted text-sm">Program Intern</p>
              </GlassCard>
            ))}
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
            <h3 className="font-display font-bold text-2xl text-text-primary">We&apos;re Hiring!</h3>
            <p className="text-text-muted text-base max-w-lg mx-auto">
              Join our team of mentors and make a direct impact on children&apos;s lives. Paid internship with travel reimbursement.
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
                Read the Full Job Description
              </a>
            </p>
            <Link href="/apply">
              <Button variant="gold" size="lg">
                Apply Now
              </Button>
            </Link>
          </GlassCard>
        </motion.section>

        {/* ── Partners ── */}
        <motion.section {...sectionAnim} id="partners" className="scroll-mt-24 space-y-8">
          <div>
            <span className="text-mint text-sm font-semibold uppercase tracking-wider font-mono">04</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-text-primary mt-2">Partners</h2>
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
              <p className="text-text-muted text-sm">Investment partner enabling mutual fund accounts (Large Cap Stock ELSS) for students. Every month, ₹250 from the foundation is invested directly into each student&apos;s account.</p>
            </div>
          </GlassCard>
        </motion.section>

        {/* ── Volunteers ── */}
        <motion.section {...sectionAnim} id="volunteers" className="scroll-mt-24 space-y-8">
          <div>
            <span className="text-mint text-sm font-semibold uppercase tracking-wider font-mono">05</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-text-primary mt-2">Volunteers</h2>
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
              <h3 className="font-display font-bold text-lg text-text-primary">Community Volunteers</h3>
              <p className="text-text-muted text-sm">Friends and family members who dedicate a couple of hours each week to mentor students, support English learning sessions, and help with program activities.</p>
            </div>
          </GlassCard>
        </motion.section>

        {/* ── Technology ── */}
        <motion.section {...sectionAnim} id="technology" className="scroll-mt-24 space-y-8">
          <div>
            <span className="text-mint text-sm font-semibold uppercase tracking-wider font-mono">06</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-text-primary mt-2">Technology</h2>
          </div>

          <GlassCard className="p-8 space-y-6">
            <p className="text-text-muted text-lg leading-relaxed">
              This portal is built with modern web technologies to provide a seamless experience for students, mentors, and donors. Our architecture is designed for scale and reliability, ensuring every student&apos;s story and progress is tracked accurately.
            </p>

            {/* Tech Stack Diagram */}
            <div className="rounded-2xl border border-border bg-bg-elevated/50 p-6 space-y-6">
              <h4 className="font-display font-bold text-base text-text-primary text-center">Technology Stack</h4>

              {/* Frontend Layer */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Frontend</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { name: 'Next.js 16', desc: 'App Router' },
                    { name: 'React 19', desc: 'UI Library' },
                    { name: 'TypeScript', desc: 'Type Safety' },
                    { name: 'Tailwind CSS', desc: 'Styling' },
                  ].map((t) => (
                    <div key={t.name} className="text-center px-3 py-3 rounded-xl bg-bg-card border border-border">
                      <span className="text-sm font-mono text-primary font-medium block">{t.name}</span>
                      <span className="text-xs text-text-muted">{t.desc}</span>
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
                <span className="text-xs font-semibold text-accent uppercase tracking-wider">Backend &amp; Services</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { name: 'Firebase', desc: 'Auth & DB' },
                    { name: 'UPI', desc: 'Payments' },
                    { name: 'Cloudinary', desc: 'Media CDN' },
                    { name: 'Google Maps', desc: 'Geolocation' },
                  ].map((t) => (
                    <div key={t.name} className="text-center px-3 py-3 rounded-xl bg-bg-card border border-border">
                      <span className="text-sm font-mono text-accent font-medium block">{t.name}</span>
                      <span className="text-xs text-text-muted">{t.desc}</span>
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
                <span className="text-xs font-semibold text-mint uppercase tracking-wider">Infrastructure</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { name: 'Vercel', desc: 'Hosting & CDN' },
                    { name: 'GitHub', desc: 'Version Control' },
                    { name: 'Analytics', desc: 'Usage Insights' },
                  ].map((t) => (
                    <div key={t.name} className="text-center px-3 py-3 rounded-xl bg-bg-card border border-border">
                      <span className="text-sm font-mono text-mint font-medium block">{t.name}</span>
                      <span className="text-xs text-text-muted">{t.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Security & Privacy */}
          <GlassCard className="p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-mint/10 border border-mint/20 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-xl text-text-primary">Security &amp; Privacy</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Data Encryption', desc: 'All data is encrypted in transit (TLS 1.3) and at rest. Student information is never exposed publicly.' },
                { title: 'OTP Authentication', desc: 'Phone-based OTP verification ensures only authorized users access student data and donation records.' },
                { title: 'Minimal Data Collection', desc: 'We collect only what is necessary. No tracking cookies, no third-party data sharing, no ad networks.' },
                { title: 'Direct UPI Payments', desc: 'Donations are processed via UPI QR code — no card details collected, no intermediary storing sensitive data.' },
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
