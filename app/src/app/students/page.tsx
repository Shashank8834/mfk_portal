'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { students } from '@/data/students';
import { schools } from '@/data/schools';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { publicName } from '@/lib/utils';

type SortBy = 'name' | 'grade' | 'school';

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [schoolFilter, setSchoolFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortBy>('name');

  const filtered = useMemo(() => {
    let result = [...students];

    if (schoolFilter !== 'all') {
      result = result.filter((s) => s.schoolId === schoolFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      // Search public surfaces only — assumed name, PNR, school. Real name is
      // never matched here so a casual visitor can't find a child by it.
      result = result.filter(
        (s) =>
          publicName(s).toLowerCase().includes(q) ||
          s.pnr.toLowerCase().includes(q) ||
          s.schoolName.toLowerCase().includes(q),
      );
    }

    const cmpName = (a: typeof result[number], b: typeof result[number]) =>
      publicName(a).localeCompare(publicName(b));
    switch (sortBy) {
      case 'name':
        result.sort(cmpName);
        break;
      case 'grade':
        result.sort((a, b) => a.grade - b.grade || cmpName(a, b));
        break;
      case 'school':
        result.sort((a, b) => a.schoolName.localeCompare(b.schoolName));
        break;
    }

    return result;
  }, [searchQuery, schoolFilter, sortBy]);

  return (
    <div className="pt-20 min-h-screen pb-20 md:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-text-primary">All Students</h1>
          <p className="text-text-muted mt-2 text-lg">
            Meet the {students.length} students across {schools.length} schools
          </p>
        </motion.div>

        {/* Search + Sort */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or school..."
                aria-label="Search students"
                className="w-full pl-12 pr-4 py-3 rounded-xl glass focus:border-primary/40 text-text-primary placeholder-text-muted text-sm outline-none transition-colors"
              />
            </div>
            <div className="flex gap-2">
              {([
                { value: 'name' as SortBy, label: 'A–Z' },
                { value: 'grade' as SortBy, label: 'Grade' },
                { value: 'school' as SortBy, label: 'School' },
              ]).map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSortBy(s.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    sortBy === s.value ? 'bg-primary text-white' : 'glass text-text-muted hover:text-text-primary'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* School filter chips */}
          <div className="flex gap-2 overflow-x-auto horizontal-scroll pb-1">
            <button
              onClick={() => setSchoolFilter('all')}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                schoolFilter === 'all' ? 'bg-primary/20 text-primary border border-primary/30' : 'glass text-text-muted hover:text-text-primary'
              }`}
            >
              All Schools
            </button>
            {schools.map((school) => (
              <button
                key={school.id}
                onClick={() => setSchoolFilter(school.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  schoolFilter === school.id ? 'bg-primary/20 text-primary border border-primary/30' : 'glass text-text-muted hover:text-text-primary'
                }`}
              >
                {school.name.split(' ').slice(0, 2).join(' ')}
              </button>
            ))}
          </div>
        </motion.div>

        <p className="text-text-muted text-sm mb-6">{filtered.length} student{filtered.length !== 1 ? 's' : ''}</p>

        {/* Student Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((student, idx) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.02, 0.4) }}
            >
              <Link href={`/students/${student.pnr}`}>
                <GlassCard className="p-4 flex items-center gap-4 group h-full">
                  <div className="w-11 h-11 rounded-xl bg-bg-elevated border border-border flex items-center justify-center shrink-0 text-primary font-display font-bold text-sm group-hover:border-primary/40 transition-colors">
                    {student.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-semibold text-sm text-text-primary truncate group-hover:text-primary transition-colors">
                      {publicName(student)}
                    </h3>
                    <p className="text-text-muted text-xs truncate">{student.schoolName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="primary" size="sm">Grade {student.grade}</Badge>
                      <span className="text-[10px] text-text-muted">{student.videos.length} videos</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <FavoriteButton id={student.id} type="student" size="sm" />
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-bg-card border border-border flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6B6590" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <p className="text-text-muted text-lg">No students found.</p>
            <p className="text-text-muted text-sm mt-1">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
