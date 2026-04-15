'use client';

import { Navbar } from '@/components/layout/Navbar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Footer } from '@/components/layout/Footer';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { ToastProvider } from '@/components/ui/Toast';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <Navbar />
      <CommandPalette />
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </ToastProvider>
  );
}
