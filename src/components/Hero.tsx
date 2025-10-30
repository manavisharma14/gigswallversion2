"use client";
import { FaWhatsapp } from "react-icons/fa";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative mt-8 min-h-screen flex flex-col justify-center bg-gradient-to-br from-[#3B4CCA] via-[#667EEA] to-[#A991F7] text-white px-6 sm:px-10 py-16 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto text-center space-y-10 relative z-10">

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
          Where Businesses Meet Student Talent — Globally 🌍
        </h1>


        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/post"
            className="px-6 py-3 bg-white text-[#4737ff] rounded-lg font-semibold shadow-md hover:bg-gray-100 hover:scale-[1.05] transition-all duration-300"
          >
            Hire a Student — Free to list!
          </a>
          <a
            href="/gigs"
            className="px-6 py-3 bg-[#6b5bff] text-white rounded-lg font-semibold shadow-md hover:bg-[#5a4dee] hover:scale-[1.05] transition-all duration-300"
          >
            Find Gigs & Earn Globally
          </a>
        </div>


        <div className="flex justify-center mt-6">
          <a
            href="https://chat.whatsapp.com/HnNTBiWqIXN2oc4PG3Xghs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-transparent border border-white text-white hover:bg-white hover:text-[#4737ff] font-medium py-2 px-4 rounded-full transition-all duration-300"
          >
            <FaWhatsapp className="text-lg" />
            Join Our Global Community
          </a>
        </div>

        {/* Tagline: Subtle Reinforcement */}
        <p className="text-sm text-gray-300 italic pt-6">
          Verified Talent. Secure Projects. Global Impact.
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </section>
  );
}