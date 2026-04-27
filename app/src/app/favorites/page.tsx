'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { getStudentById } from '@/data/students';
import { getSchoolById } from '@/data/schools';
import { getStudentImage } from '@/lib/images';
import { getSchoolImage } from '@/lib/images';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { Button } from '@/components/ui/Button';
import { displayName } from '@/lib/utils';
import { useLocaleStore } from '@/stores/localeStore';
import { t } from '@/lib/i18n';

type SortBy = 'recent' | 'school' | 'grade';

export default function FavoritesPage() {
  const { favorites } = useFavoritesStore();
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [mounted, setMounted] = useState(false);
  const locale = useLocaleStore((s) => s.locale);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard for localStorage-backed state
  useEffect(() => { setMounted(true); }, []);

  const sortedFavorites = useMemo(() => {
    const items = [...favorites];
    switch (sortBy) {
      case 'recent':
        return items.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
      case 'school':
        return items.sort((a, b) => {
          const studentA = getStudentById(a.id);
          const studentB = getStudentById(b.id);
          return (studentA?.schoolName || '').localeCompare(studentB?.schoolName || '');
        });
      case 'grade':
        return items.sort((a, b) => {
          const studentA = getStudentById(a.id);
          const studentB = getStudentById(b.id);
          return (studentA?.grade || 0) - (studentB?.grade || 0);
        });
      default:
        return items;
    }
  }, [favorites, sortBy]);

  if (!mounted) {
    return (
      <div className="pt-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-10 w-48 bg-bg-elevated/60 rounded-lg animate-pulse mb-4" />
          <div className="h-6 w-64 bg-bg-elevated/60 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

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
            {t('favorites.title', locale)}
          </h1>
          <p className="text-text-muted mt-2 text-lg">
            {favorites.length > 0
              ? `${favorites.length} ${favorites.length === 1 ? 'item' : 'items'}`
              : t('favorites.empty', locale)}
          </p>
        </motion.div>

        {favorites.length > 0 && (
          <>
            {/* Sort controls */}
            <div className="flex gap-2 mb-8">
              {[
                { value: 'recent' as SortBy, label: t('favorites.recent', locale) },
                { value: 'school' as SortBy, label: t('favorites.bySchool', locale) },
                { value: 'grade' as SortBy, label: t('favorites.byGrade', locale) },
              ].map((s) => (
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

            {/* Masonry grid */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              <AnimatePresence>
                {sortedFavorites.map((fav, idx) => {
                  if (fav.type === 'student') {
                    const student = getStudentById(fav.id);
                    if (!student) return null;
                    return (
                      <motion.div
                        key={fav.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: idx * 0.03 }}
                        className="break-inside-avoid"
                      >
                        <Link href={`/students/${student.id}`}>
                          <GlassCard className="overflow-hidden group">
                            <div className="relative aspect-video">
                              <Image
                                src={student.videos[0]?.thumbnailUrl || getStudentImage(student.id)}
                                alt={student.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 640px) 100vw, 33vw"
                              />
                              <div className="absolute top-2 right-2">
                                <FavoriteButton id={student.id} type="student" size="sm" />
                              </div>
                              {student.videos[0] && (
                                <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-xs text-white font-mono rounded">
                                  {student.videos[0].duration}
                                </span>
                              )}
                            </div>
                            <div className="p-4">
                              <h3 className="font-display font-semibold text-text-primary group-hover:text-primary transition-colors">
                                {displayName(student.name)}
                              </h3>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="primary" size="sm">
                                  {student.schoolName.split(' ').slice(0, 2).join(' ')}
                                </Badge>
                                <Badge variant="muted" size="sm">Grade {student.grade}</Badge>
                              </div>
                            </div>
                          </GlassCard>
                        </Link>
                      </motion.div>
                    );
                  }

                  if (fav.type === 'school') {
                    const school = getSchoolById(fav.id);
                    if (!school) return null;
                    return (
                      <motion.div
                        key={fav.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: idx * 0.03 }}
                        className="break-inside-avoid"
                      >
                        <Link href={`/schools/${school.id}`}>
                          <GlassCard className="overflow-hidden group">
                            <div className="relative h-40">
                              <Image
                                src={getSchoolImage(school.id)}
                                alt={school.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 640px) 100vw, 33vw"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 to-transparent" />
                              <div className="absolute top-2 right-2">
                                <FavoriteButton id={school.id} type="school" size="sm" />
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="font-display font-semibold text-text-primary group-hover:text-primary transition-colors">
                                {school.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="primary" size="sm">
                                  {school.address.split(',')[0]}
                                </Badge>
                                <Badge variant="muted" size="sm">{school.studentCount} students</Badge>
                              </div>
                            </div>
                          </GlassCard>
                        </Link>
                      </motion.div>
                    );
                  }

                  return null;
                })}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* Empty state */}
        {favorites.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-bg-card border border-border flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6B6590" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h2 className="font-display font-bold text-2xl text-text-primary mb-3">
              {t('favorites.noFavs', locale)}
            </h2>
            <p className="text-text-muted text-lg mb-8 max-w-md mx-auto">
              {t('favorites.noFavsDesc', locale)}
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/schools">
                <Button variant="primary">{t('favorites.exploreSchools', locale)}</Button>
              </Link>
              <Link href="/map">
                <Button variant="secondary">{t('favorites.viewMap', locale)}</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
