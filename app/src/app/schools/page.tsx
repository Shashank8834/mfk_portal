'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { schools } from '@/data/schools';
import { getStudentsBySchool } from '@/data/students';
import { getSchoolImage } from '@/lib/images';
import { GlassCard } from '@/components/ui/GlassCard';
import { FavoriteButton } from '@/components/ui/FavoriteButton';

export default function SchoolsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSchools = useMemo(() => {
    return schools.filter((s) => {
      return searchQuery === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.address.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery]);

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display font-bold text-3xl md:text-4xl text-text-primary">
            All Schools
          </h1>
          <p className="text-text-muted mt-2 text-lg">
            Explore {schools.length} government high schools across Bangalore
          </p>
        </motion.div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schools..."
              aria-label="Search schools"
              className="w-full pl-12 pr-4 py-3 rounded-xl glass focus:border-primary/40 text-text-primary placeholder-text-muted text-sm outline-none transition-colors"
            />
          </div>
        </div>

        {/* School Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools.map((school, idx) => {
            const schoolStudents = getStudentsBySchool(school.id);

            return (
              <motion.div
                key={school.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <Link href={`/schools/${school.id}`}>
                  <GlassCard className="overflow-hidden group">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-bg-elevated">
                      <Image
                        src={getSchoolImage(school.id)}
                        alt={school.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-card/90 to-transparent" />
                      <div className="absolute top-3 right-3">
                        <FavoriteButton id={school.id} type="school" size="sm" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5 space-y-3">
                      <h3 className="font-display font-bold text-lg text-text-primary group-hover:text-primary transition-colors">
                        {school.name}
                      </h3>
                      <p className="text-text-muted text-sm line-clamp-1">{school.address}</p>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-primary flex items-center gap-1 font-medium">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                          {schoolStudents.reduce((sum, s) => sum + s.videos.length, 0)} videos
                        </span>
                        <span className="text-text-muted flex items-center gap-1">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          {school.studentCount} students
                        </span>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {filteredSchools.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-muted text-lg">No schools found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
