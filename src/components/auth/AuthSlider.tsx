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
    <div className="flex min-h-screen w-full bg-gradient-to-br from-[#3B4CCA] via-[#667EEA] to-[#A991F7] overflow-hidden">
      <div className="flex flex-col md:flex-row w-full max-w-full min-h-screen">

        {/* Left Panel */}
        <div className="w-full md:w-2/5 flex flex-col justify-center items-center bg-[#4B55C3] text-white px-6 py-12 md:py-20 text-center max-w-full">
          <div className="max-w-md">
            <h2 className="text-3xl sm:text-4xl font-bold font-bricolage mb-4">
              {isSignIn ? "Welcome Back! ✨" : "Hello Friend! 🚀"}
            </h2>
            <p className="text-base sm:text-lg mb-6 sm:mb-8 px-2 sm:px-0">
              {isSignIn
                ? "Don't have an account yet? Join the GigsWall community!"
                : "Already have an account? Log in to manage and apply for gigs."}
            </p>
            <button
              onClick={toggleMode}
              className="bg-white text-[#4B3BB3] font-semibold px-6 py-2 rounded-full hover:brightness-95 transition"
            >
              {isSignIn ? "SIGN UP" : "SIGN IN"}
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-3/5 flex justify-center items-center bg-white/90 p-6 sm:p-12 max-w-full overflow-hidden">
          <div className="w-full max-w-xl">
            {isSignIn ? <SignInPage /> : <SignUpPage />}
          </div>
        </div>

      </div>
    </div>
  );
}
