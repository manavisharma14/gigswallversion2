"use client";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#3B4CCA] via-[#667EEA] to-[#A991F7] text-white px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight drop-shadow-sm">
          Choose your account type
        </h1>
        <p className="text-white/80 text-lg">
          Join as a student or business to start collaborating.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-8">
        <Link href="/signup/student">
          <div className="w-60 h-60 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-xl font-semibold cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl">
            🎓
            <span className="mt-3">Sign up as Student</span>
          </div>
        </Link>

        <Link href="/signup/business">
          <div className="w-60 h-60 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-xl font-semibold cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl">
            💼
            <span className="mt-3">Sign up as Business</span>
          </div>
        </Link>
      </div>

      <p className="mt-10 text-white/70 text-sm">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="underline hover:text-white transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}