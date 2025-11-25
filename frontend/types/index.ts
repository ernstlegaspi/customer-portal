export interface Customer {
  id: string;
  email: string;
  phone: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  token: string;
  customer: Customer;
}

export interface Booking {
  id: string;
  address: string;
  description: string;
  status: string;
  createdDate: string;
  updatedDate: string;
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

export interface LoginCredentials {
  email: string;
  phone: string;
}
