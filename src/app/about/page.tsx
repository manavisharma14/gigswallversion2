export const dynamic = 'force-static';
import Image from "next/image";
import React from "react";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="bg-white py-20 sm:py-24 px-4 sm:px-6 lg:px-8 font-bricolage scroll-mt-32"
    >
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
          <p className="text-[#333] text-base sm:text-lg text-justify leading-relaxed">
  <strong className="text-[#4B55C3]">GigsWall</strong> is a space built around trust, creativity, and student-driven collaboration.
  It’s where you offer what you’re good at, and get help where you need it, without the noise of mainstream job boards.
  <br /><br />
  Whether you&rsquo;re building experience, looking to earn, or just want to contribute meaningfully,
  GigsWall helps you connect with others who <em>get it</em>.
  <br /><br />
  <span className="font-semibold text-[#6366F1]">No middlemen. No confusion. Just students supporting students, one gig at a time.</span>
</p>

        </div>
      </div>
    </section>
  );
}
