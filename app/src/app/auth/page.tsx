'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { useAuthStore, MOCK_USERS } from '@/stores/authStore';
import { useLocaleStore } from '@/stores/localeStore';
import { t } from '@/lib/i18n';

// Design-pass role picker: maps phone prefix to role
const ROLE_MAP: Record<string, 'admin' | 'mentor'> = {
  '9000000001': 'admin',
  '9876543210': 'mentor',
};

export default function AuthPage() {
  const router  = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const locale = useLocaleStore((s) => s.locale);
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSendOTP = () => {
    if (phone.length < 10) return;
    setOtpSent(true);
    setCountdown(30);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8 md:p-10" glow>
          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-text-primary">
              {otpSent ? t('auth.verifyOtp', locale) : t('auth.welcome', locale)}
            </h1>
            <p className="text-text-muted mt-2">
              {otpSent
                ? t('auth.codeSent', locale, { phone })
                : t('auth.signIn', locale)}
            </p>
          </div>

          {!otpSent ? (
            <div className="space-y-6">
              {/* Phone input */}
              <div>
                <label className="text-text-muted text-sm mb-2 block">{t('auth.phoneLabel', locale)}</label>
                <div className="flex gap-3">
                  <div className="glass rounded-xl px-4 py-3 flex items-center gap-2 shrink-0">
                    <span className="text-lg">🇮🇳</span>
                    <span className="text-text-muted text-sm font-mono">+91</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder={t('auth.enterPhone', locale)}
                    className="flex-1 px-4 py-3 rounded-xl glass text-text-primary placeholder-text-muted outline-none font-mono text-lg tracking-wider"
                    autoFocus
                  />
                </div>
              </div>

              {/* WhatsApp option */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-border accent-mint"
                />
                <span className="text-text-muted text-sm">{t('auth.whatsapp', locale)}</span>
              </label>

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleSendOTP}
                disabled={phone.length < 10}
              >
                {t('auth.sendOtp', locale)}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* OTP input */}
              <div className="flex gap-3 justify-center">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-12 h-14 rounded-xl glass text-center text-xl font-mono font-bold text-text-primary outline-none focus:border-primary/50 transition-colors"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              {/* Resend */}
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-text-muted text-sm">
                    {t('auth.resendIn', locale, { sec: String(countdown) })}
                  </p>
                ) : (
                  <button
                    onClick={handleSendOTP}
                    className="text-primary text-sm font-medium hover:text-primary-glow transition-colors"
                  >
                    {t('auth.resendOtp', locale)}
                  </button>
                )}
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => {
                  const role = ROLE_MAP[phone] ?? 'public';
                  const user = MOCK_USERS[role];
                  setUser({ ...user, phone });
                  router.push(role === 'admin' ? '/admin' : role === 'mentor' ? '/mentor' : '/');
                }}
                disabled={otp.some(d => !d)}
              >
                {t('auth.verifyLogin', locale)}
              </Button>

              <button
                onClick={() => { setOtpSent(false); setOtp(['', '', '', '', '', '']); }}
                className="w-full text-center text-text-muted text-sm hover:text-primary transition-colors"
              >
                {t('auth.changePhone', locale)}
              </button>
            </div>
          )}

          <p className="text-text-muted text-xs text-center mt-8">
            {t('auth.terms', locale)}
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
