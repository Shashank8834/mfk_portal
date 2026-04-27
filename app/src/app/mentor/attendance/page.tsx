'use client';

import { MENTORS, SCHOOLS } from '@/data/mentors';
import { recordsFor } from '@/data/attendance';

const MENTOR = MENTORS.find((m) => m.id === 'M001')!;
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const STATUS_STYLE = {
  ontime: { label: 'On Time', bg: 'bg-emerald-500', text: 'text-white' },
  late:   { label: 'Late',    bg: 'bg-amber-500',   text: 'text-white' },
  absent: { label: 'Absent',  bg: 'bg-red-500',     text: 'text-white' },
};

export default function MentorAttendance() {
  return (
    <div className="space-y-6">
      {MENTOR.schoolIds.map((schoolId) => {
        const school  = SCHOOLS.find((s) => s.id === schoolId)!;
        const records = recordsFor(MENTOR.id, schoolId);
        const total   = records.length;
        const ontime  = records.filter((r) => r.status === 'ontime').length;
        const late    = records.filter((r) => r.status === 'late').length;
        const absent  = records.filter((r) => r.status === 'absent').length;
        const pct     = total > 0 ? Math.round(((ontime + late) / total) * 100) : 0;

        return (
          <div key={schoolId} className="bg-white rounded-2xl border border-[rgba(91,77,177,0.12)] shadow-sm overflow-hidden">
            {/* School header */}
            <div className="px-6 py-4 border-b border-[rgba(91,77,177,0.08)] flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-[#1A1635]">{school.name}</h2>
                <p className="text-xs font-mono text-[#6B6590]">{school.code}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#5B4DB1]">{pct}%</p>
                <p className="text-xs text-[#6B6590]">attendance</p>
              </div>
            </div>

            {/* Mini stats */}
            <div className="grid grid-cols-3 divide-x divide-[rgba(91,77,177,0.08)] border-b border-[rgba(91,77,177,0.08)]">
              {[
                { label: 'On Time', value: ontime, color: 'text-emerald-600' },
                { label: 'Late',    value: late,   color: 'text-amber-600' },
                { label: 'Absent',  value: absent,  color: 'text-red-600' },
              ].map(({ label, value, color }) => (
                <div key={label} className="px-4 py-3 text-center">
                  <p className={`text-xl font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-[#6B6590]">{label}</p>
                </div>
              ))}
            </div>

            {/* Records table */}
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8F7FC]">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B6590] uppercase tracking-wide">Day</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B6590] uppercase tracking-wide">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B6590] uppercase tracking-wide">In</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B6590] uppercase tracking-wide">Out</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B6590] uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(91,77,177,0.06)]">
                {records.map((rec) => {
                  const d   = new Date(rec.date);
                  const cfg = STATUS_STYLE[rec.status];
                  return (
                    <tr key={rec.date} className="hover:bg-[#F8F7FC] transition-colors">
                      <td className="px-6 py-3.5 text-[#6B6590] font-medium">{DAY_NAMES[d.getDay()]}</td>
                      <td className="px-6 py-3.5 text-[#1A1635]">
                        {d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-[#1A1635]">{rec.timeIn ?? '—'}</td>
                      <td className="px-6 py-3.5 font-mono text-[#1A1635]">{rec.timeOut ?? '—'}</td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
                          {cfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
