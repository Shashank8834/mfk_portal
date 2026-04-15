import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Publications | Mentors for Kids',
  description: 'Read, highlight, and discuss MFK publications. Open for everyone to explore and engage with.',
};

export default function PublicationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
