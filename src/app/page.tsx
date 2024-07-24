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
    async function fetchData() {
      try {
        const channelsResponse = await fetch('/api/channels');
        if (!channelsResponse.ok) {
          throw new Error(`HTTP error! status: ${channelsResponse.status}`);
        }
        const channelsData = await channelsResponse.json();
        setChannels(Array.isArray(channelsData) ? channelsData : []);
  
        const listsResponse = await fetch('/api/channelLists');
        if (!listsResponse.ok) {
          throw new Error(`HTTP error! status: ${listsResponse.status}`);
        }
        const listsData = await listsResponse.json();
        setChannelLists(Array.isArray(listsData) ? listsData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Optionally set an error state here to display to the user
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchInitialChannels() {
      try {
        const response = await fetch('/api/channels');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const initialChannels = await response.json();
        console.log('Fetched initial channels:', initialChannels);
        setChannels(initialChannels);
      } catch (error) {
        console.error('Error fetching initial channels:', error);
      }
    }
    fetchInitialChannels();
  }, []);

  const handleUpdateChannels = useCallback(async (newChannels: Channel[]) => {
    try {
      console.log('Sending channels to API:', newChannels);
      const response = await fetch('/api/channels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newChannels),
      });
      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Error response body:', errorBody);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
      }
      const updatedChannels: Channel[] = await response.json();
      console.log('Channels updated:', updatedChannels);
      
      // Replace the entire channels state with the new updated channels
      setChannels(updatedChannels);
      
      console.log('New channels state:', updatedChannels);
    } catch (error) {
      console.error('Error updating channels:', error);
      // Handle error (e.g., show an error message to the user)
    }
  }, []);

  const filteredAndSortedChannels = useMemo(() => {
    console.log('Filtering and sorting channels:', channels);
    if (!Array.isArray(channels)) {
      console.error('Channels is not an array:', channels);
      return [];
    }
    return channels
      .filter(channel => channel.subscriberCount >= filterValue)
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return b[sortBy === 'videos' ? 'videoCount' : 'subscriberCount'] - a[sortBy === 'videos' ? 'videoCount' : 'subscriberCount'];
      });
  }, [channels, sortBy, filterValue, filterApplied]);

  const handleSaveList = useCallback(async (name: string, description: string) => {
    try {
      const response = await fetch('/api/channelLists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          channels: filteredAndSortedChannels,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newList = await response.json();
      setChannelLists((prevLists) => [...prevLists, newList]);
    } catch (error) {
      console.error('Error saving list:', error);
      // Optionally set an error state here to display to the user
    }
  }, [filteredAndSortedChannels]);
  
  const handleLoadList = useCallback(async (listId: string) => {
    try {
      const response = await fetch(`/api/channelLists/${listId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const list = await response.json();
      if (list && Array.isArray(list.items)) {
        setChannels(list.items.map((item: any) => item.channel));
        setFilterValue(0);
        setFilterApplied(false);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error loading list:', error);
      // Optionally set an error state here to display to the user
    }
  }, []);

  const handleDeleteList = useCallback(async (listId: string) => {
    await fetch(`/api/channelLists/${listId}`, { method: 'DELETE' });
    setChannelLists((prevLists) => prevLists.filter((l) => l.id !== listId));
  }, []);

  const handleFilterChange = useCallback((value: number) => {
    if (value < 0) {
      setFilterError("Filter value cannot be negative");
    } else {
      setFilterError(null);
      setFilterValue(value);
    }
  }, []);

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

  const paginatedChannels = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedChannels.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedChannels, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedChannels.length / ITEMS_PER_PAGE);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handleExportChannels = useCallback(() => {
    const csvContent = [
      ['Channel Name', 'Subscriber Count', 'Video Count', 'Channel URL'],
      ...filteredAndSortedChannels.map(channel => [
        channel.name,
        channel.subscriberCount.toString(),
        channel.videoCount.toString(),
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