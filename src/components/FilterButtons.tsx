'use client';

import { FilterButtonsProps } from '@/lib/types';

export default function FilterButtons({ onFilterChange, activeFilter }: FilterButtonsProps) {
  const filters = [
    { id: 'all', label: 'All Casts' },
    { id: 'my-casts', label: 'My Casts' },
    { id: 'pick-date', label: 'Pick a Date' }
  ];

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex space-x-2 overflow-x-auto">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === filter.id
                ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
} 