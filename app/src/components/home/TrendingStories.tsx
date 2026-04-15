'use client';

import { motion } from 'framer-motion';
import { StudentCard } from '@/components/ui/StudentCard';
import { getTrendingStudents } from '@/data/students';

export function TrendingStories() {
  const trendingStudents = getTrendingStudents(12);

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <span className="text-primary text-sm font-semibold uppercase tracking-wider font-mono">Trending</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-text-primary mt-2">
              Student Stories
            </h2>
            <p className="text-text-muted mt-2 text-lg max-w-md">
              Watch the latest stories from students across our schools
            </p>
          </div>
          <motion.a
            href="/stories"
            whileHover={{ x: 4 }}
            className="hidden md:flex items-center gap-2 text-primary text-sm font-medium hover:text-primary-glow transition-colors"
          >
            View all
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.a>
        </motion.div>

        {/* Horizontal scroll row */}
        <div className="relative">
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-bg-deep to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-bg-deep to-transparent z-10 pointer-events-none" />

          <div className="horizontal-scroll px-1 -mx-1">
            {trendingStudents.map((student, idx) => (
              <StudentCard key={student.id} student={student} index={idx} />
            ))}
          </div>
        </div>

        {/* Mobile view all */}
        <div className="mt-8 text-center md:hidden">
          <a
            href="/stories"
            className="inline-flex items-center gap-2 text-primary text-sm font-medium"
          >
            View all stories
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
