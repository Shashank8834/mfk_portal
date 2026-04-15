'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { allBooks } from '@/data/books';

export default function PublicationsPage() {
  return (
    <div className="min-h-screen bg-bg-deep pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-3">
            Publications
          </h1>
          <p className="text-text-muted text-lg mb-12 max-w-2xl">
            Read, highlight, and discuss. Our publications are open for everyone
            to explore and engage with.
          </p>
        </motion.div>

        <div className="grid gap-8">
          {allBooks.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={`/publications/${book.id}`}>
                <div className="group bg-bg-card rounded-2xl border border-border p-8 md:p-10 card-hover-glow cursor-pointer">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Book cover placeholder */}
                    <div className="w-full md:w-48 h-64 md:h-72 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border border-border flex flex-col items-center justify-center shrink-0 group-hover:shadow-lg transition-shadow">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                      </div>
                      <span className="text-xs text-text-muted font-medium uppercase tracking-wider">
                        {book.chapters.length} Chapters
                      </span>
                    </div>

                    {/* Book info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary group-hover:text-primary transition-colors">
                            {book.title}
                          </h2>
                          <p className="text-text-muted text-base mt-1">
                            {book.subtitle}
                          </p>
                        </div>
                        <span className="shrink-0 text-text-muted group-hover:text-primary transition-colors">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>

                      <p className="text-text-muted leading-relaxed mb-6">
                        {book.coverDescription}
                      </p>

                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <span className="font-medium text-text-primary">{book.author}</span>
                      </div>

                      {/* Chapter previews */}
                      <div className="mt-6 flex flex-wrap gap-2">
                        {book.chapters.slice(0, 5).map((ch) => (
                          <span
                            key={ch.id}
                            className="px-3 py-1 rounded-full bg-bg-elevated text-xs font-medium text-text-muted"
                          >
                            {ch.title}
                          </span>
                        ))}
                        {book.chapters.length > 5 && (
                          <span className="px-3 py-1 rounded-full bg-bg-elevated text-xs font-medium text-text-muted">
                            +{book.chapters.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
