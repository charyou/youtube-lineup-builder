import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { Channel } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const newChannels = req.body as Omit<Channel, 'createdAt' | 'updatedAt'>[];
      console.log('Received channels in API:', JSON.stringify(newChannels, null, 2));
      
      const createdChannels = await Promise.all(
        newChannels.map(async (channel) => {
          try {
            console.log('Upserting channel:', channel.id);
            const result = await prisma.channel.upsert({
              where: { id: channel.id },
              update: {
                name: channel.name,
                description: channel.description || '',
                subscriberCount: channel.subscriberCount,
                videoCount: channel.videoCount,
                thumbnailUrl: channel.thumbnailUrl,
              },
              create: {
                id: channel.id,
                name: channel.name,
                description: channel.description || '',
                subscriberCount: channel.subscriberCount,
                videoCount: channel.videoCount,
                thumbnailUrl: channel.thumbnailUrl,
              },
            });
            console.log('Upsert result:', JSON.stringify(result, null, 2));
            return result;
          } catch (error) {
            console.error(`Error upserting channel ${channel.id}:`, (error as Error).message);
            return null;
          }
        })
      );
      
      const successfulChannels = createdChannels.filter((channel): channel is NonNullable<typeof channel> => channel !== null);
      console.log('Successfully created/updated channels:', successfulChannels.length);
      res.status(201).json(successfulChannels);
    } catch (error) {
      const typedError = error as Error;
      console.error('Error creating channels:', typedError.message);
      res.status(500).json({ error: 'Error creating channels', details: typedError.message, stack: typedError.stack });
    }
  } else if (req.method === 'GET') {
    try {
      const channels = await prisma.channel.findMany();
      console.log('Fetched channels from database:', channels.length);
      res.status(200).json(channels);
    } catch (error) {
      const typedError = error as Error;
      console.error('Error fetching channels:', typedError.message);
      res.status(500).json({ error: 'Error fetching channels', details: typedError.message, stack: typedError.stack });
    }
  } else {
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}