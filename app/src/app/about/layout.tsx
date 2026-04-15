import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Mentors for Kids',
  description: 'Learn about the MFK Foundation — our mission, daily habit tracking, study routines, mentors, partners, and technology.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
