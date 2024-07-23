import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const channelList = await prisma.channelList.findUnique({
      where: { id: String(id) },
      include: { items: { include: { channel: true } } },
    });
    if (channelList) {
      res.status(200).json(channelList);
    } else {
      res.status(404).json({ message: 'Channel list not found' });
    }
  } else if (req.method === 'DELETE') {
    await prisma.channelList.delete({ where: { id: String(id) } });
    res.status(204).end();
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}