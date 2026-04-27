'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, ChevronDown, Users, School, CheckCircle, AlertCircle } from 'lucide-react';
import { MENTORS, SCHOOLS, schoolById, mentorById } from '@/data/mentors';
import { ATTENDANCE_RECORDS, recordsFor, latestStatus, type AttendanceStatus } from '@/data/attendance';

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS = {
  ontime: { label: 'On Time',   bg: 'bg-emerald-500', ring: 'ring-emerald-200', text: 'text-white' },
  late:   { label: 'Late',      bg: 'bg-amber-500',   ring: 'ring-amber-200',   text: 'text-white' },
  absent: { label: 'Absent',    bg: 'bg-red-500',     ring: 'ring-red-200',     text: 'text-white' },
} as const;

const CANNED = [
  'You were marked absent today. Please confirm.',
  'You arrived late today. Reminder: sessions start at 9:00 AM.',
  'Great work this week! Keep it up.',
  'Please update your attendance log.',
  'Your substitute request has been approved.',
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ─── Types ────────────────────────────────────────────────────────────────────

type Row = { mentorId: string; schoolId: string; status: AttendanceStatus | null };
type Sheet = { mentorId: string; schoolId: string } | null;
type WADialog = { mentorId: string; phone: string } | null;

// ─── Summary stat card ────────────────────────────────────────────────────────

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[rgba(91,77,177,0.12)] shadow-sm">
      <p className="text-xs text-[#6B6590] font-medium uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

// ─── WhatsApp dialog ──────────────────────────────────────────────────────────

function WADialogComp({ dialog, onClose }: { dialog: WADialog; onClose: () => void }) {
  const [msg, setMsg] = useState('');
  const [canned, setCanned] = useState('');
  const mentor = dialog ? mentorById(dialog.mentorId) : null;

  function handleCanned(val: string) {
    setCanned(val);
    setMsg(val);
  }

  const waUrl = `https://wa.me/91${dialog?.phone}?text=${encodeURIComponent(msg)}`;

  return (
    <AnimatePresence>
      {dialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-[#1A1635]">Send WhatsApp</h3>
                <p className="text-sm text-[#6B6590]">{mentor?.name} · +91 {dialog?.phone}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#F0EEF7]">
                <X size={18} className="text-[#6B6590]" />
              </button>
            </div>

            {/* Canned messages */}
            <div className="mb-4">
              <label className="text-xs text-[#6B6590] font-medium mb-1.5 block">Quick messages</label>
              <div className="relative">
                <select
                  value={canned}
                  onChange={(e) => handleCanned(e.target.value)}
                  className="w-full appearance-none bg-[#F8F7FC] border border-[rgba(91,77,177,0.15)] rounded-xl px-4 py-2.5 text-sm text-[#1A1635] pr-8 outline-none focus:border-[#5B4DB1] transition-colors"
                >
                  <option value="">Pick a canned message…</option>
                  {CANNED.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6590] pointer-events-none" />
              </div>
            </div>

            {/* Custom message */}
            <div className="mb-5">
              <label className="text-xs text-[#6B6590] font-medium mb-1.5 block">Message</label>
              <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                rows={3}
                placeholder="Or type a custom message…"
                className="w-full bg-[#F8F7FC] border border-[rgba(91,77,177,0.15)] rounded-xl px-4 py-2.5 text-sm text-[#1A1635] outline-none focus:border-[#5B4DB1] resize-none transition-colors"
              />
            </div>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium text-sm transition-all ${
                msg
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-gray-100 text-gray-400 pointer-events-none'
              }`}
            >
              <MessageCircle size={16} />
              Open WhatsApp
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Attendance bottom sheet ──────────────────────────────────────────────────

function AttendanceSheet({
  sheet,
  onClose,
  onWhatsApp,
}: {
  sheet: Sheet;
  onClose: () => void;
  onWhatsApp: (mentorId: string, phone: string) => void;
}) {
  const mentor = sheet ? mentorById(sheet.mentorId) : null;
  const school = sheet ? schoolById(sheet.schoolId) : null;
  const records = sheet ? recordsFor(sheet.mentorId, sheet.schoolId) : [];

  return (
    <AnimatePresence>
      {sheet && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[rgba(91,77,177,0.2)]" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(91,77,177,0.1)]">
              <div>
                <h3 className="font-semibold text-[#1A1635]">{mentor?.name}</h3>
                <p className="text-sm text-[#6B6590]">
                  {school?.name} · <span className="font-mono">{school?.code}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => mentor && onWhatsApp(mentor.id, mentor.phone)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-medium hover:bg-emerald-100 transition-colors"
                >
                  <MessageCircle size={14} />
                  WhatsApp
                </button>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F0EEF7]">
                  <X size={18} className="text-[#6B6590]" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-y-auto flex-1 px-6 py-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-[#6B6590] font-medium">
                    <th className="text-left pb-3 w-12">Day</th>
                    <th className="text-left pb-3">Date</th>
                    <th className="text-left pb-3">Time In</th>
                    <th className="text-left pb-3">Time Out</th>
                    <th className="text-left pb-3">Status</th>
                    <th className="text-left pb-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(91,77,177,0.06)]">
                  {records.map((rec) => {
                    const d = new Date(rec.date);
                    const cfg = STATUS[rec.status];
                    return (
                      <tr key={rec.date} className="group">
                        <td className="py-3 text-[#6B6590] font-medium">{DAY_NAMES[d.getDay()]}</td>
                        <td className="py-3 text-[#1A1635]">
                          {d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </td>
                        <td className="py-3 font-mono text-[#1A1635]">{rec.timeIn ?? '—'}</td>
                        <td className="py-3 font-mono text-[#1A1635]">{rec.timeOut ?? '—'}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => mentor && onWhatsApp(mentor.id, mentor.phone)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-emerald-50 text-emerald-600"
                          >
                            <MessageCircle size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {records.length === 0 && (
                <p className="text-center text-[#6B6590] text-sm py-8">No records yet.</p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [filterSchool, setFilterSchool] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sheet, setSheet] = useState<Sheet>(null);
  const [waDialog, setWADialog] = useState<WADialog>(null);

  // Build rows: one per mentor-school assignment
  const allRows: Row[] = useMemo(() => {
    const rows: Row[] = [];
    for (const mentor of MENTORS) {
      for (const schoolId of mentor.schoolIds) {
        rows.push({ mentorId: mentor.id, schoolId, status: latestStatus(mentor.id, schoolId) });
      }
    }
    return rows;
  }, []);

  const rows = useMemo(() => {
    return allRows.filter((r) => {
      if (filterSchool !== 'ALL' && r.schoolId !== filterSchool) return false;
      if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
      return true;
    });
  }, [allRows, filterSchool, filterStatus]);

  // Stats
  const present  = allRows.filter((r) => r.status === 'ontime').length;
  const late     = allRows.filter((r) => r.status === 'late').length;
  const absent   = allRows.filter((r) => r.status === 'absent').length;

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1635] font-display">Attendance Dashboard</h1>
        <p className="text-[#6B6590] text-sm mt-1">Last updated: Fri, Apr 17 · April 2026</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat label="Total Mentors"  value={MENTORS.length}    color="text-[#5B4DB1]" />
        <Stat label="On Time"        value={present}           color="text-emerald-600" />
        <Stat label="Late"           value={late}              color="text-amber-600" />
        <Stat label="Absent"         value={absent}            color="text-red-600" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative">
          <select
            value={filterSchool}
            onChange={(e) => setFilterSchool(e.target.value)}
            className="appearance-none bg-white border border-[rgba(91,77,177,0.15)] rounded-xl px-4 py-2 pr-8 text-sm text-[#1A1635] outline-none focus:border-[#5B4DB1] transition-colors shadow-sm"
          >
            <option value="ALL">All Schools</option>
            {SCHOOLS.map((s) => (
              <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6590] pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none bg-white border border-[rgba(91,77,177,0.15)] rounded-xl px-4 py-2 pr-8 text-sm text-[#1A1635] outline-none focus:border-[#5B4DB1] transition-colors shadow-sm"
          >
            <option value="ALL">All Statuses</option>
            <option value="ontime">On Time</option>
            <option value="late">Late</option>
            <option value="absent">Absent</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6590] pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[rgba(91,77,177,0.12)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(91,77,177,0.08)] bg-[#F8F7FC]">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#6B6590] uppercase tracking-wide">
                  <span className="flex items-center gap-1.5"><Users size={12} /> Mentor</span>
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#6B6590] uppercase tracking-wide">
                  <span className="flex items-center gap-1.5"><School size={12} /> School</span>
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#6B6590] uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(91,77,177,0.06)]">
              {rows.map((row) => {
                const mentor = mentorById(row.mentorId);
                const school = schoolById(row.schoolId);
                const cfg = row.status ? STATUS[row.status] : null;

                return (
                  <tr key={`${row.mentorId}-${row.schoolId}`} className="hover:bg-[#F8F7FC] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#F0EEF7] flex items-center justify-center text-xs font-bold text-[#5B4DB1]">
                          {mentor?.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-[#1A1635]">{mentor?.name}</p>
                          <p className="text-xs text-[#6B6590] font-mono">+91 {mentor?.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[#1A1635]">{school?.name}</p>
                      <p className="text-xs font-mono text-[#6B6590]">{school?.code}</p>
                    </td>
                    <td className="px-6 py-4">
                      {cfg ? (
                        <button
                          onClick={() => setSheet({ mentorId: row.mentorId, schoolId: row.schoolId })}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold ring-2 transition-all hover:opacity-90 active:scale-95 ${cfg.bg} ${cfg.text} ${cfg.ring}`}
                        >
                          {row.status === 'ontime' && <CheckCircle size={12} />}
                          {row.status === 'absent'  && <AlertCircle size={12} />}
                          {cfg.label}
                        </button>
                      ) : (
                        <span className="text-xs text-[#6B6590]">No data</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {rows.length === 0 && (
            <div className="text-center py-12 text-[#6B6590] text-sm">No records match your filters.</div>
          )}
        </div>
      </div>

      {/* Attendance sheet */}
      <AttendanceSheet
        sheet={sheet}
        onClose={() => setSheet(null)}
        onWhatsApp={(mentorId, phone) => {
          setSheet(null);
          setWADialog({ mentorId, phone });
        }}
      />

      {/* WhatsApp dialog */}
      <WADialogComp dialog={waDialog} onClose={() => setWADialog(null)} />
    </div>
  );
}
