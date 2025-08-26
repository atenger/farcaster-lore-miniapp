import { useSearchParams } from 'next/navigation';

// Dev mode hook that simulates miniapp context
export function useDevMode() {
  const searchParams = useSearchParams();
  const isDevMode = searchParams.get('dev') === 'true';
  
  // Simulate miniapp context in dev mode

  //541455 mentioned less than 10 times
  //5818 mentioned more than 10 times
  const devContext = {
    isSDKLoaded: true,
    context: {
      user: {
        fid: 541455, // Test FID for development
        username: 'adrienne-test',
        displayName: 'adrienne test'
      }
    }
  };
  
  return { isDevMode, devContext };
}
