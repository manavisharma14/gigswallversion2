// app/reset-password/page.tsx
export const dynamic = 'force-static';
import { Suspense } from 'react';
import ResetPasswordPage from './ResetPasswordClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}