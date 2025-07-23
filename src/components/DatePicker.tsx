'use client';

import { useState } from 'react';

interface DatePickerProps {
  onDateSelect: (date: string | null) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function DatePicker({ onDateSelect, isOpen, onClose }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState('');

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleApply = () => {
    onDateSelect(selectedDate);
    onClose();
  };

  const handleClear = () => {
    setSelectedDate('');
    onDateSelect(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 max-w-[90vw]">
        <h3 className="text-lg font-semibold mb-4">Pick a Date</h3>
        <p className="text-sm text-gray-600 mb-4">
          Show casts from this date and earlier
        </p>
        
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          min="2023-09-01"
          max={new Date().toISOString().split('T')[0]}
        />
        
        <div className="flex space-x-3">
          <button
            onClick={handleClear}
            className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Clear
          </button>
          <button
            onClick={handleApply}
            disabled={!selectedDate}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply
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