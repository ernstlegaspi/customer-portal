import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { servicem8Client } from '../services/servicem8';
import { AuthRequest, AuthResponse } from '../types';

const router = Router();

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, phone }: AuthRequest = req.body;

    if (!email || !phone) {
      res.status(400).json({ error: 'Email and phone number are required' });
      return;
    }

    const customerJobs = await servicem8Client.getJobsByCustomer(email, phone);

    if (customerJobs.length === 0) {
      res.status(401).json({ 
        error: 'No account found with this email and phone number combination' 
      });
      return;
    }

    const firstJob = customerJobs[0];
    const customer = {
      id: `${email}-${phone}`,
      email,
      phone,
      firstName: firstJob.contact_first,
      lastName: firstJob.contact_last,
    };

    const token = jwt.sign(
      {
        customerId: customer.id,
        email: customer.email,
        phone: customer.phone,
      },
      config.jwt.secret,
      { expiresIn: '7d' }
    );

    const response: AuthResponse = {
      token,
      customer,
    };

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

router.post('/verify', async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Token required' });
      return;
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(403).json({ valid: false, error: 'Invalid token' });
  }
});

export default router;