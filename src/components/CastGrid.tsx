'use client';

import { useEffect, useRef, useCallback } from 'react';
import { EnrichedCast } from '@/lib/types';
import CastCard from './CastCard';

interface CastGridProps {
  casts: EnrichedCast[];
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export default function CastGrid({ casts, onLoadMore, hasMore, isLoading }: CastGridProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  const lastElementCallback = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    });
    
    if (node) {
      observerRef.current.observe(node);
      lastElementRef.current = node;
    }
  }, [isLoading, hasMore, onLoadMore]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Create unique keys for casts, handling duplicates
  const createUniqueKey = (cast: EnrichedCast, index: number) => {
    // Try to create a unique key using multiple fields
    const baseKey = cast.cast_hash;
    const authorKey = cast.author_username;
    const episodeKey = cast.source_episode_id;
    
    // Use source_episode_id to make the key more unique
    if (episodeKey) {
      return `${baseKey}-${authorKey}-${episodeKey}`;
    }
    
    // Fallback to index if we can't create a unique key
    return `${baseKey}-${index}`;
  };

  // Deduplicate casts based on cast_hash and other identifying fields
  const deduplicatedCasts = casts.reduce((unique: EnrichedCast[], cast: EnrichedCast) => {
    const isDuplicate = unique.find(existing => 
      existing.cast_hash === cast.cast_hash && 
      existing.author_username === cast.author_username &&
      existing.source_episode_id === cast.source_episode_id
    );
    
    if (!isDuplicate) {
      unique.push(cast);
    } else {
      // console.warn(`Duplicate cast detected: ${cast.cast_hash} by ${cast.author_username}`);
    }
    
    return unique;
  }, []);

  if (deduplicatedCasts.length === 0 && !isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <p className="text-gray-600">No casts found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deduplicatedCasts.map((cast, index) => (
          <div
            key={createUniqueKey(cast, index)}
            ref={index === deduplicatedCasts.length - 1 ? lastElementCallback : undefined}
          >
            <CastCard cast={cast} />
          </div>
        ))}
      </div>
      
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      )}
      
      {!hasMore && deduplicatedCasts.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>You&apos;ve reached the end! 🎉</p>
        </div>
      )}
    </div>
  );
} 