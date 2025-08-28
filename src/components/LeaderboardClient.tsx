'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CastIndexEntry, EnrichedCast } from '@/lib/types';
import { useMiniApp } from '@neynar/react';
import { useDevMode } from '@/lib/devMode';
import { useSearchParams } from 'next/navigation';

interface UserStats {
  username: string;
  count: number;
  rank: number;
  pfpUrl?: string;
}

export default function LeaderboardClient() {
  const { context } = useMiniApp();
  const { isDevMode, devContext } = useDevMode();
  const searchParams = useSearchParams();
  
  // Use dev mode context if available, otherwise use real miniapp context
  const effectiveContext = isDevMode ? devContext : { context };
  
  // Check if dev mode is in URL params
  const isDevModeInUrl = searchParams.get('dev') === 'true';
  
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        // Fetch the cast index data
        const response = await fetch('/api/casts/index');
        const casts: CastIndexEntry[] = await response.json();
        
        // Group by author_username
        const userMap = new Map<string, UserStats>();
        
        casts.forEach((cast: CastIndexEntry) => {
          const username = cast.author_username;
          if (!username) return;
          
          if (userMap.has(username)) {
            const existing = userMap.get(username)!;
            existing.count++;
          } else {
            userMap.set(username, {
              username,
              count: 1,
              rank: 0, // Will be set later
            });
          }
        });
        
        // Convert to array and sort by count (descending)
        const stats = Array.from(userMap.values())
          .sort((a, b) => b.count - a.count)
          .slice(0, 100); // Top 100 users

        // Add proper ranking (same count = same rank, next rank skips accordingly)
        let currentRank = 1;
        let previousCount = stats[0]?.count || 0;
        
        stats.forEach((user, index) => {
          if (index === 0) {
            user.rank = 1;
          } else if (user.count === previousCount) {
            // Same count as previous user, same rank
            user.rank = currentRank;
          } else {
            // Different count, increment rank
            currentRank = index + 1;
            user.rank = currentRank;
            previousCount = user.count;
          }
        });

        // Smart PFP fetching for all 100 users
        // Step 1: Get all unique episode IDs needed for top 100 users
        const userEpisodeMap = new Map<string, string[]>();
        stats.forEach(user => {
          const userCasts = casts.filter((c: CastIndexEntry) => c.author_username === user.username);
          const episodeIds = [...new Set(userCasts.map((c: CastIndexEntry) => c.source_episode_id))];
          userEpisodeMap.set(user.username, episodeIds);
        });

        // Step 2: Get all unique episode IDs across all users
        const allEpisodeIds = [...new Set(Array.from(userEpisodeMap.values()).flat().filter((id): id is string => typeof id === 'string'))];
        
        // Step 3: Load all episode files in parallel
        const episodeDataMap = new Map<string, EnrichedCast[]>();
        await Promise.all(allEpisodeIds.map(async (episodeId) => {
          try {
            const response = await fetch(`/api/episodes/${episodeId}`);
            if (response.ok) {
              const data: EnrichedCast[] = await response.json();
              episodeDataMap.set(episodeId, data);
            }
          } catch (error) {
            console.warn(`Failed to load episode ${episodeId}:`, error);
          }
        }));

        // Step 4: Build username -> PFP lookup map
        const usernamePfpMap = new Map<string, string>();
        episodeDataMap.forEach((episodeData) => {
          episodeData.forEach((cast: EnrichedCast) => {
            if (cast.author_username && cast.author_pfp && !usernamePfpMap.has(cast.author_username)) {
              usernamePfpMap.set(cast.author_username, cast.author_pfp);
            }
          });
        });

        // Step 5: Assign PFPs to users
        stats.forEach(user => {
          const pfpUrl = usernamePfpMap.get(user.username);
          if (pfpUrl) {
            user.pfpUrl = pfpUrl;
          }
        });

        setUserStats(stats);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
        setIsLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Row 1: Title & Subtitle (full width) */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Leaderboard
            </h1>
            <p className="text-gray-600 mt-1">
              The Most Mentioned Users on{' '}
              <a 
                href="https://www.youtube.com/@gmfarcaster"
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                GM Farcaster
              </a>
            </p>
            {isDevMode && (
              <div className="mt-2 inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                🧪 Dev Mode - Test FID: {effectiveContext.context?.user?.fid}
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
            {effectiveContext.context?.user?.fid && (
              <Link 
                href={isDevModeInUrl ? "/my-references?dev=true" : "/my-references"}
                className="px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors font-medium"
              >
                📍 My References
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Top {userStats.length} 
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mentions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userStats.map((user, index) => (
                  <tr key={user.username} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{user.rank}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.pfpUrl ? (
                          <img
                            src={user.pfpUrl}
                            alt={user.username}
                            className="w-8 h-8 rounded-full mr-3 border border-gray-200"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-medium">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            @{user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-semibold">{user.count}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
