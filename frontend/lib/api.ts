import axios from 'axios';
import type { AuthResponse, Booking, Attachment, Message, LoginCredentials } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  verify: async (): Promise<{ valid: boolean; user: any }> => {
    const response = await api.post('/auth/verify');
    return response.data;
  },
};

export const bookingsAPI = {
  getAll: async (): Promise<Booking[]> => {
    const response = await api.get('/bookings');
    return response.data;
  },

  getById: async (id: string): Promise<Booking> => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  getAttachments: async (id: string): Promise<Attachment[]> => {
    const response = await api.get(`/bookings/${id}/attachments`);
    return response.data;
  },
};

export const messagesAPI = {
  getByBookingId: async (bookingId: string): Promise<Message[]> => {
    const response = await api.get(`/bookings/${bookingId}/messages`);
    return response.data;
  },

  create: async (bookingId: string, message: string): Promise<Message> => {
    const response = await api.post(`/bookings/${bookingId}/messages`, { message });
    return response.data;
  },
};

export default api;