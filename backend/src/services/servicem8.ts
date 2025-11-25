import axios, { AxiosInstance } from 'axios';
import { config } from '../config';
import { ServiceM8Job, ServiceM8Attachment } from '../types';

class ServiceM8Client {
  private client: AxiosInstance;

  constructor() {
    const auth = {
      username: config.servicem8.apiKey,
      password: config.servicem8.apiSecret,
    };

    this.client = axios.create({
      baseURL: config.servicem8.baseUrl,
      auth,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getJobs(): Promise<ServiceM8Job[]> {
    try {
      const response = await this.client.get('/job.json');
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs from ServiceM8:', error);
      throw new Error('Failed to fetch jobs from ServiceM8');
    }
  }

  async getJobsByCustomer(email: string, phone: string): Promise<ServiceM8Job[]> {
    try {
      const allJobs = await this.getJobs();

      return allJobs.filter(job => {
        const emailMatch = job.contact_email?.toLowerCase() === email.toLowerCase();
        const phoneMatch = job.contact_mobile?.replace(/\s/g, '') === phone.replace(/\s/g, '');
        return emailMatch || phoneMatch;
      });
    } catch (error) {
      console.error('Error fetching customer jobs:', error);
      throw new Error('Failed to fetch customer jobs');
    }
  }

  async getJobById(uuid: string): Promise<ServiceM8Job | null> {
    try {
      const response = await this.client.get(`/job/${uuid}.json`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching job by ID:', error);
      throw new Error('Failed to fetch job details');
    }
  }

  async getAttachmentsByJobId(jobUuid: string): Promise<ServiceM8Attachment[]> {
    try {
      const response = await this.client.get('/attachment.json');
      const allAttachments: ServiceM8Attachment[] = response.data;
      
      return allAttachments.filter(
        attachment => attachment.related_object_uuid === jobUuid
      );
    } catch (error) {
      console.error('Error fetching attachments:', error);
      throw new Error('Failed to fetch attachments');
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.client.get('/company.json');
      return true;
    } catch (error) {
      console.error('ServiceM8 connection test failed:', error);
      return false;
    }
  }
}

export const servicem8Client = new ServiceM8Client();