import { useState } from 'react';
import { Channel } from '@/types';
import ChannelCard from './ChannelCard';

interface Props {
  channels: Channel[];
}

export default function ChannelGrid({ channels }: Props) {
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
      <div className="mb-4">
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