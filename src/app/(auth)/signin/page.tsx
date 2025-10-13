'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();

  // ✅ If already signed in → redirect to dashboard
  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validateForm = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.', { id: 'email-error' });
      return false;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.', { id: 'password-error' });
      return false;
    }
    return true;
  };

  // ✅ Sign In with Credentials → Auto redirect to /dashboard
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await signIn('credentials', {
        email,
        password,
        callbackUrl: '/dashboard',
      });
    } catch {
      toast.error('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  // ✅ Google Sign-In
  // ✅ Google Sign-In
const handleGoogleSignIn = async () => {
  setIsGoogleLoading(true);
  try {
    await signIn('google', { 
      callbackUrl: '/dashboard',
      prompt: 'select_account'   // 👈 forces Google to show account picker each time
    });
  } catch {
    toast.error('Google sign-in failed. Please try again.');
    setIsGoogleLoading(false);
  }
};

  return (
    <div className="w-full max-w-md mx-auto min-h-screen overflow-hidden flex flex-col px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16">
      <div className="w-full flex flex-col items-center justify-start mt-8">
        <h2 className="text-3xl font-bold text-[#4B3BB3] text-center mb-2">
          Welcome Back 👋
        </h2>

      </div> 

      <div className="w-full bg-white rounded-xl shadow-md p-6 space-y-6">
        {/* Email / Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4B3BB3]" size={20} />
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6B7FFF] text-[#4B3BB3] placeholder-gray-400 bg-white"
              value={email}
              onChange={handleEmailChange}
              required
              disabled={isLoading}
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4B3BB3]" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Password"
              className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6B7FFF] text-[#4B3BB3] placeholder-gray-400 bg-white"
              value={password}
              onChange={handlePasswordChange}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4B3BB3] cursor-pointer hover:opacity-70 transition-opacity"
              disabled={isLoading}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-bold py-2 rounded-lg transition ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed text-gray-500'
                : 'bg-[#6B7FFF] hover:bg-[#5A6FEF] text-white'
            }`}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="my-5 flex items-center">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="mx-3 text-sm text-gray-500">or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Google Sign-In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading || isGoogleLoading}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-semibold transition ${
            isGoogleLoading
              ? 'bg-red-400 cursor-not-allowed text-gray-500'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  className="w-5 h-5"
>
  <path
    fill="#4285F4"
    d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.31h6.48c-.28 1.38-1.11 2.55-2.37 3.34v2.77h3.83c2.24-2.07 3.55-5.11 3.55-8.15z"
  />
  <path
    fill="#34A853"
    d="M12 24c3.24 0 5.96-1.08 7.95-2.93l-3.83-2.77c-1.06.71-2.43 1.13-4.12 1.13-3.16 0-5.83-2.13-6.79-5.01H1.24v3.1C3.21 21.3 7.27 24 12 24z"
  />
  <path
    fill="#FBBC05"
    d="M5.21 14.42a7.18 7.18 0 0 1 0-4.84V6.48H1.24a12.03 12.03 0 0 0 0 10.98l3.97-3.04z"
  />
  <path
    fill="#EA4335"
    d="M12 4.75c1.77 0 3.35.61 4.6 1.79l3.42-3.42C17.95 1.2 15.23 0 12 0 7.27 0 3.21 2.7 1.24 6.48l3.97 3.1C6.17 6.88 8.84 4.75 12 4.75z"
  />
</svg>
          {isGoogleLoading ? 'Signing in with Google...' : 'Sign in with Google'}
        </button>

        {/* Important Note */}
        <div className="mt-4 bg-[#F3F4FF] border border-[#6B7FFF]/30 text-[#4B3BB3] text-sm rounded-lg p-3 text-center">
           <span className="font-semibold">Important:</span>{' '}
          If you want to <span className="font-semibold">post gigs or apply as a student</span>, please sign up with your <span className="font-semibold">student email</span>. If you&apos;re hiring students, you can sign up with <span className="font-semibold">any email</span>.
        </div>

        {/* Sign Up Link */}
        <p className="mt-6 text-center text-gray-600 text-sm">
  Don&apos;t have an account?{' '}
  <Link
    href="/signup"
    className="text-[#6B7FFF] font-semibold hover:underline transition-colors"
  >
    Sign up here
  </Link>
</p>
      </div>


    </div>
  );
}