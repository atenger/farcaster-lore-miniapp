'use client';

import { useState, useEffect, useCallback } from 'react';
import { useMiniApp } from '@neynar/react';
import Link from 'next/link';
import { EnrichedCast, SearchFilters } from '@/lib/types';
import { searchCasts, validateAndCleanCasts } from '@/lib/api';
import CastGrid from '@/components/CastGrid';
import { useDevMode } from '@/lib/devMode';
import { sdk } from '@farcaster/miniapp-sdk';
import { getBaseUrl } from '@/lib/config';
import { useSearchParams } from 'next/navigation';

const CASTS_PER_PAGE = 20;

export default function MyReferencesClient() {
  const { isSDKLoaded, context } = useMiniApp();
  const { isDevMode, devContext } = useDevMode();
  const searchParams = useSearchParams();
  
  // Use dev mode context if available, otherwise use real miniapp context
  const effectiveContext = isDevMode ? devContext : { isSDKLoaded, context };
  
  // Check if dev mode is in URL params
  const isDevModeInUrl = searchParams.get('dev') === 'true';
  
  const [casts, setCasts] = useState<EnrichedCast[]>([]);
  const [totalCasts, setTotalCasts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user's FID from Farcaster context (or dev mode)
  const userFid = effectiveContext.context?.user?.fid;

  const loadUserCasts = useCallback(async () => {
    if (!userFid) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const filters: SearchFilters = {
        fid: userFid,
        limit: CASTS_PER_PAGE,
        offset: 0,
      };
      
      const response = await searchCasts(filters);
      const cleanedCasts = validateAndCleanCasts(response.casts);
      setCasts(cleanedCasts);
      setTotalCasts(response.total);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading user casts:', error);
      setError('Failed to load your casts. Please try again.');
      setIsLoading(false);
    }
  }, [userFid]);

  const loadMore = async () => {
    if (isLoadingMore || !userFid) return;
    
    try {
      setIsLoadingMore(true);
      
      const filters: SearchFilters = {
        fid: userFid,
        limit: CASTS_PER_PAGE,
        offset: casts.length,
      };
      
      const response = await searchCasts(filters);
      const cleanedCasts = validateAndCleanCasts(response.casts);
      
      setCasts(prev => [...prev, ...cleanedCasts]);
    } catch (error) {
      console.error('Error loading more casts:', error);
      setError('Failed to load more casts. Please try again.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const hasMore = casts.length < totalCasts;

  // Create share message based on achievement
  const createShareMessage = () => {
    if (totalCasts === 0) {
      return `None of my casts have been mentioned on @gmfarcaster...yet! Check out this miniapp to see if any of your casts have been mentioned on Farcaster&apos;s #1 News Show`;
    } else if (totalCasts > 10) {
      return `${totalCasts} of my bangers have been mentioned on @gmfarcaster! Check out this miniapp to see if any of your casts have been mentioned on Farcaster&apos;s #1 News Show`;
    } else {
      return `${totalCasts} of my bangers have been mentioned on @gmfarcaster! Check out this miniapp to see if any of your casts have been mentioned on Farcaster&apos;s #1 News Show`;
    }
  };

  // Handle share button click
  const handleShare = async () => {
    try {
      const message = createShareMessage();
      const baseUrl = getBaseUrl();
      const myReferencesUrl = isDevMode 
        ? `${baseUrl}/my-references?dev=true&sharedby=${userFid}` 
        : `${baseUrl}/my-references?sharedby=${userFid}`;
      
      console.log('Sharing cast:', message);
      
      await sdk.actions.composeCast({
        text: message,
        embeds: [myReferencesUrl],
      });
    } catch (error) {
      console.error('Error sharing cast:', error);
      alert('Failed to share. Please try again.');
    }
  };

  // Load user's casts when FID is available
  useEffect(() => {
    if (userFid) {
      loadUserCasts();
    } else if (effectiveContext.isSDKLoaded && !userFid) {
      // SDK loaded but no user FID - show appropriate message
      setIsLoading(false);
      setError('No Farcaster user detected. Please make sure you are using this MiniApp from within Farcaster.');
    }
  }, [userFid, effectiveContext.isSDKLoaded, loadUserCasts]);

  // Show loading while SDK is initializing
  if (!effectiveContext.isSDKLoaded) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Row 1: Title & Dev Mode */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              My References
            </h1>
            {isDevMode && (
              <div className="mt-2 inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                🧪 Dev Mode - Test FID: {userFid}
              </div>
            )}
          </div>

          {/* Row 2: Navigation (prominent) */}
          <div className="flex gap-3 justify-center">
            <Link 
              href={isDevModeInUrl ? "/?dev=true" : "/"}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              ← Back to All Casts
            </Link>
            <Link 
              href={isDevModeInUrl ? "/leaderboard?dev=true" : "/leaderboard"}
              className="px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors font-medium"
            >
              🏆 Leaderboard
            </Link>
          </div>
        </div>
      </header>

      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button 
              onClick={loadUserCasts}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="mb-6 text-center">
            <div className="flex flex-col items-center gap-4">
              {totalCasts === 0 ? (
                <>
                  <p className="text-gray-600 text-lg">
                    Your casts haven&apos;t been mentioned on GM Farcaster yet.
                  </p>
                  <p className="text-gray-600 text-lg">
                    But that&apos;s not your worth - you&apos;re good enough, smart enough, and people like you! Keep casting!
                  </p>
                </>
              ) : totalCasts > 10 ? (
                <>
                  <p className="text-gray-600 text-lg">
                    <span className="font-semibold text-purple-600">{totalCasts}</span> of your casts have been mentioned on GM Farcaster!
                  </p>
                  <p className="text-gray-600 text-lg">
                    wowow you&apos;re a star! ⭐
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-600 text-lg">
                    <span className="font-semibold text-purple-600">{totalCasts}</span> of your casts have been mentioned on GM Farcaster!
                  </p>
                  <p className="text-gray-600 text-lg">
                    Keep casting those bangers! 🔥
                  </p>
                </>
              )}
              <button 
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
              >
                🎉 SHARE
              </button>
            </div>
          </div>
          
          {casts.length > 0 && (
            <CastGrid
              casts={casts}
              onLoadMore={loadMore}
              hasMore={hasMore}
              isLoading={isLoadingMore}
            />
          )}
        </div>
      )}
    </main>
  );
}
