// src/components/Hero.tsx
import Image from 'next/image';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3B4CCA] to-[#667EEA] text-white px-6 sm:px-10"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left space-y-6 opacity-0 animate-fadeInUp">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
            Anyone can post.<br />
            <span className="text-[#FFD66B]">Students make it happen.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-100 leading-relaxed max-w-lg mx-auto md:mx-0">
            Share your ideas, projects, or tasks — and watch talented students bring them to life. 
            Whether you&apos;re a startup, student, or individual, GigsWall is where opportunities meet skill.
          </p>

          <div className="flex flex-col sm:flex-row md:justify-start justify-center gap-4 pt-4">
            <a
              href="/post"
              className="relative group inline-block px-6 py-3 font-medium text-white border border-white overflow-hidden rounded-lg shadow-md"
            >
              <span className="absolute inset-0 bg-white opacity-0 scale-x-0 origin-left group-hover:opacity-100 group-hover:scale-x-100 transition-all duration-300 ease-in-out z-0"></span>
              <span className="relative z-10 group-hover:text-[#4C61B4] font-bold transition-colors duration-300">
                POST A GIG
              </span>
            </a>

            <a
              href="/gigs"
              className="relative group inline-block px-6 py-3 font-medium text-white border border-white overflow-hidden rounded-lg shadow-md"
            >
              <span className="absolute inset-0 bg-white opacity-0 scale-x-0 origin-left group-hover:opacity-100 group-hover:scale-x-100 transition-all duration-300 ease-in-out z-0"></span>
              <span className="relative z-10 group-hover:text-[#4C61B4] font-bold transition-colors duration-300">
                APPLY TO GIGS
              </span>
            </a>
          </div>

          <p className="text-sm text-gray-200 italic pt-2">
            Real work. Real skills. Real connections.
          </p>
        </div>

        {/* 🖼️ Right - Hero Image */}
        <div className="flex justify-center md:justify-end opacity-0 animate-fadeInUp delay-150">
        <Image
  src="/assets/homepage.png"
  alt="Landing Visual"
  width={600}
  height={400}
  className=" w-full max-w-sm sm:max-w-md md:max-w-lg transform transition-transform duration-500 ease-out hover:scale-105"
  priority
/>
        </div>
      </div>
    </section>
  );
}