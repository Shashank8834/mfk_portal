'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { students } from '@/data/students';
import { schools } from '@/data/schools';
import { GlassCard } from '@/components/ui/GlassCard';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { displayName } from '@/lib/utils';

type FilterBy = 'all' | string; // school id or 'all'
type SortBy = 'trending' | 'recent' | 'name';

export default function StoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [schoolFilter, setSchoolFilter] = useState<FilterBy>('all');
  const [sortBy, setSortBy] = useState<SortBy>('trending');

  const filteredStudents = useMemo(() => {
    let result = [...students];

    // Filter by school
    if (schoolFilter !== 'all') {
      result = result.filter(s => s.schoolId === schoolFilter);
    }

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.schoolName.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'trending':
        result.sort((a, b) => b.videos.length - a.videos.length);
        break;
      case 'recent':
        result.sort((a, b) => {
          const aDate = a.videos[0]?.date || '';
          const bDate = b.videos[0]?.date || '';
          return bDate.localeCompare(aDate);
        });
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [searchQuery, schoolFilter, sortBy]);

  return (
    <div className="pt-20 min-h-screen pb-20 md:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display font-bold text-3xl md:text-4xl text-text-primary">
            Student Stories
          </h1>
          <p className="text-text-muted mt-2 text-lg">
            Every student has a story. Watch their journeys unfold.
          </p>
        </motion.div>

        {/* Search, Sort & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-4 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name or school..."
                aria-label="Search student stories"
                className="w-full pl-12 pr-4 py-3 rounded-xl glass focus:border-primary/40 text-text-primary placeholder-text-muted text-sm outline-none transition-colors"
              />
            </div>

            {/* Sort */}
            <div className="flex gap-2">
              {([
                { value: 'trending' as SortBy, label: '🔥 Trending' },
                { value: 'recent' as SortBy, label: '🕐 Recent' },
                { value: 'name' as SortBy, label: 'A–Z' },
              ]).map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSortBy(s.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    sortBy === s.value
                      ? 'bg-primary text-white'
                      : 'glass text-text-muted hover:text-text-primary'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* School filter chips — horizontal scroll */}
          <div className="flex gap-2 overflow-x-auto horizontal-scroll pb-1">
            <button
              onClick={() => setSchoolFilter('all')}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                schoolFilter === 'all'
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'glass text-text-muted hover:text-text-primary'
              }`}
            >
              All Schools
            </button>
            {schools.slice(0, 10).map((school) => (
              <button
                key={school.id}
                onClick={() => setSchoolFilter(school.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  schoolFilter === school.id
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'glass text-text-muted hover:text-text-primary'
                }`}
              >
                {school.name.split(' ').slice(0, 2).join(' ')}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results count */}
        <p className="text-text-muted text-sm mb-6">
          {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
        </p>

        {/* Student Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredStudents.map((student, idx) => {
            const latestVideo = student.videos[0];
            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.03, 0.5) }}
              >
                <Link href={`/students/${student.id}`}>
                  <GlassCard className="overflow-hidden group h-full">
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={latestVideo?.thumbnailUrl || `/images/students/default.jpg`}
                        alt={`${student.name}'s story`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      {/* Play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-90 group-hover:scale-100">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
                            <polygon points="8,5 19,12 8,19" />
                          </svg>
                        </div>
                      </div>

                      {/* Duration */}
                      {latestVideo && (
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-xs text-white font-mono">
                          {latestVideo.duration}
                        </span>
                      )}

                      {/* Video count */}
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/50 backdrop-blur-sm text-xs text-white font-medium flex items-center gap-1">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5,3 19,12 5,21" />
                        </svg>
                        {student.videos.length}
                      </span>

                      {/* Favorite */}
                      <div className="absolute top-2 right-2">
                        <FavoriteButton id={student.id} type="student" size="sm" />
                      </div>
                    </div>

                    {/* Student info */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-start gap-3">
                        {/* Mini avatar */}
                        <div className="w-9 h-9 rounded-full bg-bg-elevated border border-border flex items-center justify-center shrink-0 text-primary font-display font-bold text-xs">
                          {student.initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-display font-semibold text-text-primary truncate group-hover:text-primary transition-colors">
                            {displayName(student.name)}
                          </h3>
                          <p className="text-text-muted text-xs truncate">
                            {student.schoolName} · Grade {student.grade}
                          </p>
                        </div>
                      </div>

                      {/* Progress badges */}
                      <div className="flex items-center gap-2 pt-1">
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                          {student.monthsActive}mo active
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-gold/10 text-gold text-[10px] font-medium">
                          {student.skillsEarned} skills
                        </span>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {filteredStudents.length === 0 && (
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
