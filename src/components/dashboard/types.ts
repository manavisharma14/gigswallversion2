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
  totalRatings: number;
  averageRating: number;
};

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

  escrowStatus: string,
  escrowAmount?: number,
  escrowByUserId?: string,
  escrowTxnRef?: string,
  escrowProofUrl?: string,
  escrowReleaseProofUrl?: string
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
  totalRatings: number,
  averageRating: number,

  gigId: string;
  userId: string;
  createdAt: string;
  user?: User;
  gig?: Gig;
};