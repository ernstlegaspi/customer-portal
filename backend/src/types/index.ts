export interface Customer {
  id: string;
  email: string;
  phone: string;
  firstName?: string;
  lastName?: string;
}

export interface ServiceM8Job {
  uuid: string;
  job_address?: string;
  job_description?: string;
  status?: string;
  created_date?: string;
  updated_date?: string;
  contact_first?: string;
  contact_last?: string;
  contact_email?: string;
  contact_mobile?: string;
}

export interface Booking {
  id: string;
  address: string;
  description: string;
  status: string;
  createdDate: string;
  updatedDate: string;
}

export interface ServiceM8Attachment {
  uuid: string;
  file_name?: string;
  file_type?: string;
  file_url?: string;
  related_object?: string;
  related_object_uuid?: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
}

export interface Message {
  id: number;
  bookingId: string;
  customerEmail: string;
  message: string;
  createdAt: string;
}

export interface AuthRequest {
  email: string;
  phone: string;
}

export interface AuthResponse {
  token: string;
  customer: Customer;
}

export interface JWTPayload {
  customerId: string;
  email: string;
  phone: string;
}