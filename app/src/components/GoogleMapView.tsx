'use client';

import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
import type { School } from '@/types';

interface Cluster {
  id: string;
  name: string;
  color: string;
  center: { lat: number; lng: number };
  schools: School[];
}

const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#F0EEF7' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#FFFFFF' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6B6590' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#E8E5F3' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#D8D4EB' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#C5D5F0' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#E8E5F3' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#D5EDD8' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#E0DCF0' }] },
];

function clusterIcon(color: string, count: number) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="${color}" fill-opacity="0.25" stroke="${color}" stroke-width="2"/><circle cx="28" cy="28" r="18" fill="${color}" fill-opacity="0.85"/><text x="28" y="33" text-anchor="middle" font-size="14" font-weight="bold" fill="white">${count}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function pinIcon(color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36"><path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.27 21.73 0 14 0z" fill="${color}"/><circle cx="14" cy="14" r="6" fill="white" fill-opacity="0.9"/></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export default function GoogleMapView({
  clusters,
  activeCluster,
  selectedSchool,
  onClusterClick,
  onSchoolClick,
  onSchoolClose,
  onMapReady,
}: {
  clusters: Cluster[];
  activeCluster: Cluster | null;
  selectedSchool: School | null;
  onClusterClick: (c: Cluster) => void;
  onSchoolClick: (s: School) => void;
  onSchoolClose: () => void;
  onMapReady: (map: google.maps.Map) => void;
}) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-bg-deep">
        <div className="text-text-muted text-sm animate-pulse">Loading map…</div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerClassName="w-full h-full"
      center={{ lat: 12.9716, lng: 77.5746 }}
      zoom={12}
      onLoad={onMapReady}
      options={{
        styles: MAP_STYLES,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        backgroundColor: '#F0EEF7',
      }}
    >
      {!activeCluster &&
        clusters.map((cluster) => (
          <Marker
            key={cluster.id}
            position={cluster.center}
            icon={{
              url: clusterIcon(cluster.color, cluster.schools.length),
              scaledSize: new google.maps.Size(56, 56),
              anchor: new google.maps.Point(28, 28),
            }}
            onClick={() => onClusterClick(cluster)}
          />
        ))}
      {activeCluster &&
        activeCluster.schools.map((school) => (
          <Marker
            key={school.id}
            position={{ lat: school.latitude, lng: school.longitude }}
            icon={{
              url: pinIcon(activeCluster.color),
              scaledSize: new google.maps.Size(28, 36),
              anchor: new google.maps.Point(14, 36),
            }}
            onClick={() => onSchoolClick(school)}
          />
        ))}
      {selectedSchool && (
        <InfoWindow
          position={{ lat: selectedSchool.latitude, lng: selectedSchool.longitude }}
          onCloseClick={onSchoolClose}
          options={{ pixelOffset: new google.maps.Size(0, -36) }}
        >
          <div style={{ color: '#1A1740', padding: '4px 8px', maxWidth: 200 }}>
            <strong style={{ fontSize: 13 }}>{selectedSchool.name}</strong>
            <p style={{ fontSize: 11, margin: '4px 0 0', color: '#555' }}>
              {selectedSchool.studentCount} students
            </p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
