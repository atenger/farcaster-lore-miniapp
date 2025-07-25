'use client';

import { useState, useEffect } from 'react';
import { EnrichedCast, SearchFilters } from '@/lib/types';
import { searchCasts, getAllCasts, validateAndCleanCasts } from '@/lib/api';
import CastGrid from '@/components/CastGrid';
import FilterButtons from '@/components/FilterButtons';
import DatePicker from '@/components/DatePicker';
import UserSearch from '@/components/UserSearch';
import Link from 'next/link';

const CASTS_PER_PAGE = 20;

export default function Home() {
  const [casts, setCasts] = useState<EnrichedCast[]>([]);
  const [totalCasts, setTotalCasts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<{ username?: string; fid?: number } | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isUserSearchOpen, setIsUserSearchOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial casts
  useEffect(() => {
    loadInitialCasts();
  }, []);

  const loadInitialCasts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getAllCasts(CASTS_PER_PAGE, 0);
      const cleanedCasts = validateAndCleanCasts(response.casts);
      setCasts(cleanedCasts);
      setTotalCasts(response.total);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading casts:', error);
      setError('Failed to load casts. Please try again.');
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    if (isLoadingMore) return;
    
    try {
      setIsLoadingMore(true);
      
      const filters: SearchFilters = {
        limit: CASTS_PER_PAGE,
        offset: casts.length,
      };
      
      // Add current filters
      if (selectedDate) filters.date = selectedDate;
      if (selectedUser?.username) {
        filters.author = selectedUser.username;
      } else if (selectedUser?.fid) {
        filters.fid = selectedUser.fid;
      }
      
      const response = await searchCasts(filters);
      const cleanedCasts = validateAndCleanCasts(response.casts);
      
      setCasts(prev => [...prev, ...cleanedCasts]);
      setCurrentPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more casts:', error);
      setError('Failed to load more casts. Please try again.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleFilterChange = async (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
    
    if (filter === 'all') {
      // Clear all filters when going back to "All Casts"
      setSelectedDate(null);
      setSelectedUser(null);
      await loadInitialCasts();
    }
  };

  const handleDateSelect = async (date: string | null) => {
    console.log('[DatePicker] Selected date:', date);
    setSelectedDate(date);
    setActiveFilter(date ? 'pick-date' : 'all');
    setCurrentPage(1);
    
    // Clear user search when switching to date filter
    setSelectedUser(null);
    
    try {
      setIsLoading(true);
      setError(null);
      
      const filters: SearchFilters = {
        limit: CASTS_PER_PAGE,
        offset: 0,
      };
      
      if (date) {
        filters.date = date;
      }
      console.log('[DatePicker] Filters for search:', filters);
      
      const response = await searchCasts(filters);
      console.log('[DatePicker] API response:', response);
      const cleanedCasts = validateAndCleanCasts(response.casts);
      setCasts(cleanedCasts);
      setTotalCasts(response.total);
    } catch (error) {
      console.error('Error filtering by date:', error);
      setError('Failed to filter by date. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDatePickerOpen = () => {
    setIsDatePickerOpen(true);
  };

  const handleUserSearchOpen = () => {
    setIsUserSearchOpen(true);
  };

  const handleUserSelect = async (username: string | null, fid: number | null) => {
    setSelectedUser(username ? { username } : fid ? { fid } : null);
    setActiveFilter((username || fid) ? 'pick-user' : 'all');
    setCurrentPage(1);
    
    // Clear date filter when switching to user search
    setSelectedDate(null);
    
    try {
      setIsLoading(true);
      setError(null);
      
      const filters: SearchFilters = {
        limit: CASTS_PER_PAGE,
        offset: 0,
      };
      
      if (username) {
        filters.author = username;
      } else if (fid) {
        filters.fid = fid;
      }
      
      const response = await searchCasts(filters);
      const cleanedCasts = validateAndCleanCasts(response.casts);
      setCasts(cleanedCasts);
      setTotalCasts(response.total);
    } catch (error) {
      console.error('Error filtering by user:', error);
      setError('Failed to filter by user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const hasMore = casts.length < totalCasts;

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Farcaster Lore
              </h1>
              <p className="text-gray-600 mt-1">
                Explore casts featured on{' '}
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
            <div className="flex gap-2">
               <Link 
                 href="/leaderboard"
                 className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
               >
                 🏆 Leaderboard
               </Link>
            </div>
          </div>
        </div>
      </header>

      <FilterButtons 
        onFilterChange={handleFilterChange} 
        activeFilter={activeFilter}
        onDatePickerOpen={handleDatePickerOpen}
        onUserSearchOpen={handleUserSearchOpen}
        selectedDate={selectedDate}
        selectedUser={selectedUser}
      />

      <DatePicker
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onDateSelect={handleDateSelect}
      />

      <UserSearch
        isOpen={isUserSearchOpen}
        onClose={() => setIsUserSearchOpen(false)}
        onUserSelect={handleUserSelect}
      />

      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button 
              onClick={loadInitialCasts}
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
        <CastGrid
          casts={casts}
          onLoadMore={loadMore}
          hasMore={hasMore}
          isLoading={isLoadingMore}
        />
      )}
    </main>
  );
}
