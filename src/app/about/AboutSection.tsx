'use client'

import Image from "next/image";
import { Linkedin } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="bg-white font-bricolage mt-16">
      
      {/* --- 1. Hero Intro / Story --- */}
      <section className="py-24 px-6 sm:px-10 bg-gradient-to-b from-white to-[#F8FAFF]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#4B55C3] mb-6 leading-tight">
            From an idea to a growing community.
          </h2>
          <p className="text-gray-600 text-base sm:text-lg mb-6 max-w-3xl mx-auto leading-relaxed">
            It started with one question:{" "}
            <span className="font-semibold text-[#6366F1]">
              what if anyone could share opportunities, and students could bring them to life?
            </span>
          </p>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed">
            That’s the heart of GigsWall. It isn’t just students for students —{" "}
            <span className="font-semibold text-[#4B55C3]">anyone can post a gig</span>, 
            from individuals and startups to organizations. And it’s{" "}
            <span className="font-semibold text-[#6366F1]">students who take on the work</span>, 
            gaining real-world experience, building portfolios, and helping ideas move forward.
          </p>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed mt-6">
            Every project completed adds to a bigger story — of students growing their skills, 
            of people finding help they can trust, and of a community built on opportunity and action.
          </p>
        </div>
      </section>

      {/* --- 2. Why GigsWall --- */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#4B55C3] mb-4">
            Why GigsWall
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
            Traditional freelancing platforms are built for professionals. 
            GigsWall is built for <span className="font-semibold text-[#6366F1]">students first</span> — 
            making it easy to share real opportunities, gain skills, and collaborate 
            across campuses and communities. It’s where learning meets building.
          </p>
        </div>
      </section>

      {/* --- 3. Meet the Team --- */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#4B55C3]">
            Meet the Team
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-base sm:text-lg">
            A passionate group of builders, students, and creators working across
            the U.S. and India to make student freelancing a reality everywhere.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

{/* --- Manavi --- */}
<div className="bg-gray-50 rounded-xl shadow p-6 flex flex-col items-center text-center hover:shadow-md transition">
  <Image
    src="/assets/manavi.png"
    alt="Manavi Sharma"
    width={120}
    height={120}
    className="rounded-full object-cover mb-4"
  />
  <h3 className="text-xl font-semibold text-[#4B55C3]">Manavi Sharma</h3>
  <p className="text-sm font-medium text-gray-600 mt-1">Tech & Product</p>
  <div className="mt-3 flex space-x-4">
    <a
      href="https://www.linkedin.com/in/manavi-sharma-9911b4267/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-500 hover:text-[#4B55C3]"
    >
      <Linkedin size={18} />
    </a>
    <a
      href="https://github.com/manavisharma14"
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-500 hover:text-[#4B55C3]"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.648.5.5 5.648.5 12c0 5.088 3.292 9.393 7.868 10.925.575.1.787-.25.787-.55v-1.95c-3.2.7-3.875-1.538-3.875-1.538-.525-1.312-1.288-1.662-1.288-1.662-1.05-.725.075-.712.075-.712 1.162.087 1.775 1.187 1.775 1.187 1.037 1.775 2.713 1.263 3.375.963.1-.75.412-1.263.75-1.55-2.55-.288-5.238-1.287-5.238-5.737 0-1.263.45-2.288 1.187-3.087-.125-.288-.525-1.45.112-3.025 0 0 .975-.312 3.2 1.175a11.01 11.01 0 012.912-.388c.987 0 1.987.138 2.912.388 2.225-1.488 3.2-1.175 3.2-1.175.637 1.575.237 2.737.112 3.025.738.8 1.188 1.825 1.188 3.087 0 4.463-2.7 5.45-5.263 5.737.425.375.8 1.113.8 2.263v3.363c0 .3.212.65.787.55A11.502 11.502 0 0023.5 12c0-6.352-5.148-11.5-11.5-11.5z"/></svg>
    </a>
  </div>
</div>

{/* --- Manav --- */}
<div className="bg-gray-50 rounded-xl shadow p-6 flex flex-col items-center text-center hover:shadow-md transition">
  <Image
    src="/assets/manav.png"
    alt="Manav Sharma"
    width={120}
    height={120}
    className="rounded-full object-cover mb-4"
  />
  <h3 className="text-xl font-semibold text-[#4B55C3]">Manav Sharma</h3>
  <p className="text-sm font-medium text-gray-600 mt-1">Operations </p>
  <div className="mt-3 flex space-x-4">
    <a
      href="https://www.linkedin.com/in/manav-sharma-612752236/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-500 hover:text-[#4B55C3]"
    >
      <Linkedin size={18} />
    </a>
    <a
      href="https://www.instagram.com/__manavsharma"
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-500 hover:text-[#4B55C3]"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M7.5 2h9A5.5 5.5 0 0122 7.5v9A5.5 5.5 0 0116.5 22h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2zm0 2A3.5 3.5 0 004 7.5v9A3.5 3.5 0 007.5 20h9a3.5 3.5 0 003.5-3.5v-9A3.5 3.5 0 0016.5 4h-9zm4.5 3a5.5 5.5 0 110 11 5.5 5.5 0 010-11zm0 2a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm5.25-.88a1.12 1.12 0 11-2.24 0 1.12 1.12 0 012.24 0z"/></svg>
    </a>
  </div>
</div>

{/* --- Rahil --- */}
<div className="bg-gray-50 rounded-xl shadow p-6 flex flex-col items-center text-center hover:shadow-md transition">
  <Image
    src="/assets/rahil.png"
    alt="Rahil Abbu"
    width={120}
    height={120}
    className="rounded-full object-cover mb-4"
  />
  <h3 className="text-xl font-semibold text-[#4B55C3]">Rahil Abbu</h3>
  <p className="text-sm font-medium text-gray-600 mt-1">Operations </p>
  <div className="mt-3 flex space-x-4">
    <a
      href="https://www.linkedin.com/in/rahil-abbu/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-500 hover:text-[#4B55C3]"
    >
      <Linkedin size={18} />
    </a>
    <a
      href="https://www.instagram.com/rrahilz_780"
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-500 hover:text-[#4B55C3]"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M7.5 2h9A5.5 5.5 0 0122 7.5v9A5.5 5.5 0 0116.5 22h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2zm0 2A3.5 3.5 0 004 7.5v9A3.5 3.5 0 007.5 20h9a3.5 3.5 0 003.5-3.5v-9A3.5 3.5 0 0016.5 4h-9zm4.5 3a5.5 5.5 0 110 11 5.5 5.5 0 010-11zm0 2a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm5.25-.88a1.12 1.12 0 11-2.24 0 1.12 1.12 0 012.24 0z"/></svg>
    </a>
  </div>
</div>

</div>
      </section>

    </main>
  );
}