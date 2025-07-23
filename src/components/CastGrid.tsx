'use client';

import { useEffect, useRef, useCallback } from 'react';
import { CastGridProps } from '@/lib/types';
import CastCard from './CastCard';

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

  if (casts.length === 0 && !isLoading) {
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
        {casts.map((cast, index) => (
          <div
            key={`${cast.cast_hash}-${index}`}
            ref={index === casts.length - 1 ? lastElementCallback : undefined}
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
      
      {!hasMore && casts.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>You've reached the end! 🎉</p>
        </div>
      )}
    </div>
  );
} 