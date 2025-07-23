import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma'; // Import Prisma client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { gigId, message, sender, recipient } = req.body;

    // Check if all necessary fields are present
    if (!gigId || !message || !sender || !recipient) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Save the message to the database
      const newMessage = await prisma.message.create({
        data: {
          gigId,
          message,
          sender,
          recipient,
        },
      });

      // Return the saved message
      return res.status(201).json(newMessage);
    } catch (error) {
      console.error('Error saving message:', error);
      return res.status(500).json({ error: 'Failed to save message' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
