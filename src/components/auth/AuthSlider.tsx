'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import SignUpPage from './SignUpPage';
import SignInPage from './SignInPage';

export default function AuthSlider({ defaultLoginMode }: { defaultLoginMode: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSignIn, setIsSignIn] = useState(defaultLoginMode);

  useEffect(() => {
    setIsSignIn(pathname === '/signin');
  }, [pathname]);

  const toggleMode = () => {
    setIsSignIn(!isSignIn);
    router.push(!isSignIn ? '/signin' : '/signup');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#3B4CCA] via-[#667EEA] to-[#A991F7] items-center justify-center px-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white/90 rounded-xl shadow-xl overflow-hidden">
        
        {/* Left Side - Branding & Toggle */}
        <div className="w-full md:w-1/2 bg-[#4B55C3] text-white p-8 flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold font-bricolage mb-10 text-center">
            {isSignIn ? "Welcome Back! ✨" : "Hello Friend! 🚀"}
          </h2>
          <p className="text-base font-bricolage text-center mt-3">
            {isSignIn
              ? "Don't have an account yet? Join the GigsWall community!"
              : "Already have an account? Log in to manage and apply for gigs."}
          </p>
          <button
            onClick={toggleMode}
            className="mt-6 bg-white text-[#4B3BB3] font-bold px-5 py-2 rounded-full hover:brightness-95"
          >
            {isSignIn ? "SIGN UP" : "SIGN IN"}
          </button>
        </div>

        {/* Right Side - Constant Size Form Area */}
        <div className="w-full md:w-1/2 p-8 h-[540px] flex flex-col justify-center transition-all duration-300 overflow-y-auto">
          {isSignIn ? <SignInPage /> : <SignUpPage />}
        </div>

      </div>
    </div>
  );
}
