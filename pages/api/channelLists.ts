import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const channelLists = await prisma.channelList.findMany({
      include: { items: { include: { channel: true } } },
    });
    res.status(200).json(channelLists);
  } else if (req.method === 'POST') {
    const { name, description, channels } = req.body;
    const newList = await prisma.channelList.create({
      data: {
        name,
        description,
        items: {
          create: channels.map((channel: any, index: number) => ({
            channel: { connect: { id: channel.id } },
            order: index,
          })),
        },
      },
      include: { items: { include: { channel: true } } },
    });
    res.status(201).json(newList);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}