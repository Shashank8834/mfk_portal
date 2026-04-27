'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Settings, LogOut, ChevronRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-[rgba(91,77,177,0.12)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#5B4DB1] flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1A1635]">MFK Admin</p>
            <p className="text-xs text-[#6B6590]">Shiva Krishnamurthy</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-[#5B4DB1] text-white shadow-md'
                  : 'text-[#6B6590] hover:bg-[#F0EEF7] hover:text-[#1A1635]'
              }`}
            >
              <Icon size={17} />
              {label}
              {active && <ChevronRight size={14} className="ml-auto opacity-70" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[rgba(91,77,177,0.12)]">
        <Link
          href="/auth"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 w-full transition-all"
        >
          <LogOut size={17} />
          Sign out
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F8F7FC] flex">
      {/* Desktop sidebar */}
      <aside className="w-60 bg-white border-r border-[rgba(91,77,177,0.12)] hidden lg:flex flex-col fixed h-full top-0 left-0 z-40 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-[rgba(91,77,177,0.12)] px-4 py-3 flex items-center gap-3 shadow-sm">
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-[#F0EEF7]">
          <Menu size={20} className="text-[#5B4DB1]" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#5B4DB1] flex items-center justify-center">
            <span className="text-white font-bold text-xs">M</span>
          </div>
          <span className="text-sm font-semibold text-[#1A1635]">MFK Admin</span>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-60 bg-white h-full flex flex-col shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[#F0EEF7]"
            >
              <X size={18} className="text-[#6B6590]" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-60 pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
