"use client";

import Image from "next/image";
import { Linkedin, Instagram } from "lucide-react";

const team = [
  {
    name: "Manavi Sharma",
    role: "Tech & Product",
    img: "/assets/manavi.png",
    linkedin: "https://www.linkedin.com/in/manavi-sharma-9911b4267/",
    instagram: "https://www.instagram.com/_manavisharma_/", // ✅ Add Insta URL here
  },
  {
    name: "Manav Sharma",
    role: "Operations",
    img: "/assets/manav.png",
    linkedin: "https://www.linkedin.com/in/manav-sharma-612752236/",
    instagram: "https://www.instagram.com/manavsharma_/", // ✅ Add Insta URL here
  },
  {
    name: "Rahil Abbu",
    role: "Strategy & Ops",
    img: "/assets/rahil.png",
    linkedin: "https://www.linkedin.com/in/rahil-abbu/",
    instagram: "https://www.instagram.com/rahil.abbu/", // ✅ Add Insta URL here
  },
];

export default function AboutPage() {
  return (
    <main className="bg-white font-bricolage mt-16">
      {/* --- Hero --- */}
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

      {/* --- Why GigsWall --- */}
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

      {/* --- Meet the Team --- */}
      <section className="py-24 px-6 bg-gradient-to-b from-white to-[#F8FAFF]">
        <div className="max-w-6xl mx-auto text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#4B55C3]">
            Meet the Team
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-base sm:text-lg">
            A passionate group of builders, students, and creators working across
            the U.S. and India to make student freelancing a reality everywhere.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-items-center max-w-5xl mx-auto">
          {team.map((member, i) => (
            <div
              key={member.name}
              className="relative flex flex-col bg-white rounded-xl overflow-hidden shadow-lg group opacity-0 animate-fadeIn w-full max-w-[280px] h-[380px] transition-transform hover:scale-[1.03]"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {/* Badge */}
              <div className="absolute top-2 left-2 bg-[#1D2B7F] text-white text-[10px] font-bold px-2 py-1 rounded">
                IT'S ALL ABOUT PEOPLE
              </div>

              {/* Image */}
              <div className="relative w-full flex-1">
                <Image
                  src={member.img}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 280px"
                  className="object-cover grayscale group-hover:grayscale-0 transition duration-300"
                />
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col items-center justify-center h-[100px] text-gray-800">
                <h3 className="font-semibold text-lg text-center leading-tight">
                  {member.name}
                </h3>
                <p className="text-sm opacity-80 text-center">{member.role}</p>

                <div className="flex items-center gap-3 mt-3">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1D2B7F] hover:text-[#3B4CCA] transition"
                    >
                      <Linkedin size={18} />
                    </a>
                  )}
                  {member.instagram && (
                    <a
                      href={member.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1D2B7F] hover:text-[#E1306C] transition"
                    >
                      <Instagram size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Animations --- */}
      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </main>
  );
}