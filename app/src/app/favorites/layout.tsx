import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Favorites | Mentors for Kids',
  description: 'Your saved students and schools. Quick access to the stories and schools you care about.',
};

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
