'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    } catch {
      toast.error('Server error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md px-4">
      <h2 className="text-2xl font-bold text-[#4B3BB3] text-center">Login</h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B7FFF]"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B7FFF] pr-10"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </div>
      </div>

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
