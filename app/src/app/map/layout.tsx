import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'School Map | Mentors for Kids',
  description: 'Interactive map of 28 government schools across Bangalore participating in the MFK program.',
};

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
