import { NextResponse } from 'next/server';
import { miniAppConfig } from '../../../lib/config';

export async function GET() {
  const manifest = {
    miniapp: {
      version: "1",
      name: "Farcaster Lore",
      iconUrl: miniAppConfig.iconUrl(),
      homeUrl: miniAppConfig.homeUrl(),
      imageUrl: miniAppConfig.imageUrl(),
      buttonTitle: "📚 Explore",
      splashImageUrl: miniAppConfig.splashImageUrl(),
      splashBackgroundColor: miniAppConfig.splashBackgroundColor,
      description: "Explore casts featured on GM Farcaster episodes"
    }
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
} 