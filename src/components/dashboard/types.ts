// components/dashboard/types.ts
export type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  college: string | null;
  department: string | null;
  gradYear: string | null;
  type: 'student' | 'business' | 'other';
  walletBalance: number;
  createdAt: string;
}

export type Gig = {
  id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  college: string;
  isOpen: boolean;
  status: string;
  createdAt: string;
  postedById: string;
  applications?: Application[];
};

export type Application = {
  id: string;
  reason: string | null;
  experience: string | null;
  extraInfo: string | null;
  status: 'pending' | 'accepted' | 'rejected';

  portfolio: string | null;

  amount?: number;

  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  razorpayPayoutId?: string;

  // Work submission + completion fields
  paymentStatus: string;
  workSubmitted: boolean;
  completed: boolean;
  escrow: boolean; // or number if you change later

  gigId: string;
  userId: string;
  createdAt: string;
  user?: User;
  gig?: Gig;
};