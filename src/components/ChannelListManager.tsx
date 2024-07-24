import React, { useState } from 'react';
import { ChannelList } from '@/types';
import { Channel } from '@/types';

interface Props {
  channelLists: ChannelList[];
  currentChannels: Channel[];
  onSaveList: (name: string, description: string) => void;
  onLoadList: (listId: string) => void;
  onDeleteList: (listId: string) => void;
}

export default function ChannelListManager({ 
  channelLists, 
  currentChannels, 
  onSaveList, 
  onLoadList, 
  onDeleteList 
}: Props) {
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');

  const handleSaveList = () => {
    if (newListName.trim()) {
      onSaveList(newListName.trim(), newListDescription.trim());
      setNewListName('');
      setNewListDescription('');
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-2">Channel Lists</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="New list name"
          className="border rounded p-2"
        />
        <input
          type="text"
          value={newListDescription}
          onChange={(e) => setNewListDescription(e.target.value)}
          placeholder="List description"
          className="border rounded p-2"
        />
        <button
          onClick={handleSaveList}
          className="bg-blue-500 text-white rounded p-2"
        >
          Save Current List
        </button>
      </div>
      <div className="space-y-2">
        {channelLists.map((list) => (
          <div key={list.id} className="flex items-center gap-2">
            <span>{list.name}</span>
            <button
              onClick={() => onLoadList(list.id)}
              className="bg-green-500 text-white rounded p-1 text-sm"
            >
              Load
            </button>
            <button
              onClick={() => onDeleteList(list.id)}
              className="bg-red-500 text-white rounded p-1 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}