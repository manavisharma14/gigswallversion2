"use client";
import { FaWhatsapp } from "react-icons/fa";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center bg-[#4737ff] text-white px-6 sm:px-10 py-16"
    >
      <div className="max-w-6xl mx-auto text-center space-y-8 animate-fadeInUp opacity-0">
        {/* 🌍 Hook */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-xl">
          Where Businesses Meet Student Talent — Globally 🌍
        </h1>

        {/* 📝 Clearer Subline */}
        <p className="text-base sm:text-lg md:text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed">
          GigsWall connects <span className="font-semibold">companies, startups, and individuals from India and the U.S.</span> 
          with talented students — to get real projects done, build innovative solutions, and unlock new opportunities.
        </p>

        {/* 📱 Compact WhatsApp CTA */}
        <div className="flex justify-center mt-4">
          <a
            href="https://chat.whatsapp.com/HnNTBiWqIXN2oc4PG3Xghs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-full shadow-md transition-all duration-300 hover:scale-[1.03]"
          >
            <FaWhatsapp className="text-xl" />
            Join Our WhatsApp Community
          </a>
        </div>

        {/* 👇 Primary CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/post"
            className="px-6 py-3 border border-white rounded-lg font-semibold text-white hover:bg-white hover:text-[#3B4CCA] transition-all duration-300"
          >
            Post a Gig
          </a>
          <a
            href="/gigs"
            className="px-6 py-3 border border-white rounded-lg font-semibold text-white hover:bg-white hover:text-[#3B4CCA] transition-all duration-300"
          >
            Apply to Gigs
          </a>
        </div>

        {/* 📝 Tagline */}
        <p className="text-sm text-gray-300 italic pt-6">
          Real work. Real skills. Real community.
        </p>
      </div>

      {/* ↓ Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-gray-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}