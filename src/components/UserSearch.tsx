'use client';

import { useState } from 'react';

interface UserSearchProps {
  onUserSelect: (username: string | null, fid: number | null) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserSearch({ onUserSelect, isOpen, onClose }: UserSearchProps) {
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = () => {
    if (!searchInput.trim()) {
      onUserSelect(null, null);
      onClose();
      return;
    }

    // Check if input is a number (FID)
    const isFid = /^\d+$/.test(searchInput.trim());
    
    if (isFid) {
      // Search by FID
      onUserSelect(null, parseInt(searchInput.trim()));
    } else {
      // Search by username (remove @ if present)
      const username = searchInput.trim().replace(/^@/, '');
      onUserSelect(username, null);
    }
    
    onClose();
  };

  const handleClear = () => {
    setSearchInput('');
    onUserSelect(null, null);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 max-w-[90vw]">
        <h3 className="text-lg font-semibold mb-4">Pick a User</h3>
        <p className="text-sm text-gray-600 mb-4">
          Enter a username or FID 
        </p>
        
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter username or FID..."
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          autoFocus
        />
        
        <div className="flex space-x-3">
          <button
            onClick={handleClear}
            className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Clear
          </button>
          <button
            onClick={handleSearch}
            disabled={!searchInput.trim()}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Search
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
} 