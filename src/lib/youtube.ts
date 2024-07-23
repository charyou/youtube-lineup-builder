import { Channel } from '../types'

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY

export async function getChannelId(input: string): Promise<string> {
  console.log(`Attempting to get channel ID for input: ${input}`)
  try {
    const response = await fetch(`/api/getChannelId?url=${encodeURIComponent(input)}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    if (data.channelId) {
      console.log(`Retrieved channel ID: ${data.channelId}`)
      return data.channelId
    }
    throw new Error('Failed to retrieve channel ID')
  } catch (error) {
    console.error('Error getting channel ID:', error)
    throw error
  }
}

export async function fetchChannelDetails(channelId: string): Promise<Channel | null> {
  console.log(`Fetching details for channel ID: ${channelId}`);
  try {
    const apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`;
    console.log(`Sending request to: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    console.log(`Received response with status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API response:', JSON.stringify(data, null, 2));

    if (data.error) {
      if (data.error.errors[0].reason === 'quotaExceeded') {
        console.error('YouTube API quota exceeded');
        throw new Error('YouTube API quota exceeded');
      } else {
        console.error('YouTube API error:', data.error);
        throw new Error('YouTube API error');
      }
    }

    if (data.items && data.items.length > 0) {
      const channel = data.items[0];
      const channelData: Channel = {
        id: channel.id,
        name: channel.snippet.title,
        description: channel.snippet.description,
        subscriberCount: parseInt(channel.statistics.subscriberCount),
        videoCount: parseInt(channel.statistics.videoCount),
        thumbnailUrl: channel.snippet.thumbnails.medium.url,
      };
      console.log('Parsed channel data:', channelData);
      return channelData;
    } else {
      console.log('No channel data found in API response');
    }
  } catch (error) {
    console.error(`Error fetching channel details:`, error);
    throw error;
  }
  return null;
}


export async function fetchChannelData(channelUrls: string[]): Promise<Channel[]> {
  console.log(`Fetching data for ${channelUrls.length} channels`);
  const channels: Channel[] = [];
  let quotaExceeded = false;

  for (const url of channelUrls) {
    try {
      console.log(`Processing URL: ${url}`);
      const channelId = await getChannelId(url);
      console.log(`Got channel ID: ${channelId}`);
      
      if (channelId) {
        console.log(`Attempting to fetch details for channel ID: ${channelId}`);
        try {
          const data = await fetchChannelDetails(channelId);
          console.log(`Fetched channel details:`, data);
          
          if (data) {
            channels.push(data);
            console.log(`Successfully added channel: ${data.name}`);
          } else {
            console.log(`No data returned for channel ID: ${channelId}`);
          }
        } catch (detailsError) {
          console.error(`Error fetching details for channel ID ${channelId}:`, detailsError);
        }
      } else {
        console.log(`No channel ID retrieved for URL: ${url}`);
      }
    } catch (error) {
      console.error(`Error processing channel ${url}:`, error);
      if (error instanceof Error && error.message === 'YouTube API quota exceeded') {
        quotaExceeded = true;
        break;
      }
    }
  }

  console.log(`Fetched data for ${channels.length} channels:`, channels);
  if (quotaExceeded) {
    throw new Error('YouTube API quota exceeded');
  }
  return channels;
}