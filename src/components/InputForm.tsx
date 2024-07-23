import { useState } from 'react';
import { Channel } from '@/types';
import { fetchChannelData } from '@/lib/youtube';


interface Props {
  onUpdateChannels: (channels: Channel[]) => void;
}



export default function InputForm({ onUpdateChannels }: Props) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit button pressed'); // Add this line
    setIsLoading(true);
    setError(null);
  
    try {
      const urls = input.split('\n').filter(url => url.trim() !== '');
      console.log('Processing URLs:', urls);
      console.log('About to call fetchChannelData');
      const newChannels = await fetchChannelData(urls);
      console.log('Fetched channels:', newChannels);
      onUpdateChannels(newChannels);
    } catch (error) {
      console.error('Error processing channel URLs:', error);
      if (error instanceof Error && error.message === 'YouTube API quota exceeded') {
        setError('YouTube API quota exceeded. Please try again later.');
      } else {
        setError('Failed to fetch channel data. Please check the console for more details.');
      }
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <textarea
        className="w-full min-h-[100px] p-2 border rounded"
        placeholder="Paste channel URLs here, one per line."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
     <button 
        type="submit" 
        className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
        disabled={isLoading}
        onClick={() => console.log('Button clicked')} // Add this line
      >
        {isLoading ? 'Processing...' : 'Update Channels'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}