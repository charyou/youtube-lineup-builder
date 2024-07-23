'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import InputForm from '@/components/InputForm';
import FilterControls from '@/components/FilterControls';
import ChannelGrid from '@/components/ChannelGrid';
import ChannelListManager from '@/components/ChannelListManager';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Channel, ChannelList } from '@/types';
import debounce from 'lodash/debounce';

const ITEMS_PER_PAGE = 20;

export default function Home() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [sortBy, setSortBy] = useState<'subscribers' | 'videos' | 'name'>('subscribers');
  const [filterValue, setFilterValue] = useState<number>(0);
  const [filterApplied, setFilterApplied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterError, setFilterError] = useState<string | null>(null);
  const [channelLists, setChannelLists] = useState<ChannelList[]>([]);

  useEffect(() => {
    const savedChannels = localStorage.getItem('channels');
    if (savedChannels) {
      setChannels(JSON.parse(savedChannels));
    }

    const savedLists = localStorage.getItem('channelLists');
    if (savedLists) {
      setChannelLists(JSON.parse(savedLists));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('channels', JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    localStorage.setItem('channelLists', JSON.stringify(channelLists));
  }, [channelLists]);

  const handleUpdateChannels = useCallback((newChannels: Channel[]) => {
    setChannels(prevChannels => [...prevChannels, ...newChannels]);
  }, []);

  const debouncedSetFilterValue = useMemo(
    () => debounce((value: number) => setFilterValue(value), 300),
    []
  );

  const handleFilterChange = useCallback((value: number) => {
    if (value < 0) {
      setFilterError("Filter value cannot be negative");
    } else {
      setFilterError(null);
      debouncedSetFilterValue(value);
    }
  }, [debouncedSetFilterValue]);

  const handleApplyFilter = useCallback(() => {
    setFilterApplied(true);
    setCurrentPage(1);
  }, []);

  const handleClearFilter = useCallback(() => {
    setFilterValue(0);
    setFilterApplied(false);
    setCurrentPage(1);
    setFilterError(null);
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

  const paginatedChannels = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedChannels.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedChannels, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedChannels.length / ITEMS_PER_PAGE);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handleSaveList = useCallback((name: string, description: string) => {
    const newList: ChannelList = {
      id: Date.now().toString(),
      name,
      description,
      channels: filteredAndSortedChannels,
    };
    setChannelLists((prevLists) => [...prevLists, newList]);
  }, [filteredAndSortedChannels]);

  const handleLoadList = useCallback((listId: string) => {
    const list = channelLists.find((l) => l.id === listId);
    if (list) {
      setChannels(list.channels);
      setFilterValue(0);
      setFilterApplied(false);
      setCurrentPage(1);
    }
  }, [channelLists]);

  const handleDeleteList = useCallback((listId: string) => {
    setChannelLists((prevLists) => prevLists.filter((l) => l.id !== listId));
  }, []);

  const handleExportChannels = useCallback(() => {
    const csvContent = [
      ['Channel Name', 'Subscriber Count', 'Video Count', 'Channel URL'],
      ...filteredAndSortedChannels.map(channel => [
        channel.name,
        channel.subscribers.toString(),
        channel.videos.toString(),
        `https://www.youtube.com/channel/${channel.id}`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'youtube_channels.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [filteredAndSortedChannels]);

  return (
    <ErrorBoundary>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">YouTube LineUp Builder</h1>
        <InputForm onUpdateChannels={handleUpdateChannels} />
        <ChannelListManager
          channelLists={channelLists}
          currentChannels={filteredAndSortedChannels}
          onSaveList={handleSaveList}
          onLoadList={handleLoadList}
          onDeleteList={handleDeleteList}
        />
        <FilterControls
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterValue={filterValue}
          onFilterChange={handleFilterChange}
          onApplyFilter={handleApplyFilter}
          onClearFilter={handleClearFilter}
          filterApplied={filterApplied}
          filterError={filterError}
        />
        <button
          onClick={handleExportChannels}
          className="bg-purple-500 text-white rounded p-2 mb-4"
        >
          Export Channels to CSV
        </button>
        <ChannelGrid 
          channels={paginatedChannels}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
    </ErrorBoundary>
  );
}