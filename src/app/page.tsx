'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import InputForm from '@/components/InputForm';
import FilterControls from '@/components/FilterControls';
import ChannelGrid from '@/components/ChannelGrid';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Channel } from '@/types';

export default function Home() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [sortBy, setSortBy] = useState<'subscribers' | 'videos' | 'name'>('subscribers');
  const [filterValue, setFilterValue] = useState<number>(0);
  const [filterApplied, setFilterApplied] = useState(false);

  useEffect(() => {
    const savedChannels = localStorage.getItem('channels');
    if (savedChannels) {
      setChannels(JSON.parse(savedChannels));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('channels', JSON.stringify(channels));
  }, [channels]);

  const handleUpdateChannels = useCallback((newChannels: Channel[]) => {
    setChannels(prevChannels => [...prevChannels, ...newChannels]);
  }, []);

  const handleFilterChange = useCallback((value: number) => {
    setFilterValue(value);
  }, []);

  const handleApplyFilter = useCallback(() => {
    setFilterApplied(prev => !prev);
  }, []);

  const filteredAndSortedChannels = useMemo(() => {
    console.log('Sorting channels by:', sortBy);
    console.log('Filtering channels with min subscribers:', filterValue);
    
    return channels
      .filter(channel => channel.subscribers >= filterValue)
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return b[sortBy] - a[sortBy];
      });
  }, [channels, sortBy, filterValue, filterApplied]);

  console.log('Filtered and sorted channels:', filteredAndSortedChannels);

  return (
    <ErrorBoundary>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">YouTube LineUp Builder</h1>
        <InputForm onUpdateChannels={handleUpdateChannels} />
        <FilterControls
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterValue={filterValue}
          onFilterChange={handleFilterChange}
          onApplyFilter={handleApplyFilter}
        />
        <ChannelGrid channels={filteredAndSortedChannels} />
      </main>
    </ErrorBoundary>
  );
}