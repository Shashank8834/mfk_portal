'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { notFound } from 'next/navigation';
import { getStudentById } from '@/data/students';
import { donors } from '@/data/donors';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { getInitials, displayName } from '@/lib/utils';

export default function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const student = getStudentById(id);
  if (!student) notFound();

  const studentDonors = donors.slice(0, student.sponsorCount || 3);
  const latestVideo = student.videos[0];

  return (
    <div className="pt-20 min-h-screen pb-24 md:pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── HERO VIDEO ── Large featured video at the top */}
        {latestVideo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <GlassCard className="overflow-hidden" glow>
              <div className="relative aspect-video max-h-[500px] overflow-hidden group cursor-pointer">
                <Image
                  src={latestVideo.thumbnailUrl}
                  alt={latestVideo.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 80vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/70 via-transparent to-transparent" />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/30 opacity-80 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary flex items-center justify-center">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="#FFFFFF">
                        <polygon points="8,5 19,12 8,19" />
                      </svg>
                    </div>
                  </motion.div>
                </div>

                {/* Video info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
                  <Badge variant="primary" size="md">{latestVideo.activityType}</Badge>
                  <h2 className="font-display font-bold text-xl md:text-2xl text-text-primary mt-2">
                    {latestVideo.title}
                  </h2>
                  <p className="text-text-muted text-sm mt-1">
                    {new Date(latestVideo.date).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>

                {/* Duration */}
                <span className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-black/60 text-sm text-white font-mono backdrop-blur-sm">
                  {latestVideo.duration}
                </span>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* ── STUDENT HEADER ── Name, school, badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-10"
        >
          <div className="relative">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden glass border-2 border-primary/30 flex items-center justify-center bg-bg-elevated">
              {student.avatarUrl ? (
                <Image src={student.avatarUrl} alt={student.name} width={96} height={96} className="w-full h-full object-cover" />
              ) : (
                <span className="font-display font-bold text-2xl text-primary">{getInitials(student.name)}</span>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2">
              <FavoriteButton id={student.id} type="student" size="md" />
            </div>
          </div>

          <div className="flex-1">
            <h1 className="font-display font-extrabold text-3xl md:text-4xl text-text-primary">{displayName(student.name)}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Link href={`/schools/${student.schoolId}`}>
                <Badge variant="primary" size="md">{student.schoolName}</Badge>
              </Link>
              <Badge variant="gold" size="md">Grade {student.grade}</Badge>
              <Badge variant="muted" size="md">
                <span className="font-mono">{student.videos.length} videos</span>
              </Badge>
            </div>
          </div>

          <div className="flex gap-3 shrink-0 sm:self-start">
            <Link href={`/schools/${student.schoolId}`}>
              <Button variant="secondary" size="sm">View School</Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LEFT: Story & Journey ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Journey Progress */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <GlassCard className="p-6" glow>
                <h3 className="font-display font-bold text-lg text-text-primary mb-4">
                  {student.name.split(' ')[0]}&apos;s Journey
                </h3>
                <p className="text-text-muted leading-relaxed mb-5">
                  {student.name.split(' ')[0]} has been part of the MFK mentorship program for {student.monthsActive} months. 
                  They&apos;ve logged {student.journalsLogged} learning journals, earned {student.skillsEarned} skill badges, 
                  and shared {student.videos.length} stories documenting their growth.
                </p>
                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center py-3 glass rounded-xl">
                    <div className="font-display font-bold text-xl text-primary">
                      <AnimatedCounter end={student.videos.length} />
                    </div>
                    <p className="text-text-muted text-[10px] mt-1 uppercase tracking-wider">Videos</p>
                  </div>
                  <div className="text-center py-3 glass rounded-xl">
                    <div className="font-display font-bold text-xl text-gold">
                      <AnimatedCounter end={student.journalsLogged} />
                    </div>
                    <p className="text-text-muted text-[10px] mt-1 uppercase tracking-wider">Journals</p>
                  </div>
                  <div className="text-center py-3 glass rounded-xl">
                    <div className="font-display font-bold text-xl text-mint">
                      <AnimatedCounter end={student.skillsEarned} />
                    </div>
                    <p className="text-text-muted text-[10px] mt-1 uppercase tracking-wider">Skills</p>
                  </div>
                  <div className="text-center py-3 glass rounded-xl">
                    <div className="font-display font-bold text-xl text-orange">
                      <AnimatedCounter end={student.monthsActive} />
                    </div>
                    <p className="text-text-muted text-[10px] mt-1 uppercase tracking-wider">Months</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* All Videos */}
            <div>
              <h2 className="font-display font-bold text-xl text-text-primary mb-4">
                All Stories
              </h2>

              {student.videos.length > 1 ? (
                <div className="space-y-4">
                  {student.videos.slice(1).map((video, idx) => (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.06 }}
                    >
                      <GlassCard className="overflow-hidden group">
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative w-full sm:w-72 aspect-video sm:aspect-auto sm:h-40 shrink-0 overflow-hidden">
                            <Image
                              src={video.thumbnailUrl}
                              alt={video.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 640px) 100vw, 288px"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
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
                              <Badge variant="primary" size="sm">{video.activityType}</Badge>
                              <span className="text-xs text-text-muted">
                                {new Date(video.date).toLocaleDateString('en-IN', {
                                  day: 'numeric', month: 'long', year: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <GlassCard className="p-8 text-center">
                  <p className="text-text-muted">More videos coming soon as {student.name.split(' ')[0]} continues their journey.</p>
                </GlassCard>
              )}
            </div>
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="space-y-6">
            {/* Community — supporters who believe in this student */}
            <GlassCard className="p-6 space-y-4">
              <h3 className="font-display font-bold text-lg text-text-primary">
                Community
              </h3>
              <p className="text-text-muted text-sm">
                {student.sponsorCount} people are cheering for {student.name.split(' ')[0]}
              </p>
              <div className="flex flex-wrap gap-2">
                {studentDonors.map((donor) => (
                  <div
                    key={donor.id}
                    className="w-9 h-9 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-xs font-medium text-text-muted"
                    title={donor.isAnonymous ? 'Anonymous' : donor.name}
                  >
                    {donor.isAnonymous ? '?' : donor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                ))}
                {student.sponsorCount > studentDonors.length && (
                  <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                    +{student.sponsorCount - studentDonors.length}
                  </div>
                )}
              </div>
            </GlassCard>

            {/* School link */}
            <GlassCard className="p-6 space-y-3">
              <h3 className="font-display font-bold text-lg text-text-primary">School</h3>
              <Link href={`/schools/${student.schoolId}`}>
                <div className="glass rounded-xl p-4 flex items-center gap-3 group hover:border-primary/30 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5B4DB1" strokeWidth="1.5">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-text-primary group-hover:text-primary transition-colors text-sm truncate">
                      {student.schoolName}
                    </p>
                    <p className="text-xs text-text-muted">View all students →</p>
                  </div>
                </div>
              </Link>
            </GlassCard>

            {/* Soft support CTA — not aggressive */}
            <GlassCard className="p-6 space-y-4 border-gold/10">
              <h3 className="font-display font-bold text-lg text-text-primary">
                Want to support {student.name.split(' ')[0]}?
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Your contribution helps cover school supplies, activity materials, 
                and keeps {student.name.split(' ')[0]}&apos;s learning journey going.
              </p>
              <div className="flex items-center gap-3 text-sm text-text-muted">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06D6A0" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                80G tax benefit included
              </div>
              <Link href="/donate">
                <Button variant="secondary" className="w-full">
                  Support {student.name.split(' ')[0]}&apos;s Journey
                </Button>
              </Link>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
