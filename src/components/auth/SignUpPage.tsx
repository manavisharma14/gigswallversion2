'use client';

import { useRouter } from "next/navigation";
import { GraduationCap, Building2 } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#f7f8ff] to-[#eef0ff] px-6 py-12">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-[#4B3BB3] mb-4">
          Join GigsWall
        </h1>
        <p className="text-gray-600 mb-10 text-sm sm:text-base">
          Choose your account type to get started.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Student Box */}
          <div
            onClick={() => router.push("/signup/student")}
            className="cursor-pointer bg-white shadow-lg rounded-2xl p-10 flex flex-col items-center justify-center hover:scale-105 hover:shadow-2xl transition-all border-2 border-transparent hover:border-[#6B7FFF]"
          >
            <div className="bg-[#EDEBFF] p-4 rounded-full mb-4">
              <GraduationCap size={40} className="text-[#4B3BB3]" />
            </div>
            <h2 className="text-xl font-semibold text-[#4B3BB3] mb-2">
              Sign up as Student
            </h2>
            <p className="text-sm text-gray-500">
              Find gigs, earn money, and showcase your skills.
            </p>
          </div>

          {/* Business Box */}
          <div
            onClick={() => router.push("/signup/business")}
            className="cursor-pointer bg-white shadow-lg rounded-2xl p-10 flex flex-col items-center justify-center hover:scale-105 hover:shadow-2xl transition-all border-2 border-transparent hover:border-[#4B3BB3]"
          >
            <div className="bg-[#EDEBFF] p-4 rounded-full mb-4">
              <Building2 size={40} className="text-[#4B3BB3]" />
            </div>
            <h2 className="text-xl font-semibold text-[#4B3BB3] mb-2">
              Sign up as Business
            </h2>
            <p className="text-sm text-gray-500">
              Post gigs and hire talented students easily.
            </p>
          </div>
        </div>

        <p className="mt-10 text-xs text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-[#4737ff] underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}