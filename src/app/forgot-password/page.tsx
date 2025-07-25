'use client';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffaf3] px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 p-8 rounded-2xl shadow-md">
        <h1 className="text-2xl font-semibold text-center text-[#3B4CCA] mb-6">
          Forgot your password?
        </h1>

        {sent ? (
          <p className="text-center text-green-600">
            Check your email for the reset link :)
          </p>
        ) : (
          <>
            <input
              type="email"
              placeholder="enter your email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#667EEA]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleSubmit}
              className="w-full mt-4 py-3 rounded-lg bg-gradient-to-r from-[#3B4CCA] via-[#667EEA] to-[#A991F7] text-white font-semibold shadow-md hover:opacity-90 transition"
            >
              Send reset link
            </button>
          </>
        )}
      </div>
    </div>
  );
}