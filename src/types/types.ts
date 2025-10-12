export type User = {
  id: string;
  name: string | null;   // ✅ make this nullable
  email: string;
  college: string | null;
  department: string | null;
  gradYear: number | null;
  phone: string | null;
  type: string;
  createdAt: Date;
};

