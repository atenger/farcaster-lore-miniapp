'use client';

import { FilterButtonsProps } from '@/lib/types';

export default function FilterButtons({ onFilterChange, activeFilter, onDatePickerOpen, onUserSearchOpen, selectedDate, selectedUser }: FilterButtonsProps) {
  const filters = [
    { id: 'all', label: 'All Casts' },
    { id: 'pick-user', label: selectedUser ? `👤 @${selectedUser.username || `FID:${selectedUser.fid}`}` : 'Pick a User' },
    { id: 'pick-date', label: selectedDate ? `📅 ${selectedDate}` : 'Pick a Date' }
  ];

  const handleFilterClick = (filterId: string) => {
    if (filterId === 'pick-date') {
      onDatePickerOpen();
    } else if (filterId === 'pick-user') {
      onUserSearchOpen();
    } else {
      onFilterChange(filterId);
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex space-x-2 overflow-x-auto">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterClick(filter.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === filter.id || (filter.id === 'pick-date' && selectedDate) || (filter.id === 'pick-user' && selectedUser)
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