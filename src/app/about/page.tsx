import Image from "next/image";
import React from "react";

export default function AboutPage() {
  return (
    <section className="bg-white py-20 sm:py-24 px-4 sm:px-6 lg:px-8 font-bricolage">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Image */}
        <div className="flex justify-center">
          <Image
            src="/assets/aboutus.png"
            alt="Why GigsWall"
            width={400}
            height={400}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto"
            priority
          />
        </div>

        {/* Right Text */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#4B55C3] to-[#6366F1]">
            Why GigsWall?
          </h2>
          <p className="text-[#333] text-base sm:text-lg leading-relaxed">
            <strong className="text-[#4B55C3]">GigsWall</strong> is built for students, by students —
            a trusted platform to offer your talents and get help where it's needed most.
            Whether you're a designer building your portfolio, a coder solving real problems,
            or someone who just wants to earn by helping out — GigsWall makes it easy to connect
            on campus.
            <br /><br />
            No gatekeeping, no noise — just{" "}
            <span className="font-semibold text-[#6366F1]">real gigs from real students</span>.
          </p>
        </div>
      </div>
    </section>
  );
}
