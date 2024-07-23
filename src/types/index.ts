export interface Channel {
  id: string;
  name: string;
  subscribers: number;
  videos: number;
  thumbnail: string;
}

export interface ChannelList {
  id: string;
  name: string;
  description: string;
  channels: Channel[];
}