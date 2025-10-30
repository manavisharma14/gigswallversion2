// app/dashboard/page.tsx
import { redirect } from 'next/navigation';

export default function DashboardRoot() {
  redirect('/dashboard/profile');
}