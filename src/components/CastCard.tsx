'use client';

import { CastCardProps } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

export default function CastCard({ cast }: CastCardProps) {
  const formatDate = (timestamp: string) => {
    try {
      if (!timestamp) return 'Unknown time';
      
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'Unknown time';
      
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  const truncateText = (text: string | null | undefined, maxLength: number = 200) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2 px-4 pt-4 cursor-pointer" onClick={() => window.open(cast.url, '_blank')}>
        <div>
          <p className="font-medium text-gray-900">@{cast.author_username}</p>
        </div>
        <span className="text-xs text-gray-400">{formatDate(cast.timestamp)}</span>
      </div>
      
      <div className="p-4 cursor-pointer" onClick={() => window.open(cast.url, '_blank')}>
        <p className="text-gray-800 text-sm leading-relaxed">
          {truncateText(cast.text)}
        </p>
      </div>
      
      <div 
        className="flex items-center justify-center text-xs text-gray-500 py-2 bg-purple-50 cursor-pointer" 
        onClick={() => window.open(`https://www.youtube.com/watch?v=${cast.source_episode_id}`, '_blank')}
      >
        <span>Mentioned on </span>
        <span className="text-purple-600 font-medium ml-1">
          GM Farcaster
        </span>
      </div>
    </div>
  );
} 