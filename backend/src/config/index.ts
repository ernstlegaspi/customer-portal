import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  servicem8: {
    apiKey: process.env.SERVICEM8_API_KEY || '',
    apiSecret: process.env.SERVICEM8_API_SECRET || '',
    baseUrl: process.env.SERVICEM8_API_BASE_URL || 'https://api.servicem8.com/api_1.0',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  database: {
    path: process.env.DATABASE_PATH || './database.sqlite',
  },
};