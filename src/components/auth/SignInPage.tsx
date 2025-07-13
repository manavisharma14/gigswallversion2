// src/components/auth/SignInPage.tsx
'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        document.cookie = `token=${data.token}; path=/`;
        document.cookie = `user=${encodeURIComponent(JSON.stringify(data.user))}; path=/`;

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userId', data.user.id);

        window.dispatchEvent(new Event('storageChanged'));
        toast.success('Welcome back!');
        router.push('/dashboard');
      } else {
        toast.error(data.error || 'Login failed');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md px-4">
      <h2 className="text-2xl font-bold text-[#4B3BB3] text-center">Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="input w-full border px-4 py-2 rounded-lg"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="input w-full border px-4 py-2 rounded-lg"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="w-full bg-[#6B7FFF] hover:bg-[#5A6FEF] text-white font-bold py-2 rounded-full"
      >
        SIGN IN
      </button>
    </form>
  );
};

export default SignInPage;
