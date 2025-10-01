import { useSearchParams } from 'next/navigation';

// Dev mode hook that simulates miniapp context
export function useDevMode() {
  const searchParams = useSearchParams();
  const isDevMode = searchParams.get('dev') === 'true';
  
  // Simulate miniapp context in dev mode

  //541455 mentioned less than 10 times
  //5818 mentioned more than 10 times
  //18586 links who has dupes
  // 234616 pichi
  const devContext = {
    isSDKLoaded: true,
    context: {
      user: {
        fid: 234616, // Test FID for development (links)
        username: 'adrienne-test',
        displayName: 'adrienne test'
      }
    }
  };
  
  return { isDevMode, devContext };
}
