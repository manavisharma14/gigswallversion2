'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const id = searchParams.get('id');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);

  const handleReset = async () => {
    await fetch('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, id, newPassword }),
    });
    setDone(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffaf3] px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 p-8 rounded-2xl shadow-md">
        <h1 className="text-2xl font-semibold text-center text-[#3B4CCA] mb-6">
          Reset your password
        </h1>

        {done ? (
          <p className="text-center text-green-600 font-medium">
            Password reset successful. You can now Sign In.
          </p>
        ) : (
          <>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="new password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#667EEA]"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-[#667EEA] hover:text-[#3B4CCA]"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              onClick={handleReset}
              className="w-full mt-4 py-3 rounded-lg bg-gradient-to-r from-[#3B4CCA] via-[#667EEA] to-[#A991F7] text-white font-semibold shadow-md hover:opacity-90 transition"
            >
              Reset password
            </button>
          </>
        )}
      </div>
    </div>
  );
}