import React from 'react';

interface Props {
  sortBy: 'subscribers' | 'videos' | 'name';
  onSortChange: (value: 'subscribers' | 'videos' | 'name') => void;
  filterValue: number;
  onFilterChange: (value: number) => void;
  onApplyFilter: () => void;
  onClearFilter: () => void;
  filterApplied: boolean;
  filterError: string | null;
}

export default function FilterControls({ 
  sortBy, 
  onSortChange, 
  filterValue, 
  onFilterChange,
  onApplyFilter,
  onClearFilter,
  filterApplied,
  filterError
}: Props) {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('Sort changed to:', e.target.value);
    onSortChange(e.target.value as 'subscribers' | 'videos' | 'name');
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Filter changed to:', e.target.value);
    onFilterChange(Number(e.target.value));
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center justify-start gap-4 mb-2">
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="border rounded p-2"
        >
          <option value="subscribers">Sort by Subscribers</option>
          <option value="videos">Sort by Videos</option>
          <option value="name">Sort by Name</option>
        </select>
        <input
          type="number"
          value={filterValue}
          onChange={handleFilterChange}
          placeholder="Min Subscribers"
          className={`border rounded p-2 ${filterError ? 'border-red-500' : ''}`}
        />
        <button
          onClick={onApplyFilter}
          className={`rounded p-2 ${
            filterApplied ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
          }`}
        >
          {filterApplied ? 'Update Filter' : 'Apply Filter'}
        </button>
        {filterApplied && (
          <button
            onClick={onClearFilter}
            className="bg-red-500 text-white rounded p-2"
          >
            Clear Filter
          </button>
        )}
      </div>
      {filterError && <p className="text-red-500 mt-2">{filterError}</p>}
      {filterApplied && (
        <p className="text-green-500 mt-2">
          Filter applied: Minimum {filterValue} subscribers
        </p>
      )}
    </div>
  );
}