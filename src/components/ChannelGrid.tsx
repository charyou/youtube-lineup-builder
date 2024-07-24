import { useState } from 'react';
import { Channel } from '@/types';
import ChannelCard from './ChannelCard';

interface Props {
  channels: Channel[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ChannelGrid({ channels, currentPage, totalPages, onPageChange }: Props) {
  console.log('Rendering ChannelGrid with channels:', channels);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  if (channels.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No channels to display. Add some channels to get started!
      </p>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <button 
            onClick={() => setLayout('grid')}
            className={`mr-2 px-4 py-2 rounded ${layout === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Grid
          </button>
          <button 
            onClick={() => setLayout('list')}
            className={`px-4 py-2 rounded ${layout === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            List
          </button>
        </div>
        <div>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50 mr-2"
          >
            Previous
          </button>
          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50 ml-2"
          >
            Next
          </button>
        </div>
      </div>
      <div className={layout === 'grid' 
        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        : "space-y-4"
      }>
        {channels.map(channel => (
          <ChannelCard key={channel.id} channel={channel} layout={layout} />
        ))}
      </div>
    </div>
  );
}