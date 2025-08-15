'use client';

import { useState, useEffect, useCallback } from 'react';
import { useMiniApp } from '@neynar/react';
import Link from 'next/link';
import { EnrichedCast, SearchFilters } from '@/lib/types';
import { searchCasts, validateAndCleanCasts } from '@/lib/api';
import CastGrid from '@/components/CastGrid';

const CASTS_PER_PAGE = 20;

export default function MyReferences() {
  const { isSDKLoaded, context } = useMiniApp();
  const [casts, setCasts] = useState<EnrichedCast[]>([]);
  const [totalCasts, setTotalCasts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user's FID from Farcaster context
  const userFid = context?.user?.fid;

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

  // Load user's casts when FID is available
  useEffect(() => {
    if (userFid) {
      loadUserCasts();
    } else if (isSDKLoaded && !userFid) {
      // SDK loaded but no user FID - show appropriate message
      setIsLoading(false);
      setError('No Farcaster user detected. Please make sure you are using this MiniApp from within Farcaster.');
    }
  }, [userFid, isSDKLoaded, loadUserCasts]);

  // Show loading while SDK is initializing
  if (!isSDKLoaded) {
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
          {/* Row 1: Title & Subtitle (full width) */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              My References
            </h1>
            <p className="text-gray-600 mt-1">
              All the times you were mentioned on{' '}
              <a 
                href="https://www.youtube.com/@gmfarcaster"
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                GM Farcaster
              </a>
            </p>
          </div>

          {/* Row 2: Navigation (prominent) */}
          <div className="flex gap-3 justify-center">
            <Link 
              href="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              ← Back to All Casts
            </Link>
            <Link 
              href="/leaderboard"
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
          {casts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No casts found for your FID. This might mean:
              </p>
              <ul className="text-gray-500 mt-2 space-y-1">
                <li>• You haven&apos;t been mentioned on GM Farcaster yet</li>
                <li>• You need to be using this MiniApp from within Farcaster</li>
                <li>• There&apos;s an issue with the data</li>
              </ul>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <p className="text-gray-600">
                  Found <span className="font-semibold text-purple-600">{totalCasts}</span> of your casts mentioned on GM Farcaster!
                </p>
              </div>
              <CastGrid
                casts={casts}
                onLoadMore={loadMore}
                hasMore={hasMore}
                isLoading={isLoadingMore}
              />
            </>
          )}
        </div>
      )}
    </main>
  );
}
