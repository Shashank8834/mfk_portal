import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Donate | Mentors for Kids',
  description: 'Support underprivileged students with education funding. 80G tax benefit included. Sponsor a student, school, or the foundation.',
};

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
