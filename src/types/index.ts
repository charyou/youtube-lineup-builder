export interface Channel {
  id: string;
  name: string;
  description?: string;
  subscriberCount: number;
  videoCount: number;
  thumbnailUrl: string;
}

export interface ChannelList {
  id: string;
  name: string;
  description?: string;
  items: ChannelListItem[];
}

export interface ChannelListItem {
  id: string;
  channelListId: string;
  channelId: string;
  order: number;
  channel: Channel;
}