'use client';

import { useState, useEffect } from 'react';
import { Cast } from '@/lib/types';
import Link from 'next/link';

interface UserStats {
  username: string;
  fid: number;
  count: number;
  firstSeen: string;
  lastSeen: string;
}

export default function Leaderboard() {
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const response = await fetch('/casts.json');
        const casts: Cast[] = await response.json();
        
        // Group casts by user
        const userMap = new Map<string, UserStats>();
        
        casts.forEach(cast => {
          if (!cast.author_username) return;
          
          const key = `${cast.author_username}-${cast.author_fid}`;
          
          if (userMap.has(key)) {
            const existing = userMap.get(key)!;
            existing.count++;
            if (cast.timestamp < existing.firstSeen) {
              existing.firstSeen = cast.timestamp;
            }
            if (cast.timestamp > existing.lastSeen) {
              existing.lastSeen = cast.timestamp;
            }
          } else {
            userMap.set(key, {
              username: cast.author_username,
              fid: cast.author_fid,
              count: 1,
              firstSeen: cast.timestamp,
              lastSeen: cast.timestamp
            });
          }
        });
        
        // Convert to array and sort by count (descending)
        const stats = Array.from(userMap.values())
          .sort((a, b) => b.count - a.count)
          .slice(0, 100); // Top 100 users
        
        setUserStats(stats);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
        setIsLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  const formatDate = (timestamp: string) => {
    try {
      if (!timestamp) return 'Unknown';
      
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'Unknown';
      
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return 'Unknown';
    }
  };

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Leaderboard
              </h1>
              <p className="text-gray-600 mt-1">
                Most mentioned users on{' '}
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
            <Link 
              href="/"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              ← Back to Casts
            </Link>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    First Seen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Seen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userStats.map((user, index) => (
                  <tr key={`${user.username}-${user.fid}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-medium">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.firstSeen)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.lastSeen)}
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