'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { schools } from '@/data/schools';
import { getStudentsBySchool } from '@/data/students';
import { getStudentImage } from '@/lib/images';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { School } from '@/types';
import { useLocaleStore } from '@/stores/localeStore';
import { t } from '@/lib/i18n';
import { publicName } from '@/lib/utils';

/* ── Lazy-load Google Map (never bundled if key is empty) ── */
const GoogleMapView = dynamic(() => import('@/components/GoogleMapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-bg-deep">
      <div className="text-text-muted text-sm animate-pulse">Loading map…</div>
    </div>
  ),
});

const HAS_API_KEY = !!(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

/* ── 3 Geographic Clusters ── */
interface Cluster {
  id: string;
  name: string;
  color: string;
  center: { lat: number; lng: number };
  schools: School[];
}

function buildClusters(): Cluster[] {
  const north: School[] = [];
  const centralEast: School[] = [];
  const southWest: School[] = [];

  for (const s of schools) {
    if (s.latitude > 13.0) north.push(s);
    else if (s.longitude > 77.58) centralEast.push(s);
    else southWest.push(s);
  }

  const avg = (arr: School[], key: 'latitude' | 'longitude') =>
    arr.reduce((sum, s) => sum + s[key], 0) / arr.length;

  return [
    { id: 'north', name: 'North Bangalore', color: '#7B6BD4', center: { lat: avg(north, 'latitude'), lng: avg(north, 'longitude') }, schools: north },
    { id: 'central-east', name: 'Central & East Bangalore', color: '#F5A623', center: { lat: avg(centralEast, 'latitude'), lng: avg(centralEast, 'longitude') }, schools: centralEast },
    { id: 'south-west', name: 'South & West Bangalore', color: '#06D6A0', center: { lat: avg(southWest, 'latitude'), lng: avg(southWest, 'longitude') }, schools: southWest },
  ];
}

/* ── Fallback map (no API key) ── */
function FallbackMap({ clusters, onClusterClick }: { clusters: Cluster[]; onClusterClick: (c: Cluster) => void }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-bg-deep via-bg-card to-bg-elevated relative">
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#5B4DB1" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {clusters.map((cluster) => {
        const cx = ((cluster.center.lng - 77.45) / (77.67 - 77.45)) * 100;
        const cy = ((13.13 - cluster.center.lat) / (13.13 - 12.93)) * 100;
        return (
          <button key={cluster.id} className="absolute group" style={{ left: `${Math.max(10, Math.min(90, cx))}%`, top: `${Math.max(10, Math.min(90, cy))}%` }} onClick={() => onClusterClick(cluster)}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 transition-transform hover:scale-110" style={{ backgroundColor: `${cluster.color}CC`, borderColor: cluster.color }}>
              {cluster.schools.length}
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="glass-elevated rounded-lg px-3 py-1.5 whitespace-nowrap text-xs text-text-primary">{cluster.name}</div>
            </div>
          </button>
        );
      })}
      <div className="absolute bottom-4 left-4 glass rounded-lg px-3 py-2 z-10">
        <p className="text-xs text-text-muted">Bangalore, Karnataka</p>
        <p className="text-[10px] text-text-muted mt-0.5">Add Google Maps API key in .env.local</p>
      </div>
    </div>
  );
}

export default function MapPage() {
  const clusters = useMemo(() => buildClusters(), []);
  const locale = useLocaleStore((s) => s.locale);
  const [activeCluster, setActiveCluster] = useState<Cluster | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mapRef, setMapRef] = useState<any>(null);

  const handleClusterClick = useCallback(
    (cluster: Cluster) => {
      setActiveCluster(cluster);
      setSelectedSchool(null);
      if (mapRef && typeof google !== 'undefined') {
        const bounds = new google.maps.LatLngBounds();
        cluster.schools.forEach((s) => bounds.extend({ lat: s.latitude, lng: s.longitude }));
        mapRef.fitBounds(bounds, 60);
      }
    },
    [mapRef],
  );

  const handleSchoolClick = useCallback((school: School) => setSelectedSchool(school), []);

  const handleBack = useCallback(() => {
    setActiveCluster(null);
    setSelectedSchool(null);
    if (mapRef) {
      mapRef.panTo({ lat: 12.9716, lng: 77.5746 });
      mapRef.setZoom(12);
    }
  }, [mapRef]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onMapReady = useCallback((map: any) => setMapRef(map), []);

  const sidebarContent = useMemo(() => {
    if (selectedSchool) {
      const students = getStudentsBySchool(selectedSchool.id).slice(0, 3);
      return (
        <motion.div key="school-detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
          <GlassCard className="p-6 space-y-4" glow>
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-bold text-xl text-text-primary">{selectedSchool.name}</h3>
                <p className="text-text-muted text-sm mt-1">{selectedSchool.address}</p>
              </div>
              <button onClick={() => setSelectedSchool(null)} className="text-text-muted hover:text-text-primary p-1 shrink-0 ml-2">✕</button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="muted">{selectedSchool.studentCount} students</Badge>
              <Badge variant="muted">{selectedSchool.headmaster}</Badge>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">{selectedSchool.description}</p>
            {students.length > 0 && (
              <div>
                <p className="text-sm text-text-muted mb-2">{t('map.detail.students', locale)}</p>
                <div className="flex gap-2">
                  {students.map((student) => (
                    <Link key={student.id} href={`/students/${student.pnr}`}>
                      <div className="w-20 h-14 rounded-lg overflow-hidden relative group">
                        <Image src={student.videos[0]?.thumbnailUrl || getStudentImage(student.id)} alt={publicName(student)} fill className="object-cover group-hover:scale-110 transition-transform" sizes="80px" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <Link href={`/schools/${selectedSchool.id}`} className="flex-1"><Button variant="primary" size="sm" className="w-full">{t('map.viewSchool', locale)}</Button></Link>
              <Link href="/donate" className="flex-1"><Button variant="gold" size="sm" className="w-full">{t('map.donate', locale)}</Button></Link>
            </div>
          </GlassCard>
        </motion.div>
      );
    }

    if (activeCluster) {
      return (
        <motion.div key="cluster-schools" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
          <button onClick={handleBack} className="flex items-center gap-2 text-sm text-primary hover:text-primary-glow transition-colors mb-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
            {t('map.allClusters', locale)}
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: activeCluster.color }} />
            <h3 className="font-display font-bold text-lg text-text-primary">{activeCluster.name}</h3>
            <span className="text-xs text-text-muted">({activeCluster.schools.length} {t('map.schools', locale)})</span>
          </div>
          {activeCluster.schools.map((school, idx) => (
            <motion.div key={school.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}>
              <button onClick={() => handleSchoolClick(school)} className="w-full text-left">
                <GlassCard className="p-4 flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: activeCluster.color }} />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm text-text-primary truncate">{school.name}</h4>
                    <p className="text-xs text-text-muted truncate">{school.address.split(',')[0]}</p>
                  </div>
                  <span className="text-xs text-text-muted shrink-0">{school.studentCount}</span>
                </GlassCard>
              </button>
            </motion.div>
          ))}
        </motion.div>
      );
    }

    return (
      <motion.div key="clusters-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
        <p className="text-sm text-text-muted">{t('map.hint', locale)}</p>
        {clusters.map((cluster) => (
          <button key={cluster.id} onClick={() => handleClusterClick(cluster)} className="w-full text-left">
            <GlassCard className="p-5 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full shrink-0" style={{ backgroundColor: cluster.color }} />
                <h3 className="font-display font-bold text-text-primary">{cluster.name}</h3>
              </div>
              <div className="flex items-center justify-between text-sm text-text-muted pl-8">
                <span>{cluster.schools.length} {t('map.schools', locale)}</span>
                <span>{cluster.schools.reduce((s, sc) => s + sc.studentCount, 0)} {t('map.students', locale)}</span>
              </div>
            </GlassCard>
          </button>
        ))}
      </motion.div>
    );
  }, [activeCluster, selectedSchool, clusters, handleBack, handleClusterClick, handleSchoolClick, locale]);

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-text-primary">{t('map.title', locale)}</h1>
          <p className="text-text-muted mt-2 text-lg">{t('map.subtitle', locale, { count: String(schools.length) })}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <GlassCard className="p-1 overflow-hidden" hover={false}>
              <div className="relative aspect-[4/3] md:aspect-[16/9] rounded-xl overflow-hidden">
                {HAS_API_KEY ? (
                  <GoogleMapView
                    clusters={clusters}
                    activeCluster={activeCluster}
                    selectedSchool={selectedSchool}
                    onClusterClick={handleClusterClick}
                    onSchoolClick={handleSchoolClick}
                    onSchoolClose={() => setSelectedSchool(null)}
                    onMapReady={onMapReady}
                  />
                ) : (
                  <FallbackMap clusters={clusters} onClusterClick={handleClusterClick} />
                )}
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-1 max-h-[70vh] overflow-y-auto pr-1">
            <AnimatePresence mode="wait">{sidebarContent}</AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
