'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

type Step = 'form' | 'verify' | 'success';

export default function ApplyPage() {
  const [step, setStep] = useState<Step>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verifyingField, setVerifyingField] = useState<'email' | 'phone'>('email');
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const handleSendOtp = (field: 'email' | 'phone') => {
    setVerifyingField(field);
    setStep('verify');
    setOtp(['', '', '', '', '', '']);
  };

  const handleVerifyOtp = () => {
    // Mock verification
    if (verifyingField === 'email') setEmailVerified(true);
    else setPhoneVerified(true);
    setStep('form');
  };

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !youtubeUrl.trim()) return;
    setStep('success');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  return (
    <div className="pt-20 min-h-screen pb-20 md:pb-10">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
        {step === 'form' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h1 className="font-display font-bold text-3xl md:text-4xl text-text-primary">
                Apply to be a Mentor
              </h1>
              <p className="text-text-muted mt-2">
                Join our team and make a difference in children&apos;s lives.
              </p>
              <p className="text-text-muted text-sm mt-1">
                <Link
                  href="/careers"
                  className="text-primary hover:underline font-medium"
                >
                  Read the Job Description
                </Link>
              </p>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-xl glass text-text-primary placeholder-text-muted text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-3 rounded-xl glass text-text-primary placeholder-text-muted text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  {emailVerified ? (
                    <span className="flex items-center gap-1 px-3 text-mint text-sm font-medium">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Verified
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSendOtp('email')}
                      disabled={!email.includes('@')}
                      className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-glow transition-all disabled:opacity-40"
                    >
                      Verify
                    </button>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Phone Number</label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit mobile number"
                    className="flex-1 px-4 py-3 rounded-xl glass text-text-primary placeholder-text-muted text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  {phoneVerified ? (
                    <span className="flex items-center gap-1 px-3 text-mint text-sm font-medium">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Verified
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSendOtp('phone')}
                      disabled={phone.length !== 10}
                      className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-glow transition-all disabled:opacity-40"
                    >
                      Verify
                    </button>
                  )}
                </div>
              </div>

              {/* YouTube Video */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Application Video</label>
                <p className="text-text-muted text-xs mb-2">
                  Create a 1-minute YouTube video telling us about yourself. If you&apos;d like (entirely optional),
                  add another 1 minute about why you&apos;d like to be a mentor.
                </p>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-3 rounded-xl glass text-text-primary placeholder-text-muted text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <Button
              variant="gold"
              size="lg"
              className="w-full"
              onClick={handleSubmit}
            >
              Submit Application
            </Button>
          </motion.div>
        )}

        {step === 'verify' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <button onClick={() => setStep('form')} className="text-text-muted text-sm hover:text-primary flex items-center gap-1">
              ← Back
            </button>
            <div className="text-center space-y-2">
              <h2 className="font-display font-bold text-2xl text-text-primary">Verify {verifyingField === 'email' ? 'Email' : 'Phone'}</h2>
              <p className="text-text-muted text-sm">
                Enter the 6-digit code sent to {verifyingField === 'email' ? email : phone}
              </p>
            </div>

            <div className="flex justify-center gap-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="w-12 h-14 text-center text-xl font-mono font-bold rounded-xl glass text-text-primary outline-none focus:ring-2 focus:ring-primary/30"
                />
              ))}
            </div>

            <Button variant="primary" size="lg" className="w-full" onClick={handleVerifyOtp}>
              Verify
            </Button>

            <p className="text-text-muted text-xs text-center">
              Didn&apos;t receive a code? <button className="text-primary hover:underline">Resend</button>
            </p>
          </motion.div>
        )}

        {step === 'success' && (
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
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </motion.div>

            <h2 className="font-display font-bold text-3xl text-text-primary">
              Application Submitted!
            </h2>
            <p className="text-text-muted text-lg max-w-md mx-auto">
              Thank you for your interest, {name.split(' ')[0]}! We&apos;ll review your video and get back to you soon.
            </p>

            <Link href="/">
              <Button variant="secondary">Back to Home</Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
