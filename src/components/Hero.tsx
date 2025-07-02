import Image from 'next/image';

export default function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#3B4CCA] via-[#667EEA] via-40% to-[#A991F7] text-center font-bricolage px-4 sm:px-6"
    >
      <div className="w-full max-w-5xl flex flex-col items-center justify-center">
        {/* 🖼️ Image */}
        <Image
          src="/assets/homepage.png"
          alt="Landing Visual"
          width={600}
          height={400}
          className="rounded-xl mx-auto mb-8 opacity-0 animate-fadeInUp w-full max-w-xs sm:max-w-sm md:max-w-md"
          priority
        />

        {/* 🧑‍🎓 Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 leading-snug sm:leading-tight opacity-0 animate-fadeInUp delay-100 drop-shadow-lg">
          One Platform. A Thousand Student Skills.
        </h1>

        {/* 📄 Subheading */}
        <p className="text-base sm:text-lg text-white mb-8 max-w-md sm:max-w-2xl mx-auto opacity-0 animate-fadeInUp delay-200">
          Share what you’re good at. Get help where you need it — all in one trusted space built for students.
        </p>

        {/* 🚀 Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 opacity-0 animate-fadeInUp delay-300">
          <a
            href="/post"
            className="relative group inline-block px-6 py-3 font-medium text-white border border-white overflow-hidden rounded-lg shadow-md"
          >
            <span className="absolute inset-0 bg-white opacity-0 scale-x-0 origin-left group-hover:opacity-100 group-hover:scale-x-100 transition-all duration-300 ease-in-out z-0"></span>
            <span className="relative z-10 group-hover:text-[#4C61B4] font-bold transition-colors duration-300">
              POST GIG
            </span>
          </a>
          <a
            href="/gigs"
            className="relative group inline-block px-6 py-3 font-medium text-white border border-white overflow-hidden rounded-lg shadow-md"
          >
            <span className="absolute inset-0 bg-white opacity-0 scale-x-0 origin-left group-hover:opacity-100 group-hover:scale-x-100 transition-all duration-300 ease-in-out z-0"></span>
            <span className="relative z-10 group-hover:text-[#4C61B4] font-bold transition-colors duration-300">
              APPLY TO GIG
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
