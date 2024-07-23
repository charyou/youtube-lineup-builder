import React from 'react';

interface Props {
  sortBy: 'subscribers' | 'videos' | 'name';
  onSortChange: (value: 'subscribers' | 'videos' | 'name') => void;
  filterValue: number;
  onFilterChange: (value: number) => void;
  onApplyFilter: () => void;
}

export default function FilterControls({ 
  sortBy, 
  onSortChange, 
  filterValue, 
  onFilterChange,
  onApplyFilter 
}: Props) {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('Sort changed to:', e.target.value);
    onSortChange(e.target.value as 'subscribers' | 'videos' | 'name');
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Filter changed to:', e.target.value);
    onFilterChange(Number(e.target.value));
  };

  const handleApplyFilter = () => {
    console.log('Apply filter clicked');
    onApplyFilter();
  };

  return (
    <div className="mb-6 flex flex-wrap items-center justify-start gap-4">
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
        className="border rounded p-2"
      />
      <button
        onClick={handleApplyFilter}
        className="bg-green-500 text-white rounded p-2"
      >
        Apply Filter
      </button>
    </div>
  );
}