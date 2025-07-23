'use client';

import { useState, useEffect } from 'react';
import { Cast } from '@/lib/types';
import CastGrid from '@/components/CastGrid';
import FilterButtons from '@/components/FilterButtons';

const CASTS_PER_PAGE = 20;

export default function Home() {
  const [allCasts, setAllCasts] = useState<Cast[]>([]);
  const [displayedCasts, setDisplayedCasts] = useState<Cast[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

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
    
    setDisplayedCasts(allCasts.slice(startIndex, endIndex));
    setCurrentPage(nextPage);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
    
    // For now, just show all casts
    // TODO: Implement actual filtering logic
    setDisplayedCasts(allCasts.slice(0, CASTS_PER_PAGE));
  };

  const hasMore = displayedCasts.length < allCasts.length;

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Farcaster Lore
          </h1>
          <p className="text-gray-600 mt-1">
            Explore casts from GM Farcaster episodes
          </p>
        </div>
      </header>

      <FilterButtons 
        onFilterChange={handleFilterChange} 
        activeFilter={activeFilter} 
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
