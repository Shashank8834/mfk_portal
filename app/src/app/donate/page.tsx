'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const donorFaqs = [
  { q: 'What is the minimum amount I can contribute?', a: 'You can contribute any amount — there is no minimum.' },
  { q: 'Do I get tax benefits under Section 80G?', a: 'Yes. Please enter your PAN details after payment to receive your 80G certificate by email.' },
  { q: 'Can I direct my donation towards a specific student?', a: 'Yes. Select the student while making your donation and your contribution will be tracked against their account.' },
  { q: 'Can I contribute directly to a student\'s mutual fund?', a: 'No. Students must earn their rewards as per our Standard Procedures. Direct contributions to the mutual fund are not permitted.' },
  { q: 'When will the parents be able to withdraw the money?', a: 'Since the funds are invested in Mutual Funds (Large Cap Stock ELSS), there is a 3-year lock-in period. We emphasise the importance of staying invested longer to benefit from the power of compounding.' },
  { q: 'Will the student I sponsor know I am their sponsor?', a: 'No. Your identity remains private. You can track the student\'s progress through the portal, but they will not be informed of who is sponsoring them.' },
  { q: 'Can I pay with a credit card?', a: 'No. Please use UPI (Google Pay, PhonePe, Paytm, or any UPI-enabled app).' },
  { q: 'Do you accept Dollar contributions?', a: 'Not at this time. If you would like to be informed when FCRA / international contributions are available, please write to us.' },
];
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { students as allStudents } from '@/data/students';
import { schools } from '@/data/schools';
import { displayName } from '@/lib/utils';

type DonationType = 'student' | 'school' | 'general';
type Step = 1 | 2 | 3 | 4;

export default function DonatePage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>(1);
  const [donationType, setDonationType] = useState<DonationType | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const type = searchParams.get('type') as DonationType | null;
    const id = searchParams.get('id');
    if (type === 'school' && id) {
      setDonationType('school');
      setSelectedId(id);
      setStep(3);
    } else if (type === 'student' && id) {
      setDonationType('student');
      setSelectedId(id);
      setStep(3);
    }
  }, [searchParams]);

  const selectedStudent = donationType === 'student' ? allStudents.find(s => s.id === selectedId) : null;
  const selectedSchool = donationType === 'school' ? schools.find(s => s.id === selectedId) : null;

  const handleDonate = () => {
    // In production, verify payment via backend after user scans QR
    setStep(4);
  };

  return (
    <div className="pt-20 min-h-screen pb-20 md:pb-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-10">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`h-1.5 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-primary' : 'bg-bg-elevated'
              }`} />
            </div>
          ))}
        </div>

        {/* Step 1: Choose type */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h1 className="font-display font-bold text-3xl md:text-4xl text-text-primary">
                Make a Difference
              </h1>
              <p className="text-text-muted mt-3 text-base">Choose how you&apos;d like to contribute</p>
            </div>

            {[
              { type: 'student' as DonationType, icon: '👨‍🎓', title: 'Sponsor a Student', desc: 'Fund education, supplies, and activities for a specific student' },
              { type: 'school' as DonationType, icon: '🏫', title: 'Fund a School', desc: 'Support an entire school with infrastructure and program funding' },
              { type: 'general' as DonationType, icon: '💝', title: 'General Donation', desc: 'Contribute to the MFK Foundation\'s overall mission' },
            ].map((option) => (
              <button
                key={option.type}
                onClick={() => { setDonationType(option.type); setStep(option.type === 'general' ? 3 : 2); }}
                className="w-full text-left"
              >
                <GlassCard className="p-6 flex items-center gap-5 group">
                  <span className="text-4xl">{option.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-lg text-text-primary group-hover:text-primary transition-colors">{option.title}</h3>
                    <p className="text-text-muted text-sm mt-1">{option.desc}</p>
                  </div>
                  <svg className="text-text-muted group-hover:text-primary transition-colors" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </GlassCard>
              </button>
            ))}
          </motion.div>
        )}

        {/* Step 2: Select recipient */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <button onClick={() => setStep(1)} className="text-text-muted text-sm hover:text-primary flex items-center gap-1">
              ← Back
            </button>
            <h2 className="font-display font-bold text-2xl text-text-primary">
              {donationType === 'student' ? 'Select a Student' : 'Select a School'}
            </h2>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${donationType === 'student' ? 'students' : 'schools'}...`}
              aria-label={`Search ${donationType === 'student' ? 'students' : 'schools'}`}
              className="w-full px-4 py-3 rounded-xl glass text-text-primary placeholder-text-muted text-sm outline-none"
            />

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {donationType === 'student' &&
                allStudents
                  .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .slice(0, 15)
                  .map((student) => (
                    <button
                      key={student.id}
                      onClick={() => { setSelectedId(student.id); setStep(3); }}
                      className="w-full text-left"
                    >
                      <GlassCard className={`p-4 flex items-center gap-4 ${selectedId === student.id ? 'border-primary/40' : ''}`}>
                        <div className="w-10 h-10 rounded-lg bg-bg-elevated flex items-center justify-center text-primary font-bold text-sm">
                          {student.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-text-primary truncate">{displayName(student.name)}</p>
                          <p className="text-xs text-text-muted">{student.schoolName} · Grade {student.grade}</p>
                        </div>
                        <Badge variant="gold" size="sm">Grade {student.grade}</Badge>
                      </GlassCard>
                    </button>
                  ))
              }
              {donationType === 'school' &&
                schools
                  .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((school) => (
                    <button
                      key={school.id}
                      onClick={() => { setSelectedId(school.id); setStep(3); }}
                      className="w-full text-left"
                    >
                      <GlassCard className={`p-4 flex items-center gap-4 ${selectedId === school.id ? 'border-primary/40' : ''}`}>
                        <div className="w-10 h-10 rounded-lg bg-bg-elevated flex items-center justify-center text-lg">🏫</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-text-primary truncate">{school.name}</p>
                          <p className="text-xs text-text-muted">{school.studentCount} students</p>
                        </div>
                        <Badge variant="primary" size="sm">{school.studentCount} students</Badge>
                      </GlassCard>
                    </button>
                  ))
              }
            </div>
          </motion.div>
        )}

        {/* Step 3: QR Code Payment */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <button onClick={() => setStep(donationType === 'general' ? 1 : 2)} className="text-text-muted text-sm hover:text-primary flex items-center gap-1">
              ← Back
            </button>
            <h2 className="font-display font-bold text-2xl text-text-primary">Scan & Pay</h2>

            {/* Donation summary */}
            <GlassCard className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-text-muted text-sm">Type</span>
                <span className="text-text-primary text-sm font-medium capitalize">{donationType} donation</span>
              </div>
              {selectedStudent && (
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="text-text-muted text-sm">Student</span>
                  <span className="text-text-primary text-sm font-medium">{displayName(selectedStudent.name)}</span>
                </div>
              )}
              {selectedSchool && (
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="text-text-muted text-sm">School</span>
                  <span className="text-text-primary text-sm font-medium">{selectedSchool.name}</span>
                </div>
              )}
            </GlassCard>

            {/* QR Code */}
            <GlassCard className="p-8 text-center space-y-5" glow>
              <p className="text-text-muted text-sm font-medium">Scan to pay via UPI</p>
              <div className="w-52 h-52 mx-auto rounded-xl bg-white flex items-center justify-center border-2 border-border">
                {/* Replace with actual UPI QR code image */}
                <div className="text-center p-4">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#5B4DB1" strokeWidth="1.5" className="mx-auto mb-2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="3" height="3" />
                    <rect x="18" y="14" width="3" height="3" />
                    <rect x="14" y="18" width="3" height="3" />
                    <rect x="18" y="18" width="3" height="3" />
                  </svg>
                  <p className="text-xs text-gray-500">QR Code</p>
                </div>
              </div>
              <p className="text-text-muted text-xs">
                UPI ID: <span className="font-mono text-text-primary">mentorsforkids@upi</span>
              </p>
              <p className="text-text-muted text-xs">
                Pay any amount you wish to contribute
              </p>
            </GlassCard>

            <GlassCard className="p-4 flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06D6A0" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <p className="text-text-muted text-sm">
                80G tax benefit certificate will be emailed after payment
              </p>
            </GlassCard>

            <Button variant="gold" size="lg" className="w-full" onClick={handleDonate}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              I&apos;ve Completed the Payment
            </Button>

            <p className="text-text-muted text-xs text-center">
              Scan the QR code with any UPI app (Google Pay, PhonePe, Paytm, etc.)
            </p>
          </motion.div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 py-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
              className="w-24 h-24 rounded-full bg-mint/20 flex items-center justify-center mx-auto"
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#06D6A0" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </motion.div>

            <h2 className="font-display font-bold text-3xl text-text-primary">
              Thank You! 🎉
            </h2>
            <p className="text-text-muted text-lg max-w-md mx-auto">
              Your generosity is making a real difference in a child&apos;s life.
            </p>

            {selectedStudent && (
              <GlassCard className="p-6 max-w-sm mx-auto" glow>
                <div className="w-16 h-16 rounded-xl bg-bg-elevated flex items-center justify-center text-2xl text-primary font-bold mx-auto mb-3">
                  {selectedStudent.initials}
                </div>
                <h3 className="font-display font-bold text-lg text-text-primary">{displayName(selectedStudent.name)}</h3>
                <p className="text-text-muted text-sm mt-1">Your support means the world to {selectedStudent.name.split(' ')[0]}.</p>
              </GlassCard>
            )}

            {selectedSchool && (
              <GlassCard className="p-6 max-w-sm mx-auto" glow>
                <div className="w-16 h-16 rounded-xl bg-bg-elevated flex items-center justify-center text-2xl mx-auto mb-3">🏫</div>
                <h3 className="font-display font-bold text-lg text-text-primary">{selectedSchool.name}</h3>
                <p className="text-text-muted text-sm mt-1">Your support helps every student at this school.</p>
              </GlassCard>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/schools">
                <Button variant="primary">Explore More Students</Button>
              </Link>
              <Link href="/">
                <Button variant="secondary">Back to Home</Button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Donor FAQs — always visible */}
        <div className="mt-16 space-y-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-text-primary">Frequently Asked Questions</h2>
            <p className="text-text-muted text-sm mt-1">Common questions from donors.</p>
          </div>
          <div className="space-y-3">
            {donorFaqs.map((faq, i) => (
              <GlassCard key={i} className="overflow-hidden">
                <button
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-3"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-text-primary text-sm">{faq.q}</span>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className={`shrink-0 text-text-muted transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-text-muted text-sm leading-relaxed border-t border-border pt-3">
                    {faq.a}
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
