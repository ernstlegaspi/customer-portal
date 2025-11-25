import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { servicem8Client } from '../services/servicem8';
import { createMessage, getMessagesByBookingId } from '../database';

const router = Router();

router.use(authenticateToken);

router.get('/:bookingId/messages', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { bookingId } = req.params;

    const job = await servicem8Client.getJobById(bookingId);
    if (!job) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    const { email, phone } = req.user;
    const emailMatch = job.contact_email?.toLowerCase() === email.toLowerCase();
    const phoneMatch = job.contact_mobile?.replace(/\s/g, '') === phone.replace(/\s/g, '');

    if (!emailMatch && !phoneMatch) {
      res.status(403).json({ error: 'You do not have access to this booking' });
      return;
    }

    const messages = getMessagesByBookingId(bookingId);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.post('/:bookingId/messages', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { bookingId } = req.params;
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      res.status(400).json({ error: 'Message content is required' });
      return;
    }

    const job = await servicem8Client.getJobById(bookingId);
    if (!job) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    const { email, phone } = req.user;
    const emailMatch = job.contact_email?.toLowerCase() === email.toLowerCase();
    const phoneMatch = job.contact_mobile?.replace(/\s/g, '') === phone.replace(/\s/g, '');

    if (!emailMatch && !phoneMatch) {
      res.status(403).json({ error: 'You do not have access to this booking' });
      return;
    }

    const newMessage = createMessage(bookingId, email, message.trim());
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

export default router;