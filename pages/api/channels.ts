import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { Channel } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const channels = await prisma.channel.findMany();
      res.status(200).json(channels);
    } catch (error) {
      console.error('Error fetching channels:', error);
      res.status(500).json({ error: 'Error fetching channels' });
    }
  } else if (req.method === 'POST') {
    try {
      const newChannels = req.body as Channel[];
      console.log('Received channels:', newChannels); // Add this line for debugging
      
      const createdChannels = await Promise.all(
        newChannels.map((channel) =>
          prisma.channel.upsert({
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
          })
        )
      );
      console.log('Created channels:', createdChannels); // Add this line for debugging
      res.status(201).json(createdChannels);
    } catch (error) {
      console.error('Error creating channels:', error);
      res.status(500).json({ error: 'Error creating channels' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}