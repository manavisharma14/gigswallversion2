export interface AuthUser {
    id: string;
    name: string;
    email: string;
    type: 'student' | 'other';
    phone?: string | null;
  department?: string | null;
  gradYear?: string | null;
  college?: string | null;
  createdAt?: string;
  }