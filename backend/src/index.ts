import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from './config';
import { initDatabase } from './database';
import { servicem8Client } from './services/servicem8';

import authRoutes from './routes/auth';
import bookingsRoutes from './routes/bookings';
import messagesRoutes from './routes/messages';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initDatabase();

app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/test-connection', async (req: Request, res: Response) => {
  try {
    const isConnected = await servicem8Client.testConnection();
    res.json({ 
      connected: isConnected,
      message: isConnected 
        ? 'Successfully connected to ServiceM8 API' 
        : 'Failed to connect to ServiceM8 API'
    });
  } catch (error) {
    res.status(500).json({ 
      connected: false,
      error: 'Error testing ServiceM8 connection'
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/bookings', messagesRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: config.nodeEnv === 'development' ? err.message : undefined
  });
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`ServiceM8 API: ${config.servicem8.baseUrl}`);
});

export default app;