'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const inputClass =
  'w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6B7FFF] text-[#4B3BB3] placeholder-gray-400 bg-white';

const iconClass =
  'absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4B3BB3]';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // ✅ THIS IS CRUCIAL
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
        toast.success('Welcome back!', { id: 'login-success' });
        router.push('/dashboard');
      } else {
        toast.error(data.error || 'Login failed', { id: 'login-error' });
      }
    } catch {
      toast.error('Server error', { id: 'server-error' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md p-8 ">
        <h2 className="text-2xl font-bold text-[#4B3BB3] text-center">Login</h2>

        {/* Email Input */}
        <div className="relative">
          <Mail className={iconClass} size={20} />
          <input
            type="email"
            placeholder="Email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Input */}
        {/* Password Input */}
<div className="relative">
  <Lock className={iconClass} size={20} />
  <input
    type={showPassword ? 'text' : 'password'}
    placeholder="Password"
    className={inputClass}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
  <div
    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4B3BB3] cursor-pointer"
    onClick={() => setShowPassword((prev) => !prev)}
  >
    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </div>
</div>

{/* Forgot Password Link */}
<div className="text-right">
  <span
    onClick={() => router.push('/forgot-password')}
    className="text-sm text-[#4B3BB3] hover:underline cursor-pointer"
  >
    Forgot Password?
  </span>
</div>

        <button
          type="submit"
          className="w-full bg-[#6B7FFF] hover:bg-[#5A6FEF] text-white font-bold py-2 rounded-full transition"
        >
          SIGN IN
        </button>
      </form>
    </div>
  );
};

export default SignInPage;
