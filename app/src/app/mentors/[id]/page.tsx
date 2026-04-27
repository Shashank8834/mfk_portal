'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';

const profiles = [
  {
    id: 'tech-lead',
    name: 'Technology Lead',
    role: 'Technology',
    backHref: '/about#technology',
    backLabel: 'Back to About',
    bio: 'Built and maintains the MFK portal — from architecture and database design to deployment and performance. Ensures every student journey, video, and donation is tracked accurately and securely.',
    videoTitle: 'How the MFK Portal Works',
    videoDesc: 'A 1-minute walkthrough: the architecture behind the portal, how student data flows, and what makes it secure.',
  },
];

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const profile = profiles.find((p) => p.id === id);
  if (!profile) notFound();

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href={profile.backHref} className="text-text-muted text-sm hover:text-primary flex items-center gap-1 mb-8">
          ← {profile.backLabel}
        </Link>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-8 items-start mb-10"
        >
          {/* Photo placeholder */}
          <div className="w-40 h-40 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#5B4DB1" strokeWidth="1">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          {/* Info */}
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display font-extrabold text-3xl md:text-4xl text-text-primary">{profile.name}</h1>
              <Badge variant="primary">{profile.role}</Badge>
            </div>
            <p className="text-text-muted leading-relaxed">{profile.bio}</p>
          </div>
        </motion.div>

        {/* 1-Minute Video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="font-display font-bold text-2xl text-text-primary">Introduction Video</h2>

          <GlassCard className="overflow-hidden">
            <div className="aspect-video bg-bg-elevated flex flex-col items-center justify-center gap-4 relative">
              <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#5B4DB1">
                  <polygon points="8,5 19,12 8,19" />
                </svg>
              </div>
              <div className="text-center px-6">
                <p className="font-display font-bold text-text-primary">{profile.videoTitle}</p>
                <p className="text-text-muted text-sm mt-1">{profile.videoDesc}</p>
              </div>
              <span className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 text-white text-xs font-mono rounded-full">1:00</span>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
