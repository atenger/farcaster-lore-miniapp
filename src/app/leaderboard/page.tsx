import type { Metadata } from 'next';
import { miniAppConfig } from '@/lib/config';
import LeaderboardClient from '@/components/LeaderboardClient';

export async function generateMetadata(): Promise<Metadata> {
  const miniappEmbed = {
    "version": "next",
    "imageUrl": miniAppConfig.imageUrl(),
    "button": {
      "title": "Travel Through Farcaster History",
      "action": {
        "type": "launch_miniapp",
        "name": "Farcaster Lore",
        "url": miniAppConfig.homeUrl(),
        "splashImageUrl": miniAppConfig.splashImageUrl(),
        "splashBackgroundColor": miniAppConfig.splashBackgroundColor
      }
    }
  };

  return {
    title: "Farcaster Lore - GM Farcaster Casts",
    description: "Explore casts featured on GM Farcaster episodes through time",
    other: {
      "fc:miniapp": JSON.stringify(miniappEmbed),
      "fc:frame": JSON.stringify(miniappEmbed)
    }
  };
}

export default function Leaderboard() {
  return <LeaderboardClient />;
} 