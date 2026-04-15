import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Schools | Mentors for Kids',
  description: 'Explore 28 government high schools across Bangalore enrolled in the MFK mentorship program.',
};

export default function SchoolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
