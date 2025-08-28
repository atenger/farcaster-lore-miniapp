import type { Metadata } from 'next';
import { getBaseUrl, miniAppConfig } from '@/lib/config';
import MyReferencesClient from '@/components/MyReferencesClient';


function sanitizeFID(raw?: string) {
  if (!raw) return undefined;
  const onlyDigits = raw.replace(/\D/g, '');
  return onlyDigits.length ? onlyDigits : undefined;
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ sharedby?: string }> }): Promise<Metadata> {
  
  const baseUrl = getBaseUrl();
  const params = await searchParams;
  const fid = sanitizeFID(params?.sharedby);
  const imageUrl = new URL(`/api/share-image`, baseUrl);
  if (fid) imageUrl.searchParams.set('sharedby', fid);

  const launchUrl = miniAppConfig.myReferencesUrl(fid ? { sharedby: fid } : undefined);

  const miniappEmbed = {
    "version": "next",
    "imageUrl": imageUrl.toString(),
    "button": {
      "title": "Check If You've Been Mentioned",
      "action": {
        "type": "launch_miniapp",
        "name": "Farcaster Lore",
        "url": launchUrl,
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

export default function MyReferences() {
  return <MyReferencesClient />;
}
