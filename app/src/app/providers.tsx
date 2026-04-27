'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Footer } from '@/components/layout/Footer';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { ToastProvider } from '@/components/ui/Toast';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAppRoute = pathname.startsWith('/admin') || pathname.startsWith('/mentor');

  return (
    <ToastProvider>
      {!isAppRoute && <Navbar />}
      {!isAppRoute && <CommandPalette />}
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
      {!isAppRoute && <Footer />}
      {!isAppRoute && <MobileBottomNav />}
    </ToastProvider>
  );
}
