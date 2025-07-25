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
  iconUrl: () => getAssetUrl('/loredark_icon.png'),
  homeUrl: () => getBaseUrl(),
  imageUrl: () => getAssetUrl('/loredark_image.png'),
  splashImageUrl: () => getAssetUrl('/loredark_icon.png'),
  splashBackgroundColor: '#6a329f',
}; 