'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ScanLine, CheckCircle2, AlertCircle, RotateCcw, X } from 'lucide-react';
import QRScanner from '@/components/mentor/QRScanner';
import { studentByQR, MENTOR_STUDENTS } from '@/data/mentorStudents';
import { useMentorWorkStore } from '@/stores/mentorWorkStore';

export default function AttendanceFlow() {
  const attendance = useMentorWorkStore((s) => s.attendance);
  const scan = useMentorWorkStore((s) => s.scanAttendance);
  const reset = useMentorWorkStore((s) => s.resetAttendance);
  const [scanning, setScanning] = useState(true);
  const [toast, setToast] = useState<{ kind: 'ok' | 'dup' | 'err'; msg: string } | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const todays = attendance.filter((a) => a.scannedAt.slice(0, 10) === today);
  const present = new Set(todays.map((a) => a.studentId));

  function beep(freq: number) {
    try {
      if (!audioCtxRef.current) {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new Ctx();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {/* noop */}
  }

  function handleScan(qr: string) {
    const s = studentByQR(qr);
    if (!s) {
      beep(220);
      setToast({ kind: 'err', msg: `Unknown QR: ${qr}` });
      return;
    }
    const ok = scan({ studentId: s.id, studentName: s.name, scannedAt: new Date().toISOString() });
    if (ok) {
      beep(880);
      setToast({ kind: 'ok', msg: `${s.name} marked present` });
    } else {
      beep(440);
      setToast({ kind: 'dup', msg: `${s.name} already scanned` });
    }
  }

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1400);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <Link href="/mentor/today" className="p-2 -ml-2 rounded-lg hover:bg-[#F0EEF7]">
          <ArrowLeft size={18} className="text-[#1A1635]" />
        </Link>
        <div className="flex-1">
          <h1 className="font-bold text-[#1A1635]">Attendance</h1>
          <p className="text-xs text-[#6B6590]">{todays.length} of {MENTOR_STUDENTS.length} scanned today</p>
        </div>
        {todays.length > 0 && (
          <button
            onClick={() => { if (confirm('Reset today\'s attendance?')) reset(); }}
            className="p-2 rounded-lg hover:bg-[#F0EEF7] text-[#6B6590]"
            title="Reset today"
          >
            <RotateCcw size={16} />
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-[#F0EEF7] overflow-hidden mb-5">
        <div
          className="h-full bg-emerald-500 transition-all"
          style={{ width: `${(todays.length / MENTOR_STUDENTS.length) * 100}%` }}
        />
      </div>

      {scanning && (
        <QRScanner
          continuous
          onScan={handleScan}
          onClose={() => setScanning(false)}
          hint="Children walk past holding their name cards. Scanner auto-detects each QR."
        />
      )}

      {!scanning && (
        <button
          onClick={() => setScanning(true)}
          className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#5B4DB1] text-white font-semibold hover:bg-[#4a3f96] transition-colors"
        >
          <ScanLine size={16} /> Resume scanning
        </button>
      )}

      {/* Roster */}
      <div className="bg-white border border-[rgba(91,77,177,0.12)] rounded-2xl shadow-sm overflow-hidden">
        {MENTOR_STUDENTS.map((s) => {
          const isPresent = present.has(s.id);
          return (
            <div
              key={s.id}
              className={`flex items-center gap-3 px-4 py-3 border-b last:border-0 border-[rgba(91,77,177,0.08)] ${
                isPresent ? 'bg-emerald-50/50' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                isPresent ? 'bg-emerald-500 text-white' : 'bg-[#F0EEF7] text-[#6B6590]'
              }`}>
                {isPresent ? <CheckCircle2 size={14} /> : s.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1A1635]">{s.name}</p>
                <p className="text-[10px] text-[#6B6590]">{s.rollNo} · Grade {s.grade}</p>
              </div>
              <span className={`text-xs font-medium ${isPresent ? 'text-emerald-600' : 'text-[#6B6590]'}`}>
                {isPresent ? 'Present' : '—'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[60] px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium ${
          toast.kind === 'ok'  ? 'bg-emerald-500 text-white' :
          toast.kind === 'dup' ? 'bg-amber-500 text-white'   :
                                 'bg-red-500 text-white'
        }`}>
          {toast.kind === 'ok'  && <CheckCircle2 size={16} />}
          {toast.kind === 'dup' && <AlertCircle size={16} />}
          {toast.kind === 'err' && <X size={16} />}
          {toast.msg}
        </div>
      )}
    </>
  );
}
