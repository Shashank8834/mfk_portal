'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ArrowLeftRight, UserPlus } from 'lucide-react';
import { MENTORS, SCHOOLS } from '@/data/mentors';
import { HOLIDAYS, isHoliday, recordsFor } from '@/data/attendance';

// ─── Config ───────────────────────────────────────────────────────────────────

// Design preview: logged-in mentor = M001, primary school = SCH001
const MENTOR  = MENTORS.find((m) => m.id === 'M001')!;
const SCHOOL  = SCHOOLS.find((s) => s.id === 'SCH001')!;
const TODAY   = new Date('2026-04-19');

const DAY_HEADERS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function startOfMonth(year: number, month: number) {
  return new Date(year, month, 1);
}

/** Returns all ISO-date strings for days in a given month, padded to full weeks (Mon-Sun grid). */
function monthGrid(year: number, month: number): (string | null)[] {
  const first  = startOfMonth(year, month);
  const last   = new Date(year, month + 1, 0);
  // ISO week starts Monday; JS getDay() starts Sunday
  const startPad = (first.getDay() + 6) % 7; // 0=Mon
  const cells: (string | null)[] = Array(startPad).fill(null);
  for (let d = 1; d <= last.getDate(); d++) {
    cells.push(isoDate(new Date(year, month, d)));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function isMandatory(date: string) {
  const day = new Date(date).getDay();
  // JS: 0=Sun 1=Mon … 6=Sat → MENTOR.mandatoryDays uses ISO: 1=Mon…6=Sat
  const iso = day === 0 ? 7 : day;
  return MENTOR.mandatoryDays.includes(iso);
}

function isPast(date: string) {
  return date < isoDate(TODAY);
}

function isToday(date: string) {
  return date === isoDate(TODAY);
}

function isFuture(date: string) {
  return date > isoDate(TODAY);
}

// ─── Past attendance lookup ────────────────────────────────────────────────────

const pastRecords = recordsFor(MENTOR.id, SCHOOL.id);
const recordByDate = Object.fromEntries(pastRecords.map((r) => [r.date, r]));

const STATUS_DOT: Record<string, string> = {
  ontime: 'bg-emerald-500',
  late:   'bg-amber-500',
  absent: 'bg-red-500',
};

// ─── Future planned visits (local state seed) ─────────────────────────────────

function defaultPlanned(): Set<string> {
  const s = new Set<string>();
  // Seed a few future mandatory days as already planned
  const future = ['2026-04-21', '2026-04-22', '2026-04-24', '2026-04-27', '2026-04-29', '2026-05-04', '2026-05-06', '2026-05-08'];
  future.filter((d) => isMandatory(d) && !isHoliday(d, SCHOOL.id)).forEach((d) => s.add(d));
  return s;
}

// ─── Action sheet ─────────────────────────────────────────────────────────────

type Action = { date: string } | null;

function ActionSheet({
  action,
  planned,
  onClose,
  onMove,
  onSubstitute,
  onRemove,
}: {
  action: Action;
  planned: Set<string>;
  onClose: () => void;
  onMove: (from: string, to: string) => void;
  onSubstitute: (date: string) => void;
  onRemove: (date: string) => void;
}) {
  const [moveMode, setMoveMode] = useState(false);

  if (!action) return null;

  const d = new Date(action.date);
  // Same week: Mon-Sun containing action.date
  const dayOfWeek = (d.getDay() + 6) % 7; // 0=Mon
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const wd = new Date(d);
    wd.setDate(d.getDate() - dayOfWeek + i);
    return isoDate(wd);
  }).filter((wd) => isFuture(wd) && wd !== action.date && !isHoliday(wd, SCHOOL.id) && !planned.has(wd));

  return (
    <AnimatePresence>
      {action && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl px-6 pt-4 pb-8"
          >
            <div className="flex justify-center mb-3">
              <div className="w-10 h-1 rounded-full bg-[rgba(91,77,177,0.2)]" />
            </div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-semibold text-[#1A1635]">
                  {d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <p className="text-sm text-[#6B6590]">{SCHOOL.name}</p>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F0EEF7]">
                <X size={18} className="text-[#6B6590]" />
              </button>
            </div>

            {!moveMode ? (
              <div className="space-y-3">
                <button
                  onClick={() => setMoveMode(true)}
                  className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl border border-[rgba(91,77,177,0.15)] hover:bg-[#F0EEF7] transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#F0EEF7] flex items-center justify-center">
                    <ArrowLeftRight size={16} className="text-[#5B4DB1]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1635]">Move to another day</p>
                    <p className="text-xs text-[#6B6590]">Within the same week</p>
                  </div>
                </button>

                <button
                  onClick={() => { onSubstitute(action.date); onClose(); }}
                  className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl border border-[rgba(91,77,177,0.15)] hover:bg-[#F0EEF7] transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#F0EEF7] flex items-center justify-center">
                    <UserPlus size={16} className="text-[#5B4DB1]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1635]">Request substitute</p>
                    <p className="text-xs text-[#6B6590]">Must be ≥ 6 hours before visit</p>
                  </div>
                </button>

                <button
                  onClick={() => { onRemove(action.date); onClose(); }}
                  className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl border border-red-100 hover:bg-red-50 transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                    <X size={16} className="text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-600">Remove this visit</p>
                    <p className="text-xs text-red-400">This day will be marked unscheduled</p>
                  </div>
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-[#6B6590] mb-3">Select a day this week to move to:</p>
                {weekDates.length === 0 ? (
                  <p className="text-sm text-[#6B6590] text-center py-4">No available days this week.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {weekDates.map((wd) => {
                      const wdd = new Date(wd);
                      return (
                        <button
                          key={wd}
                          onClick={() => { onMove(action.date, wd); onClose(); }}
                          className="flex flex-col items-center px-4 py-3 rounded-xl border border-[rgba(91,77,177,0.15)] hover:bg-[#F0EEF7] hover:border-[#5B4DB1] transition-all"
                        >
                          <span className="text-xs text-[#6B6590]">
                            {wdd.toLocaleDateString('en-IN', { weekday: 'short' })}
                          </span>
                          <span className="text-lg font-bold text-[#1A1635]">{wdd.getDate()}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
                <button
                  onClick={() => setMoveMode(false)}
                  className="mt-4 text-sm text-[#6B6590] hover:text-[#1A1635] transition-colors"
                >
                  ← Back
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Month calendar ────────────────────────────────────────────────────────────

function MonthCalendar({
  year, month, planned, onDayClick,
}: {
  year: number;
  month: number;
  planned: Set<string>;
  onDayClick: (date: string) => void;
}) {
  const grid = monthGrid(year, month);
  const label = new Date(year, month, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white rounded-2xl border border-[rgba(91,77,177,0.12)] shadow-sm p-5">
      <h2 className="font-semibold text-[#1A1635] mb-4">{label}</h2>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-[#6B6590] py-1">{d}</div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {grid.map((date, idx) => {
          if (!date) return <div key={idx} />;

          const holiday  = isHoliday(date, SCHOOL.id);
          const mandatory = isMandatory(date);
          const past     = isPast(date);
          const today    = isToday(date);
          const future   = isFuture(date);
          const rec      = recordByDate[date];
          const isPlanned = planned.has(date);
          const weekend  = [0, 6].includes(new Date(date).getDay());

          let cellClass = 'relative flex flex-col items-center justify-center h-10 w-full rounded-xl text-sm transition-all select-none ';
          let numberClass = 'font-medium ';
          let dot: string | null = null;
          let ring = false;

          if (holiday) {
            cellClass += 'opacity-40 cursor-default ';
            numberClass += 'line-through text-[#6B6590] ';
          } else if (today) {
            cellClass += 'bg-[#5B4DB1] cursor-default ';
            numberClass += 'text-white font-bold ';
            if (rec) dot = STATUS_DOT[rec.status];
          } else if (past && mandatory) {
            if (rec) {
              dot = STATUS_DOT[rec.status];
              cellClass += 'cursor-default ';
              numberClass += 'text-[#1A1635] ';
            } else {
              numberClass += 'text-[#6B6590] ';
              cellClass += 'cursor-default ';
            }
          } else if (future && mandatory) {
            if (isPlanned) {
              ring = true;
              cellClass += 'cursor-pointer hover:bg-[#F0EEF7] ';
              numberClass += 'text-[#5B4DB1] font-semibold ';
            } else {
              cellClass += 'cursor-pointer hover:bg-[#F0EEF7] ';
              numberClass += 'text-[#5B4DB1] ';
            }
          } else if (future && !weekend) {
            cellClass += 'cursor-pointer hover:bg-[#F8F7FC] ';
            numberClass += 'text-[#6B6590] ';
          } else {
            cellClass += 'cursor-default ';
            numberClass += weekend ? 'text-[rgba(107,101,144,0.4)] ' : 'text-[#6B6590] ';
          }

          return (
            <button
              key={date}
              disabled={!!holiday || past || (weekend && !isPlanned)}
              onClick={() => {
                if (future && (mandatory || isPlanned)) onDayClick(date);
              }}
              className={cellClass}
            >
              {/* Planned ring */}
              {ring && (
                <span className="absolute inset-0.5 rounded-xl border-2 border-[#5B4DB1] border-dashed pointer-events-none" />
              )}

              <span className={numberClass}>{new Date(date).getDate()}</span>

              {/* Status dot */}
              {dot && (
                <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${dot}`} />
              )}

              {/* Holiday dot */}
              {holiday && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-gray-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 pt-4 border-t border-[rgba(91,77,177,0.08)]">
        {[
          { dot: 'bg-emerald-500', label: 'On time' },
          { dot: 'bg-amber-500',   label: 'Late' },
          { dot: 'bg-red-500',     label: 'Absent' },
        ].map(({ dot, label }) => (
          <span key={label} className="flex items-center gap-1.5 text-xs text-[#6B6590]">
            <span className={`w-2 h-2 rounded-full ${dot}`} />
            {label}
          </span>
        ))}
        <span className="flex items-center gap-1.5 text-xs text-[#6B6590]">
          <span className="w-4 h-4 rounded border-2 border-dashed border-[#5B4DB1] inline-block" />
          Scheduled
        </span>
        <span className="flex items-center gap-1.5 text-xs text-[#6B6590]">
          <span className="w-4 h-4 rounded bg-[#5B4DB1] inline-block" />
          Today
        </span>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MentorPlanning() {
  const [planned, setPlanned] = useState<Set<string>>(defaultPlanned);
  const [action, setAction] = useState<Action>(null);
  const [substituteDate, setSubstituteDate] = useState<string | null>(null);

  function handleDayClick(date: string) {
    if (planned.has(date)) {
      setAction({ date });
    } else {
      setPlanned((prev) => new Set([...prev, date]));
    }
  }

  function handleMove(from: string, to: string) {
    setPlanned((prev) => {
      const next = new Set(prev);
      next.delete(from);
      next.add(to);
      return next;
    });
    setAction(null);
  }

  function handleRemove(date: string) {
    setPlanned((prev) => {
      const next = new Set(prev);
      next.delete(date);
      return next;
    });
  }

  return (
    <>
      {/* School chip */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-white border border-[rgba(91,77,177,0.15)] rounded-xl px-4 py-2 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-medium text-[#1A1635]">{SCHOOL.name}</span>
          <span className="font-mono text-xs text-[#6B6590]">{SCHOOL.code}</span>
        </div>
        <span className="text-xs text-[#6B6590]">
          Mandatory: {MENTOR.mandatoryDays.map((d) => ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(' / ')}
        </span>
      </div>

      {/* Info banner */}
      <div className="bg-[#F0EEF7] border border-[rgba(91,77,177,0.15)] rounded-xl px-4 py-3 mb-6 text-xs text-[#5B4DB1]">
        Tap any mandatory day to schedule it. Tap a scheduled future visit to move or substitute.
      </div>

      {/* Calendars */}
      <div className="space-y-6">
        <MonthCalendar year={2026} month={3} planned={planned} onDayClick={handleDayClick} />
        <MonthCalendar year={2026} month={4} planned={planned} onDayClick={handleDayClick} />
      </div>

      {/* Action sheet */}
      <ActionSheet
        action={action}
        planned={planned}
        onClose={() => setAction(null)}
        onMove={handleMove}
        onSubstitute={(date) => setSubstituteDate(date)}
        onRemove={handleRemove}
      />

      {/* Substitute dialog (simplified) */}
      <AnimatePresence>
        {substituteDate && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40"
            onClick={() => setSubstituteDate(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#1A1635]">Request Substitute</h3>
                <button onClick={() => setSubstituteDate(null)} className="p-1.5 rounded-lg hover:bg-[#F0EEF7]">
                  <X size={16} className="text-[#6B6590]" />
                </button>
              </div>
              <p className="text-sm text-[#6B6590] mb-4">
                {new Date(substituteDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
              <div className="space-y-2">
                {MENTORS.filter((m) => m.id !== MENTOR.id && m.schoolIds.includes(SCHOOL.id)).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      alert(`Substitute request sent to ${m.name}. Awaiting acceptance.`);
                      setSubstituteDate(null);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-[rgba(91,77,177,0.15)] hover:bg-[#F0EEF7] transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#F0EEF7] flex items-center justify-center text-xs font-bold text-[#5B4DB1]">
                      {m.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1A1635]">{m.name}</p>
                      <p className="text-xs text-[#6B6590]">Also covers this school</p>
                    </div>
                  </button>
                ))}
                {MENTORS.filter((m) => m.id !== MENTOR.id && m.schoolIds.includes(SCHOOL.id)).length === 0 && (
                  <p className="text-sm text-[#6B6590] text-center py-4">No other mentors assigned to this school.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
