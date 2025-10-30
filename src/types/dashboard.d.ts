// types/dashboard.d.ts

export type User = {
    id: string;
    name: string;
    email: string;
    password?: string;
    phone?: string | null;
    college: string | null;
    department: string | null;
    gradYear: string | null;
    gigPreference?: 'finder' | 'poster' | 'both' | null;
    type?: 'student' | 'other';
    isVerified?: boolean;
    otpCode?: string;
    otpExpires?: string;
    createdAt?: string;
    updatedAt?: string;
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
    postedBy?: User;
    applications?: Application[];
    applicantId?: string;
  };
  
  // 👇 This must be exported — you missed this earlier
  export type Application = {
    id: string;
    reason: string | null;
    experience: string | null;
    extraInfo: string | null;
    status: string;
    portfolio: string | null;
    gigId: string;
    userId: string;
    user?: User;
    gig?: Gig;
  };