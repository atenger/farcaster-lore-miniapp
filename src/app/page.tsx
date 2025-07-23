'use client';

import { useState, useEffect } from 'react';
import { Cast } from '@/lib/types';
import CastGrid from '@/components/CastGrid';
import FilterButtons from '@/components/FilterButtons';
import DatePicker from '@/components/DatePicker';
import UserSearch from '@/components/UserSearch';
import Link from 'next/link';

const CASTS_PER_PAGE = 20;

export default function Home() {
  const [allCasts, setAllCasts] = useState<Cast[]>([]);
  const [filteredCasts, setFilteredCasts] = useState<Cast[]>([]);
  const [displayedCasts, setDisplayedCasts] = useState<Cast[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<{ username?: string; fid?: number } | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isUserSearchOpen, setIsUserSearchOpen] = useState(false);

  // Load casts from JSON file
  useEffect(() => {
    const loadCasts = async () => {
      try {
        const response = await fetch('/casts.json');
        const casts: Cast[] = await response.json();
        
        // Sort by timestamp (newest first)
        const sortedCasts = casts.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        setAllCasts(sortedCasts);
        setFilteredCasts(sortedCasts);
        setDisplayedCasts(sortedCasts.slice(0, CASTS_PER_PAGE));
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading casts:', error);
        setIsLoading(false);
      }
    };

    loadCasts();
  }, []);

  const loadMore = () => {
    const nextPage = currentPage + 1;
    const startIndex = 0;
    const endIndex = nextPage * CASTS_PER_PAGE;
    
    setDisplayedCasts(filteredCasts.slice(startIndex, endIndex));
    setCurrentPage(nextPage);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
    
    if (filter === 'all') {
      // Clear all filters when going back to "All Casts"
      setSelectedDate(null);
      setSelectedUser(null);
      setFilteredCasts(allCasts);
      setDisplayedCasts(allCasts.slice(0, CASTS_PER_PAGE));
    }
  };

  const handleDateSelect = (date: string | null) => {
    setSelectedDate(date);
    setActiveFilter('pick-date');
    setCurrentPage(1);
    
    // Clear user search when switching to date filter
    setSelectedUser(null);
    
    if (date) {
      const selectedDateObj = new Date(date);
      const filtered = allCasts.filter(cast => {
        if (!cast.timestamp) return false;
        
        const castDate = new Date(cast.timestamp);
        if (isNaN(castDate.getTime())) return false;
        
        return castDate <= selectedDateObj;
      });
      setFilteredCasts(filtered);
      setDisplayedCasts(filtered.slice(0, CASTS_PER_PAGE));
    } else {
      setFilteredCasts(allCasts);
      setDisplayedCasts(allCasts.slice(0, CASTS_PER_PAGE));
    }
  };

  const handleDatePickerOpen = () => {
    setIsDatePickerOpen(true);
  };

  const handleUserSearchOpen = () => {
    setIsUserSearchOpen(true);
  };

  const handleUserSelect = (username: string | null, fid: number | null) => {
    setSelectedUser(username ? { username } : fid ? { fid } : null);
    setActiveFilter('pick-user');
    setCurrentPage(1);
    
    // Clear date filter when switching to user search
    setSelectedDate(null);
    
    if (username || fid) {
      const filtered = allCasts.filter(cast => {
        if (username) {
          return cast.author_username.toLowerCase().includes(username.toLowerCase());
        } else if (fid) {
          return cast.author_fid === fid;
        }
        return false;
      });
      setFilteredCasts(filtered);
      setDisplayedCasts(filtered.slice(0, CASTS_PER_PAGE));
    } else {
      setFilteredCasts(allCasts);
      setDisplayedCasts(allCasts.slice(0, CASTS_PER_PAGE));
    }
  };

  const hasMore = displayedCasts.length < filteredCasts.length;

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
            <Link 
              href="/leaderboard"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              🏆 Leaderboard
            </Link>
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

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <CastGrid
          casts={displayedCasts}
          onLoadMore={loadMore}
          hasMore={hasMore}
          isLoading={false}
        />
      )}
    </main>
  );
}
