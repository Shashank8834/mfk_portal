import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Students | Mentors for Kids',
  description: 'Meet the students across 28 government schools in the MFK mentorship program.',
};

export default function StudentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
