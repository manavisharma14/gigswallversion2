export type User = {
  id: string;
  name: string | null;
  email: string;
  college: string | null;
  department: string | null;
  gradYear: string | null;  // changed to string based on your API response
  phone: string | null;
  walletBalance: number;
  type: string;
  totalRatings: number,
  completedGigs: number,
  createdAt: Date;
};
