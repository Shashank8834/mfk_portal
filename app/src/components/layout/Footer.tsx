'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocaleStore } from '@/stores/localeStore';
import { t } from '@/lib/i18n';

export function Footer() {
  const locale = useLocaleStore((s) => s.locale);
  return (
    <footer className="relative bg-bg-card/50 pb-20 md:pb-0">
      {/* Gradient top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/mfk-logo.png" alt="Mentors for Kids" width={36} height={36} />
              <span className="font-display font-bold text-lg">
                <span className="text-[#4B3B8E]">Mentors</span>
                <span className="text-accent"> for </span>
                <span className="text-[#F5A623]">Kids</span>
              </span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed">
              {t('footer.brand', locale)}
            </p>
            <div className="flex items-center gap-2 mt-4">
              <div className="glass px-3 py-1.5 rounded-lg flex items-center gap-2">
                <span className="text-xs text-text-muted">{t('footer.backedBy', locale)}</span>
                <span className="text-sm font-semibold text-primary">Zerodha</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-sm text-text-primary uppercase tracking-wider mb-4">{t('footer.explore', locale)}</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/stories', label: t('footer.studentStories', locale) },
                { href: '/map', label: t('footer.schoolMap', locale) },
                { href: '/schools', label: t('footer.allSchools', locale) },
                { href: '/donate', label: t('nav.donate', locale) },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-muted text-sm hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-display font-semibold text-sm text-text-primary uppercase tracking-wider mb-4">{t('footer.about', locale)}</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/about#what-we-do', label: t('footer.ourMission', locale) },
                { href: 'https://bclindia.in/', label: t('footer.bclIndia', locale) },
                { href: '/about#partners', label: t('footer.partnersCSR', locale) },
                { href: '/apply', label: t('footer.becomeAMentor', locale) },
              ].map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('http') ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted text-sm hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-text-muted text-sm hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-sm text-text-primary uppercase tracking-wider mb-4">{t('footer.getInTouch', locale)}</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-mint/10 text-mint text-sm font-medium hover:bg-mint/20 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {t('footer.whatsapp', locale)}
                </a>
              </li>
              <li>
                <a href="mailto:ask@mentorsforkids.in" className="text-text-muted text-sm hover:text-primary transition-colors">
                  ask@mentorsforkids.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs text-center sm:text-left">
            © {new Date().getFullYear()} Mentors for Kids Foundation. A not-for-profit initiative by BCL India.
          </p>
          <div className="flex items-center gap-2">
            <span className="glass px-3 py-1.5 rounded-lg text-xs text-text-muted flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              {t('footer.registered', locale)}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
