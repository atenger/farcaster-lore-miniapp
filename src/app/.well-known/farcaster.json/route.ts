import { NextResponse } from 'next/server';
import { miniAppConfig } from '../../../lib/config';

export async function GET() {
  const manifest = {
    "accountAssociation": {
    "header": "eyJmaWQiOjU4MTgsInR5cGUiOiJhdXRoIiwia2V5IjoiMHhCMUIyMTg4NGFmRTY1ODFGM0M0OTk3YjAzMjA0NjVGMThFOTY4MkMwIn0",
    "payload": "eyJkb21haW4iOiJsb3JlLmdtZmFyY2FzdGVyLmNvbSJ9",
    "signature": "mIYJ0xeG8jvxkxWxuJ2sHC160QrkYHfL/vmy6jHo0h4Lf4j8BNMOC/PK0+DCGNev77xL42x8LcSFiHoNfWoarBw="
    },
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
    },
    frame: {
      version: "1",
      name: "Farcaster Lore",
      iconUrl: miniAppConfig.iconUrl(),
      homeUrl: miniAppConfig.homeUrl(),
      imageUrl: miniAppConfig.imageUrl(),
      buttonTitle: "📚 Explore",
      splashImageUrl: miniAppConfig.splashImageUrl(),
      splashBackgroundColor: miniAppConfig.splashBackgroundColor,
      description: "Explore casts featured on GM Farcaster episodes"
    },
    "baseBuilder": {
      "allowedAddresses": ["0x6CB835229ff7e97ee8E1332139dA84D9ecB54Da6"]
    }
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
} 