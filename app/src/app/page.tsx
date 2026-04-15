import { Hero } from '@/components/home/Hero';
import { FeaturedStory } from '@/components/home/FeaturedStory';
import { TrendingStories } from '@/components/home/TrendingStories';
import { ImpactNumbers } from '@/components/home/ImpactNumbers';
import { MissionStrip } from '@/components/home/MissionStrip';

export default function HomePage() {
  return (
    <>
      <Hero />
      <hr className="section-divider" />
      <FeaturedStory />
      <hr className="section-divider" />
      <TrendingStories />
      <hr className="section-divider" />
      <ImpactNumbers />
      <hr className="section-divider" />
      <MissionStrip />
    </>
  );
}
