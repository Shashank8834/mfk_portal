'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { Badge } from './Badge';
import { FavoriteButton } from './FavoriteButton';
import { Button } from './Button';
import { Student } from '@/types';
import { publicName } from '@/lib/utils';

interface StudentCardProps {
  student: Student;
  index?: number;
}

export function StudentCard({ student, index = 0 }: StudentCardProps) {
  const latestVideo = student.videos[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/students/${student.pnr}`}>
        <GlassCard className="group overflow-hidden w-[300px] md:w-[320px]" hover>
          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={latestVideo?.thumbnailUrl || `https://picsum.photos/seed/${student.id}/640/360`}
              alt={`${publicName(student)}'s story`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="320px"
            />
            {/* Play icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </motion.div>
            </div>

            {/* Duration badge */}
            {latestVideo && (
              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-xs text-white font-mono">
                {latestVideo.duration}
              </span>
            )}

            {/* Favorite button */}
            <div className="absolute top-2 right-2">
              <FavoriteButton id={student.id} type="student" size="sm" />
            </div>
          </div>

          {/* Info */}
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-display font-semibold text-text-primary truncate text-base">
                  {publicName(student)}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="primary" size="sm">{student.schoolName.split(' ').slice(0, 2).join(' ')}</Badge>
                  <Badge variant="muted" size="sm">Grade {student.grade}</Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="primary" size="sm" className="flex-1 text-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
                Watch Story
              </Button>
              <span className="text-xs text-text-muted font-mono shrink-0">
                {student.videos.length} videos
              </span>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}
