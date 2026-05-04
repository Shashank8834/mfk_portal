'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, ClipboardList, LogOut, Wifi, ScanLine } from 'lucide-react';

const TABS = [
  { href: '/mentor/today',      label: 'Today',      icon: ScanLine },
  { href: '/mentor',            label: 'Planning',   icon: CalendarDays },
  { href: '/mentor/attendance', label: 'My Record',  icon: ClipboardList },
];

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F8F7FC]">
      {/* Top bar */}
      <header className="bg-white border-b border-[rgba(91,77,177,0.12)] sticky top-0 z-40 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#5B4DB1] flex items-center justify-center">
              <span className="text-white font-bold text-xs">M</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1A1635] leading-tight">Priya Sharma</p>
              <p className="text-[10px] text-[#6B6590]">Mentor · JNV Koramangala</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-medium border border-emerald-200"
              title="Connected to school router (JNV_SCHOOL_NET)"
            >
              <Wifi size={11} /> JNV_SCHOOL_NET
            </span>
            <Link
              href="/auth"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-500 hover:bg-red-50 font-medium transition-colors"
            >
              <LogOut size={13} /> Sign out
            </Link>
          </div>
        </div>

        {/* Tab bar */}
        <div className="max-w-3xl mx-auto px-4 flex gap-0">
          {TABS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                  active
                    ? 'border-[#5B4DB1] text-[#5B4DB1]'
                    : 'border-transparent text-[#6B6590] hover:text-[#1A1635]'
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
