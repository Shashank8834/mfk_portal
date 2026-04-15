'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { useLocaleStore } from '@/stores/localeStore';
import { t } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

function useNavLinks() {
  const locale = useLocaleStore((s) => s.locale);
  return [
    { href: '/', label: t('nav.home', locale), key: 'Home' },
    { href: '/about', label: t('nav.about', locale), key: 'About Us', dropdown: [
      { href: '/about#what-we-do', label: t('nav.about.whatWeDo', locale) },
      { href: '/about#how-we-do-it', label: t('nav.about.howWeDoIt', locale) },
      { href: '/about#mentors', label: t('nav.about.mentors', locale) },
      { href: '/about#partners', label: t('nav.about.partners', locale) },
      { href: '/about#volunteers', label: t('nav.about.volunteers', locale) },
      { href: '/about#technology', label: t('nav.about.technology', locale) },
    ]},
    { href: '/schools', label: t('nav.schools', locale), key: 'Schools' },
    { href: '/stories', label: t('nav.stories', locale), key: 'Stories' },
    { href: '/map', label: t('nav.map', locale), key: 'Map' },
    { href: '/publications', label: t('nav.publications', locale), key: 'Publications' },
    { href: '/favorites', label: t('nav.favorites', locale), key: 'Favorites' },
  ];
}

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const favCount = useFavoritesStore((s) => s.favorites.length);
  const locale = useLocaleStore((s) => s.locale);
  const navLinks = useNavLinks();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- close menu on navigation
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'glass-elevated shadow-lg shadow-black/20'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group" prefetch>
              <div className="relative">
                <Image
                  src="/mfk-logo.png"
                  alt="Mentors for Kids"
                  width={44}
                  height={44}
                  className="w-10 h-10 md:w-11 md:h-11 drop-shadow-[0_0_12px_rgba(91,77,177,0.4)] group-hover:drop-shadow-[0_0_18px_rgba(91,77,177,0.6)] transition-all duration-300"
                  priority
                />
              </div>
              <span className="font-display font-bold text-lg md:text-xl hidden sm:block">
                <span className="text-[#4B3B8E]">Mentors</span>
                <span className="text-accent"> for </span>
                <span className="text-[#F5A623]">Kids</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.dropdown && pathname.startsWith(link.href));
                if (link.dropdown) {
                  return (
                    <div key={link.href} className="relative group">
                      <Link
                        href={link.href}
                        prefetch
                        className={cn(
                          'relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1',
                          isActive
                            ? 'text-primary-glow'
                            : 'text-text-muted hover:text-text-primary hover:bg-bg-elevated/50'
                        )}
                      >
                        {link.label}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:rotate-180">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                        {isActive && (
                          <motion.div
                            layoutId="navbar-indicator"
                            className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </Link>
                      <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="glass-elevated rounded-xl border border-border shadow-xl shadow-black/20 py-2 min-w-[180px]">
                          {link.dropdown.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className="block px-4 py-2 text-sm text-text-muted hover:text-text-primary hover:bg-bg-elevated/50 transition-colors"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch
                    className={cn(
                      'relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'text-primary-glow'
                        : 'text-text-muted hover:text-text-primary hover:bg-bg-elevated/50'
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      {link.label}
                      {link.key === 'Favorites' && favCount > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent text-white text-xs font-bold">
                          {favCount}
                        </span>
                      )}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>

              {/* Cmd+K search button */}
              <button
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-text-muted text-sm hover:border-primary/30 hover:text-text-primary transition-all"
                onClick={() => {
                  const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
                  document.dispatchEvent(event);
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                {t('nav.search', locale)}
                <kbd className="px-1.5 py-0.5 text-xs rounded bg-bg-elevated font-mono">⌘K</kbd>
              </button>

              {/* Donate CTA */}
              <Link
                href="/donate"
                className="hidden md:inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gold text-white text-sm font-bold hover:bg-orange hover:shadow-[0_0_20px_rgba(245,166,35,0.3)] transition-all duration-300"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {t('nav.donate', locale)}
              </Link>

              {/* Login button */}
              <Link
                href="/auth"
                className="hidden md:inline-flex items-center px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-glow hover:shadow-[0_0_20px_rgba(91,77,177,0.4)] transition-all duration-300"
              >
                {t('nav.login', locale)}
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden flex flex-col gap-1.5 p-2"
                aria-label="Toggle menu"
              >
                <motion.span
                  animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  className="block w-6 h-0.5 bg-text-primary"
                />
                <motion.span
                  animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="block w-6 h-0.5 bg-text-primary"
                />
                <motion.span
                  animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  className="block w-6 h-0.5 bg-text-primary"
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-bg-deep/95 backdrop-blur-xl" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-bg-card border-l border-border p-6 pt-24"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || (link.dropdown && pathname.startsWith(link.href));
                  return (
                    <div key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          'flex items-center justify-between px-4 py-3 rounded-xl text-lg font-medium transition-all',
                          isActive
                            ? 'bg-primary/10 text-primary-glow'
                            : 'text-text-muted hover:text-text-primary hover:bg-bg-elevated'
                        )}
                      >
                        <span className="flex items-center gap-2">
                          {link.label}
                        </span>
                        {link.label === 'Favorites' && favCount > 0 && (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent text-white text-sm font-bold">
                            {favCount}
                          </span>
                        )}
                      </Link>
                      {link.dropdown && (
                        <div className="ml-6 mt-1 flex flex-col gap-1">
                          {link.dropdown.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className="px-4 py-2 rounded-lg text-sm text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                <hr className="border-border my-4" />
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-sm text-text-muted">Language</span>
                  <LanguageSwitcher />
                </div>
                <Link
                  href="/auth"
                  className="flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-white font-semibold text-lg hover:bg-primary-glow transition-all"
                >
                  {t('nav.login', locale)}
                </Link>
                <Link
                  href="/donate"
                  className="flex items-center justify-center px-6 py-3 rounded-xl border border-accent/30 text-accent font-semibold text-lg hover:bg-accent/10 transition-all"
                >
                  {t('nav.support', locale)}
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
