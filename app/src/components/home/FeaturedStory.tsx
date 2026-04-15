'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getTrendingStudents } from '@/data/students';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { GlassCard } from '@/components/ui/GlassCard';

export function FeaturedStory() {
  const featured = getTrendingStudents(1)[0];
  if (!featured) return null;

  const latestVideo = featured.videos[0];
  const recentVideos = featured.videos.slice(0, 3);

  return (
    <section className="py-20 md:py-28 relative overflow-hidden section-spotlight">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-gold text-sm font-semibold uppercase tracking-wider font-mono">Featured</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-text-primary mt-3">
            Story Spotlight
          </h2>
          <p className="text-text-muted mt-3 text-lg max-w-xl mx-auto">
            Every student has a story worth watching. Here&apos;s one that stood out this week.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GlassCard className="overflow-hidden" glow>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
              {/* Large video area */}
              <div className="lg:col-span-3 relative">
                <Link href={`/students/${featured.id}`}>
                  <div className="relative aspect-video lg:aspect-auto lg:h-full min-h-[300px] overflow-hidden group">
                    <Image
                      src={latestVideo?.thumbnailUrl || `/images/students/default.jpg`}
                      alt={`${featured.name} — ${latestVideo?.title || 'Story video'}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/80 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-bg-deep/20 hidden lg:block" />

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

                    {/* Duration */}
                    {latestVideo && (
                      <span className="absolute bottom-4 right-4 px-3 py-1 rounded-lg bg-black/60 text-sm text-white font-mono backdrop-blur-sm">
                        {latestVideo.duration}
                      </span>
                    )}

                    {/* Activity tag */}
                    {latestVideo && (
                      <div className="absolute top-4 left-4">
                        <Badge variant="primary" size="md">{latestVideo.activityType}</Badge>
                      </div>
                    )}
                  </div>
                </Link>
              </div>

              {/* Student info panel */}
              <div className="lg:col-span-2 p-6 md:p-8 flex flex-col justify-between">
                <div className="space-y-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display font-bold text-2xl md:text-3xl text-text-primary">
                        {featured.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="primary" size="md">{featured.schoolName}</Badge>
                        <Badge variant="gold" size="sm">Grade {featured.grade}</Badge>
                      </div>
                    </div>
                    <FavoriteButton id={featured.id} type="student" size="md" />
                  </div>

                  <p className="text-text-muted leading-relaxed">
                    {featured.name.split(' ')[0]} has been part of the MFK program for {featured.monthsActive} months,
                    logging {featured.journalsLogged} journals and earning {featured.skillsEarned} skill badges.
                    Watch their journey unfold through {featured.videos.length} personal stories.
                  </p>

                  {/* Quick stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center py-3 glass rounded-xl">
                      <div className="font-display font-bold text-xl text-primary">{featured.videos.length}</div>
                      <p className="text-text-muted text-[10px] uppercase tracking-wider mt-0.5">Videos</p>
                    </div>
                    <div className="text-center py-3 glass rounded-xl">
                      <div className="font-display font-bold text-xl text-gold">{featured.skillsEarned}</div>
                      <p className="text-text-muted text-[10px] uppercase tracking-wider mt-0.5">Skills</p>
                    </div>
                    <div className="text-center py-3 glass rounded-xl">
                      <div className="font-display font-bold text-xl text-mint">{featured.monthsActive}</div>
                      <p className="text-text-muted text-[10px] uppercase tracking-wider mt-0.5">Months</p>
                    </div>
                  </div>

                  {/* More videos from this student */}
                  {recentVideos.length > 1 && (
                    <div>
                      <p className="text-text-muted text-xs uppercase tracking-wider mb-2">More from {featured.name.split(' ')[0]}</p>
                      <div className="flex gap-2">
                        {recentVideos.slice(1).map((vid) => (
                          <div key={vid.id} className="relative w-24 h-16 rounded-lg overflow-hidden group/thumb">
                            <Image
                              src={vid.thumbnailUrl}
                              alt={vid.title}
                              fill
                              className="object-cover group-hover/thumb:scale-110 transition-transform"
                              sizes="96px"
                            />
                            <div className="absolute inset-0 bg-black/20" />
                            <span className="absolute bottom-0.5 right-0.5 px-1 py-0.5 bg-black/70 text-[9px] text-white font-mono rounded">
                              {vid.duration}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <Link href={`/students/${featured.id}`}>
                    <Button variant="primary" size="lg" className="w-full">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                      Watch {featured.name.split(' ')[0]}&apos;s Story
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
