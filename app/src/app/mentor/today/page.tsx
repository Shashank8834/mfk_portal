'use client';

import Link from 'next/link';
import { BookOpen, Video, ScanLine, ChevronRight, FileCheck, FileVideo } from 'lucide-react';
import { useMentorWorkStore } from '@/stores/mentorWorkStore';

const TODAY_LABEL = new Date().toLocaleDateString('en-IN', {
  weekday: 'long', day: 'numeric', month: 'long',
});

export default function MentorToday() {
  const journals = useMentorWorkStore((s) => s.journals);
  const videos = useMentorWorkStore((s) => s.videos);
  const attendance = useMentorWorkStore((s) => s.attendance);

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = (arr: { capturedAt?: string; scannedAt?: string }[]) =>
    arr.filter((x) => (x.capturedAt ?? x.scannedAt ?? '').slice(0, 10) === today).length;

  const cards = [
    {
      href: '/mentor/today/journal',
      label: 'Scan a journal',
      hint: 'Scan student QR, then capture pages of their journal',
      icon: BookOpen,
      tint: 'bg-[#F0EEF7] text-[#5B4DB1]',
    },
    {
      href: '/mentor/today/video',
      label: 'Record a video',
      hint: 'Scan student QR, record their story, review, upload',
      icon: Video,
      tint: 'bg-[#FFF4E5] text-[#E8941A]',
    },
    {
      href: '/mentor/today/attendance',
      label: 'Take attendance',
      hint: 'Continuously scan name-card QRs as students walk past',
      icon: ScanLine,
      tint: 'bg-emerald-50 text-emerald-600',
    },
  ];

  return (
    <>
      <div className="mb-6">
        <p className="text-xs font-mono uppercase tracking-wider text-[#6B6590]">In session</p>
        <h1 className="text-xl font-bold text-[#1A1635]">{TODAY_LABEL}</h1>
      </div>

      {/* Today's stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Stat label="Journals" value={todayCount(journals)} icon={FileCheck} />
        <Stat label="Videos" value={todayCount(videos)} icon={FileVideo} />
        <Stat label="Attendance" value={todayCount(attendance)} icon={ScanLine} />
      </div>

      <div className="space-y-3">
        {cards.map(({ href, label, hint, icon: Icon, tint }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 bg-white border border-[rgba(91,77,177,0.12)] rounded-2xl px-4 py-4 shadow-sm hover:shadow-md hover:border-[rgba(91,77,177,0.3)] transition-all"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${tint}`}>
              <Icon size={20} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[#1A1635]">{label}</p>
              <p className="text-xs text-[#6B6590]">{hint}</p>
            </div>
            <ChevronRight size={18} className="text-[#6B6590]" />
          </Link>
        ))}
      </div>
    </>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: number; icon: React.ComponentType<{ size?: number; className?: string }> }) {
  return (
    <div className="bg-white border border-[rgba(91,77,177,0.12)] rounded-xl px-3 py-3 text-center shadow-sm">
      <Icon size={16} className="text-[#5B4DB1] mx-auto mb-1" />
      <p className="text-xl font-bold text-[#1A1635] leading-none">{value}</p>
      <p className="text-[10px] text-[#6B6590] mt-1 uppercase tracking-wider">{label}</p>
    </div>
  );
}
