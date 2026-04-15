import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Student Stories | Mentors for Kids',
  description: 'Watch student stories from government schools across Bangalore. Every student has a journey worth following.',
};

export default function StoriesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
