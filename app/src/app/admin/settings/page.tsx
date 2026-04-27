'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, CalendarOff, Users } from 'lucide-react';
import { SCHOOLS, MENTORS, schoolById, mentorById } from '@/data/mentors';
import { HOLIDAYS, type Holiday } from '@/data/attendance';

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'holidays',    label: 'School Holidays',     icon: CalendarOff },
  { id: 'assignments', label: 'Mentor Assignments',  icon: Users },
] as const;
type Tab = typeof TABS[number]['id'];

// ─── Holidays tab ─────────────────────────────────────────────────────────────

function HolidaysTab() {
  const [holidays, setHolidays] = useState<Holiday[]>(HOLIDAYS);
  const [selectedSchool, setSelectedSchool] = useState<string>('ALL');
  const [newDate, setNewDate] = useState('');
  const [newName, setNewName] = useState('');

  function addHoliday() {
    if (!newDate || !newName) return;
    setHolidays((prev) => [...prev, { schoolId: selectedSchool, date: newDate, name: newName }]);
    setNewDate('');
    setNewName('');
  }

  function remove(idx: number) {
    setHolidays((prev) => prev.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div className="bg-white rounded-2xl border border-[rgba(91,77,177,0.12)] p-6 shadow-sm">
        <h3 className="font-semibold text-[#1A1635] mb-4">Add Holiday</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            className="bg-[#F8F7FC] border border-[rgba(91,77,177,0.15)] rounded-xl px-4 py-2.5 text-sm text-[#1A1635] outline-none focus:border-[#5B4DB1] transition-colors"
          >
            <option value="ALL">All Schools</option>
            {SCHOOLS.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <input
            type="date"
            value={newDate}
            min="2026-04-01"
            onChange={(e) => setNewDate(e.target.value)}
            className="bg-[#F8F7FC] border border-[rgba(91,77,177,0.15)] rounded-xl px-4 py-2.5 text-sm text-[#1A1635] outline-none focus:border-[#5B4DB1] transition-colors"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Holiday name"
              className="flex-1 bg-[#F8F7FC] border border-[rgba(91,77,177,0.15)] rounded-xl px-4 py-2.5 text-sm text-[#1A1635] outline-none focus:border-[#5B4DB1] transition-colors"
            />
            <button
              onClick={addHoliday}
              disabled={!newDate || !newName}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5B4DB1] text-white text-sm font-medium disabled:opacity-40 hover:bg-[#4a3ea0] transition-colors"
            >
              <Plus size={15} /> Add
            </button>
          </div>
        </div>
      </div>

      {/* Holiday list */}
      <div className="bg-white rounded-2xl border border-[rgba(91,77,177,0.12)] shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(91,77,177,0.08)] bg-[#F8F7FC]">
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#6B6590] uppercase tracking-wide">Date</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#6B6590] uppercase tracking-wide">Holiday</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#6B6590] uppercase tracking-wide">School</th>
              <th className="px-6 py-3.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(91,77,177,0.06)]">
            {holidays.map((h, idx) => {
              const school = h.schoolId === 'ALL' ? null : schoolById(h.schoolId);
              const d = new Date(h.date);
              return (
                <tr key={idx} className="hover:bg-[#F8F7FC] transition-colors">
                  <td className="px-6 py-4 font-mono text-[#1A1635]">
                    {d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-[#1A1635] font-medium">{h.name}</td>
                  <td className="px-6 py-4">
                    {school ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-[#F0EEF7] text-[#5B4DB1] font-medium">
                        {school.name}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-amber-50 text-amber-700 font-medium">
                        All Schools
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => remove(idx)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                    >
                      <X size={15} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {holidays.length === 0 && (
          <p className="text-center text-[#6B6590] text-sm py-10">No holidays configured.</p>
        )}
      </div>
    </div>
  );
}

// ─── Assignments tab ──────────────────────────────────────────────────────────

type Assignment = { mentorId: string; schoolId: string; days: number[] };

const DAY_LABELS: Record<number, string> = { 1: 'M', 2: 'T', 3: 'W', 4: 'Th', 5: 'F', 6: 'S' };

function AssignmentsTab() {
  const [assignments, setAssignments] = useState<Assignment[]>(() =>
    MENTORS.flatMap((m) => m.schoolIds.map((s) => ({ mentorId: m.id, schoolId: s, days: m.mandatoryDays })))
  );
  const [addMentor, setAddMentor] = useState('');
  const [addSchool, setAddSchool] = useState('');
  const [addDays, setAddDays] = useState<number[]>([1, 3, 5]);

  function toggleDay(d: number) {
    setAddDays((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort());
  }

  function add() {
    if (!addMentor || !addSchool || addDays.length === 0) return;
    const exists = assignments.some((a) => a.mentorId === addMentor && a.schoolId === addSchool);
    if (exists) return;
    setAssignments((prev) => [...prev, { mentorId: addMentor, schoolId: addSchool, days: addDays }]);
    setAddMentor('');
    setAddSchool('');
    setAddDays([1, 3, 5]);
  }

  function remove(mentorId: string, schoolId: string) {
    setAssignments((prev) => prev.filter((a) => !(a.mentorId === mentorId && a.schoolId === schoolId)));
  }

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div className="bg-white rounded-2xl border border-[rgba(91,77,177,0.12)] p-6 shadow-sm">
        <h3 className="font-semibold text-[#1A1635] mb-4">Assign Mentor to School</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <select
            value={addMentor}
            onChange={(e) => setAddMentor(e.target.value)}
            className="bg-[#F8F7FC] border border-[rgba(91,77,177,0.15)] rounded-xl px-4 py-2.5 text-sm text-[#1A1635] outline-none focus:border-[#5B4DB1] transition-colors"
          >
            <option value="">Select mentor…</option>
            {MENTORS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <select
            value={addSchool}
            onChange={(e) => setAddSchool(e.target.value)}
            className="bg-[#F8F7FC] border border-[rgba(91,77,177,0.15)] rounded-xl px-4 py-2.5 text-sm text-[#1A1635] outline-none focus:border-[#5B4DB1] transition-colors"
          >
            <option value="">Select school…</option>
            {SCHOOLS.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
          </select>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-[#6B6590] font-medium">Mandatory days:</span>
          {[1, 2, 3, 4, 5, 6].map((d) => (
            <button
              key={d}
              onClick={() => toggleDay(d)}
              className={`w-9 h-9 rounded-lg text-xs font-semibold transition-all ${
                addDays.includes(d)
                  ? 'bg-[#5B4DB1] text-white shadow-sm'
                  : 'bg-[#F0EEF7] text-[#6B6590] hover:bg-[#E8E4F5]'
              }`}
            >
              {DAY_LABELS[d]}
            </button>
          ))}
          <button
            onClick={add}
            disabled={!addMentor || !addSchool || addDays.length === 0}
            className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5B4DB1] text-white text-sm font-medium disabled:opacity-40 hover:bg-[#4a3ea0] transition-colors"
          >
            <Plus size={15} /> Assign
          </button>
        </div>
      </div>

      {/* Assignments list */}
      <div className="bg-white rounded-2xl border border-[rgba(91,77,177,0.12)] shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(91,77,177,0.08)] bg-[#F8F7FC]">
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#6B6590] uppercase tracking-wide">Mentor</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#6B6590] uppercase tracking-wide">School</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#6B6590] uppercase tracking-wide">Days</th>
              <th className="px-6 py-3.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(91,77,177,0.06)]">
            {assignments.map((a) => {
              const mentor = mentorById(a.mentorId);
              const school = schoolById(a.schoolId);
              return (
                <tr key={`${a.mentorId}-${a.schoolId}`} className="hover:bg-[#F8F7FC] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#F0EEF7] flex items-center justify-center text-xs font-bold text-[#5B4DB1]">
                        {mentor?.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <span className="font-medium text-[#1A1635]">{mentor?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[#1A1635]">{school?.name}</p>
                    <p className="text-xs font-mono text-[#6B6590]">{school?.code}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5, 6].map((d) => (
                        <span
                          key={d}
                          className={`w-6 h-6 rounded text-xs flex items-center justify-center font-medium ${
                            a.days.includes(d)
                              ? 'bg-[#5B4DB1] text-white'
                              : 'bg-[#F0EEF7] text-[#6B6590]'
                          }`}
                        >
                          {DAY_LABELS[d]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => remove(a.mentorId, a.schoolId)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                    >
                      <X size={15} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminSettings() {
  const [tab, setTab] = useState<Tab>('holidays');

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1635] font-display">Settings</h1>
        <p className="text-[#6B6590] text-sm mt-1">Manage school holidays and mentor assignments</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-white border border-[rgba(91,77,177,0.12)] rounded-2xl p-1.5 w-fit mb-8 shadow-sm">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === id
                ? 'bg-[#5B4DB1] text-white shadow-md'
                : 'text-[#6B6590] hover:text-[#1A1635] hover:bg-[#F0EEF7]'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        {tab === 'holidays'    && <HolidaysTab />}
        {tab === 'assignments' && <AssignmentsTab />}
      </motion.div>
    </div>
  );
}
