import { useState } from 'react';
import { Channel } from '@/types';

interface Props {
  channel: Channel;
  layout: 'grid' | 'list';
}

export default function ChannelCard({ channel, layout }: Props) {
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    window.open(`https://www.youtube.com/channel/${channel.id}`, '_blank');
  };

  const handleImageError = () => {
    console.error(`Failed to load thumbnail for channel: ${channel.name}, URL: ${channel.thumbnail}`);
    setImageError(true);
  };

  const thumbnailElement = (
    <div className={layout === 'grid' ? "aspect-w-16 aspect-h-9" : "w-48 h-27"}>
      {imageError ? (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
          Thumbnail unavailable
        </div>
      ) : (
        <img 
          src={channel.thumbnail} 
          alt={channel.name} 
          className="object-cover w-full h-full"
          onError={handleImageError}
        />
      )}
    </div>
  );

  const contentElement = (
    <div className="p-3">
      <h2 className="text-base font-bold mb-1 truncate">{channel.name}</h2>
      <p className="text-sm text-gray-600">
        <span className="font-semibold">{channel.subscribers.toLocaleString()}</span> subscribers • {channel.videos} videos
      </p>
    </div>
  );

  if (layout === 'grid') {
    return (
      <div 
        onClick={handleClick}
        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg"
      >
        {thumbnailElement}
        {contentElement}
      </div>
    );
  }

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg flex"
    >
      {thumbnailElement}
      <div className="flex-grow">
        {contentElement}
      </div>
    </div>
  );
}