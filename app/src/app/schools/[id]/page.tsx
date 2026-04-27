'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { notFound } from 'next/navigation';
import { getSchoolById } from '@/data/schools';
import { getStudentsBySchool } from '@/data/students';
import { getSchoolImage } from '@/lib/images';
import { getStudentImage } from '@/lib/images';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { displayName } from '@/lib/utils';

export default function SchoolProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const school = getSchoolById(id);
  if (!school) notFound();

  const students = getStudentsBySchool(id);
  const totalVideos = students.reduce((sum, s) => sum + s.videos.length, 0);
  const allVideos = students
    .flatMap((s) => s.videos.map((v) => ({ ...v, studentName: s.name, studentId: s.id })))
    .sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src={getSchoolImage(school.id)}
          alt={school.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FavoriteButton id={school.id} type="school" size="sm" />
              </div>
              <h1 className="font-display font-extrabold text-3xl md:text-5xl text-text-primary">
                {school.name}
              </h1>
              <p className="text-text-muted mt-2 text-lg">{school.address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Quick stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-4 gap-3 mb-10"
        >
          <GlassCard className="p-4 text-center">
            <div className="font-display font-bold text-2xl text-primary">
              <AnimatedCounter end={school.studentCount} />
            </div>
            <p className="text-text-muted text-xs mt-1">Students</p>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="font-display font-bold text-2xl text-gold">
              <AnimatedCounter end={totalVideos} />
            </div>
            <p className="text-text-muted text-xs mt-1">Videos</p>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="font-display font-bold text-2xl text-mint">
              <AnimatedCounter end={students.length} />
            </div>
            <p className="text-text-muted text-xs mt-1">Active Students</p>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="font-display font-bold text-2xl text-orange">
              <AnimatedCounter end={students.reduce((sum, s) => sum + s.skillsEarned, 0)} />
            </div>
            <p className="text-text-muted text-xs mt-1">Skills Earned</p>
          </GlassCard>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LEFT: Stories & Students ── */}
          <div className="lg:col-span-2 space-y-10">
            {/* Latest Stories from this school */}
            <div>
              <h2 className="font-display font-bold text-xl text-text-primary mb-6">
                Latest Stories
              </h2>
              <div className="space-y-4">
                {allVideos.slice(0, 8).map((video, idx) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link href={`/students/${video.studentId}`}>
                      <GlassCard className="overflow-hidden group">
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative w-full sm:w-60 aspect-video sm:aspect-auto sm:h-36 shrink-0 overflow-hidden">
                            <Image
                              src={video.thumbnailUrl}
                              alt={video.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 640px) 100vw, 240px"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-11 h-11 rounded-full bg-primary/90 flex items-center justify-center">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF">
                                  <polygon points="8,5 19,12 8,19" />
                                </svg>
                              </div>
                            </div>
                            <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-xs text-white font-mono rounded">
                              {video.duration}
                            </span>
                          </div>
                          <div className="p-4 sm:p-5 flex flex-col justify-center flex-1">
                            <h3 className="font-display font-semibold text-text-primary group-hover:text-primary transition-colors">
                              {video.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-sm text-text-muted">by <span className="text-text-primary font-medium">{video.studentName}</span></span>
                              <Badge variant="primary" size="sm">{video.activityType}</Badge>
                            </div>
                            <span className="text-xs text-text-muted mt-1">
                              {new Date(video.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </GlassCard>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Student grid */}
            <div>
              <h2 className="font-display font-bold text-xl text-text-primary mb-6">
                Meet the Students ({students.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {students.map((student, idx) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <Link href={`/students/${student.id}`}>
                      <GlassCard className="p-4 flex items-center gap-4 group">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                          <Image
                            src={student.videos[0]?.thumbnailUrl || getStudentImage(student.id)}
                            alt={student.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform"
                            sizes="56px"
                          />
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-text-primary group-hover:text-primary transition-colors truncate">
                            {displayName(student.name)}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-text-muted">Grade {student.grade}</span>
                            <span className="text-xs text-text-muted">·</span>
                            <span className="text-xs text-primary font-medium">{student.videos.length} videos</span>
                          </div>
                        </div>
                        <FavoriteButton id={student.id} type="student" size="sm" />
                      </GlassCard>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="space-y-6">
            {/* About */}
            <GlassCard className="p-6">
              <h3 className="font-display font-bold text-lg text-text-primary mb-3">About</h3>
              <p className="text-text-muted leading-relaxed text-sm">{school.description}</p>
              <div className="mt-4 space-y-3">
                <div className="glass rounded-xl p-3.5">
                  <p className="text-text-muted text-xs uppercase tracking-wider">Headmaster</p>
                  <p className="font-medium text-text-primary text-sm mt-0.5">{school.headmaster}</p>
                </div>
                <div className="glass rounded-xl p-3.5">
                  <p className="text-text-muted text-xs uppercase tracking-wider">Contact</p>
                  <p className="font-mono text-primary text-sm mt-0.5">{school.phone}</p>
                </div>
              </div>
            </GlassCard>

            {/* Quick info */}
            <GlassCard className="p-6">
              <h3 className="font-display font-bold text-lg text-text-primary mb-4">Quick Info</h3>
              <div className="space-y-3">
                {[
                  ['Location', 'Bangalore, KA'],
                  ['Type', 'Government High School'],
                  ['Grades', '8th – 10th'],
                  ['Medium', 'Kannada / English'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-text-muted text-sm">{label}</span>
                    <span className="text-text-primary text-sm">{value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Support CTA */}
            <GlassCard className="p-6 space-y-4 border-gold/10">
              <h3 className="font-display font-bold text-lg text-text-primary">Support This School</h3>
              <p className="text-text-muted text-sm">
                Help provide better education, infrastructure, and opportunities for {school.studentCount} students.
              </p>
              <Link href={`/donate?type=school&id=${school.id}`}>
                <Button variant="secondary" className="w-full">
                  Support This School
                </Button>
              </Link>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
