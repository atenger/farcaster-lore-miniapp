// Dynamic configuration for different environments
export function getBaseUrl(): string {
  // Check if we're in the browser
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Server-side: use environment variable or default
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://lore.gmfarcaster.com';
}

export function getAssetUrl(path: string): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${path}`;
}

// Mini App specific URLs
export const miniAppConfig = {
  iconUrl: () => getAssetUrl('/icon.svg'),
  homeUrl: () => getBaseUrl(),
  imageUrl: () => getAssetUrl('/opengraph-image.svg'),
  splashImageUrl: () => getAssetUrl('/logo.svg'),
  splashBackgroundColor: '#f3f4f6',
}; 