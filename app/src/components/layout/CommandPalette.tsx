'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { schools } from '@/data/schools';
import { students } from '@/data/students';

interface SearchResult {
  id: string;
  type: 'student' | 'school';
  title: string;
  subtitle: string;
  href: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Listen for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input and reset state when opening
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting search state on open/close
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [open]);

  // Debounced search
  const search = useCallback((q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }

    const lower = q.toLowerCase();
    const schoolResults: SearchResult[] = schools
      .filter((s) => s.name.toLowerCase().includes(lower) || s.address.toLowerCase().includes(lower))
      .slice(0, 5)
      .map((s) => ({
        id: s.id,
        type: 'school',
        title: s.name,
        subtitle: `${s.studentCount} students · ${s.address.split(',')[0]}`,
        href: `/schools/${s.id}`,
      }));

    const studentResults: SearchResult[] = students
      .filter((s) => s.name.toLowerCase().includes(lower) || s.schoolName.toLowerCase().includes(lower))
      .slice(0, 5)
      .map((s) => ({
        id: s.id,
        type: 'student',
        title: s.name,
        subtitle: `${s.schoolName} · Grade ${s.grade}`,
        href: `/students/${s.id}`,
      }));

    setResults([...schoolResults, ...studentResults]);
    setSelectedIndex(0);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 200);
    return () => clearTimeout(timer);
  }, [query, search]);

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    router.push(result.href);
  };

  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]"
        >
          <div className="absolute inset-0 bg-bg-deep/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg mx-4 glass-elevated rounded-2xl overflow-hidden shadow-2xl shadow-primary/10"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B6590" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyNavigation}
                placeholder="Search students, schools..."
                aria-label="Search students and schools"
                className="flex-1 bg-transparent text-text-primary placeholder-text-muted text-base outline-none font-body"
              />
              <kbd className="px-2 py-1 text-xs rounded bg-bg-elevated text-text-muted font-mono border border-border">
                ESC
              </kbd>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="max-h-80 overflow-y-auto p-2">
                {results.some(r => r.type === 'school') && (
                  <div className="px-3 py-2">
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Schools</span>
                  </div>
                )}
                {results
                  .filter(r => r.type === 'school')
                  .map((result) => {
                    const absoluteIdx = results.indexOf(result);
                    return (
                    <button
                      key={result.id}
                      onClick={() => handleSelect(result)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                        absoluteIdx === selectedIndex ? 'bg-primary/10 text-primary' : 'hover:bg-bg-elevated text-text-primary'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B4DB1" strokeWidth="2">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{result.title}</p>
                        <p className="text-xs text-text-muted truncate">{result.subtitle}</p>
                      </div>
                    </button>
                    );
                  })}

                {results.some(r => r.type === 'student') && (
                  <div className="px-3 py-2 mt-1">
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Students</span>
                  </div>
                )}
                {results
                  .filter(r => r.type === 'student')
                  .map((result) => {
                    const absoluteIdx = results.indexOf(result);
                    return (
                      <button
                        key={result.id}
                        onClick={() => handleSelect(result)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                          absoluteIdx === selectedIndex ? 'bg-primary/10 text-primary' : 'hover:bg-bg-elevated text-text-primary'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-mint/10 flex items-center justify-center shrink-0">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06D6A0" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{result.title}</p>
                          <p className="text-xs text-text-muted truncate">{result.subtitle}</p>
                        </div>
                      </button>
                    );
                  })}
              </div>
            )}

            {/* Empty state */}
            {query.length >= 2 && results.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-text-muted text-sm">No results found for &quot;{query}&quot;</p>
              </div>
            )}

            {/* Hint */}
            {query.length < 2 && (
              <div className="p-6 text-center">
                <p className="text-text-muted text-sm">Type to search students and schools...</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
