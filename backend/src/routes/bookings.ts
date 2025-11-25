import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { servicem8Client } from '../services/servicem8';
import { Booking, Attachment } from '../types';

const router = Router();

router.use(authenticateToken);

const transformJobToBooking = (job: any): Booking => {
  return {
    id: job.uuid,
    address: job.job_address || 'No address provided',
    description: job.job_description || 'No description',
    status: job.status || 'unknown',
    createdDate: job.created_date || '',
    updatedDate: job.updated_date || '',
  };
};

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { email, phone } = req.user;
    const jobs = await servicem8Client.getJobsByCustomer(email, phone);
    
    const bookings: Booking[] = jobs.map(transformJobToBooking);
    
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const job = await servicem8Client.getJobById(id);

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

    const booking = transformJobToBooking(job);
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({ error: 'Failed to fetch booking details' });
  }
});

router.get('/:id/attachments', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const job = await servicem8Client.getJobById(id);
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

    const serviceM8Attachments = await servicem8Client.getAttachmentsByJobId(id);
    
    const attachments: Attachment[] = serviceM8Attachments.map(att => ({
      id: att.uuid,
      fileName: att.file_name || 'Unknown',
      fileType: att.file_type || 'unknown',
      fileUrl: att.file_url || '',
    }));

    res.json(attachments);
  } catch (error) {
    console.error('Error fetching attachments:', error);
    res.status(500).json({ error: 'Failed to fetch attachments' });
  }
});

export default router;