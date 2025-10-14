"use client";

import Image from "next/image";
import { Linkedin, Instagram } from "lucide-react";

const team = [
  {
    name: "Manavi Sharma",
    role: "FOUNDER . Tech & Product",
    img: "/assets/manavi1.png",
    linkedin: "https://www.linkedin.com/in/manavi-sharma-521014222/",
    instagram: "https://www.instagram.com/withmanavi/",
  },
  {
    name: "Rahil Abbu",
    role: "Strategy & Ops",
    img: "/assets/rahil.png",
    linkedin: "https://www.linkedin.com/in/rahil-ummar-faruk-abbu-501624255/",
    instagram: "https://www.instagram.com/rahil.abbu/",
  },
  {
    name: "Manav Sharma",
    role: "Operations",
    img: "/assets/manav.png",
    linkedin: "https://www.linkedin.com/in/manav-sharma-612752236/",
    instagram: "https://www.instagram.com/__manavsharma/",
  },
  {
    name: "Shrishti Das",
    role: "Content",
    img: "/assets/shrishti.jpeg",
    linkedin: "https://www.linkedin.com/in/shrishti-das-/",
    instagram: "https://www.instagram.com/shrisshh_tea/",
  },
  
  {
    name: "Aryadeep Ray",
    role: "Finance & Strategy",
    img: "/assets/aryadeep.png", // 👈 make sure this image exists in /public/assets
    linkedin: "https://www.linkedin.com/in/aryadeepray/", // placeholder — replace with actual
    instagram: "https://www.instagram.com/_ray.aryadeep_",
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

      {/* --- Meet the Team (Cards) --- */}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 justify-items-center max-w-6xl mx-auto">
          {team.map((member, i) => (
            <div
              key={member.name}
              className="relative flex flex-col bg-white rounded-xl overflow-hidden shadow-lg group opacity-0 animate-fadeIn w-full max-w-[260px] h-[360px] transition-transform hover:scale-[1.03]"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {/* Badge */}
              <div className="absolute top-2 left-2 bg-[#1D2B7F] text-white text-[10px] font-bold px-2 py-1 rounded">
                IT&apos;S ALL ABOUT PEOPLE
              </div>

              {/* Image */}
              <div className="w-full aspect-square overflow-hidden">
                <Image
                  src={member.img}
                  alt={member.name}
                  width={260}
                  height={260}
                  className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition duration-300"
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

      {/* --- Team Stories Section --- */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#4B55C3]">
            Meet the Minds Behind GigsWall
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto mt-4 leading-relaxed">
            Every startup has its spark. Here’s a closer look at the people who keep the gears turning, the dreamers, doers, and (sometimes) caffeine-fueled night owls behind GigsWall.
          </p>
        </div>

        <div className="space-y-16 max-w-4xl mx-auto">
          {[
            {
              name: "👩‍💻 Manavi Sharma — FOUNDER · Tech & Product",
              img: "/assets/manavi1.png",
              text: "Manavi is the visionary and Founder behind GigsWall, the brain behind the operation where it all began. She leads the product, technology, and direction of the platform, turning ideas into tangible experiences. She’s the one ensuring every pixel is in place and every feature just works, driven by her relentless 'let’s build it' energy that powers GigsWall forward.",
              reverse: false,
            },
            {
              name: "🧠 Rahil Abbu — Strategy & Ops",
              img: "/assets/rahil.png",
              text: "Rahil’s the human version of a perfectly labeled Notion board. He loves clean systems, structured plans, and communication that actually lands. He’s the “wait, what if we tried this?” guy at 2 a.m.—and somehow, it always makes sense. If something’s running smoothly, chances are Rahil made a checklist for it.",
              reverse: true,
            },
            {
              name: "🛠️ Manav Sharma — Operations",
              img: "/assets/manav.png",
              text: "If something needs doing, Manav’s probably already halfway through it. He’s the calm center during busy launches and the one with a backup plan for the backup plan. Basically, the team’s “it’ll get done” person.",
              reverse: false,
            },
            {
              name: "✍️ Shrishti Das — Content",
              img: "/assets/shrishti.jpeg",
              text: "Shrishti is the voice and vibe of GigsWall. Whether it’s crafting stories, building community, or making content that actually hits, she’s the spark behind the scenes. Think of her as the one turning everyday updates into scroll-stopping moments.",
              reverse: true,
            },
            {
              name: "💸 Aryadeep Ray— Finance & Strategy",
              img: "/assets/aryadeep.png",
              text: "The numbers whisperer and deal-maker in one. Aryadeep’s the one balancing the books, pitching partnerships, and turning chaos into strategy (all before his second cup of coffee). He’s the team’s go-to for “how do we make this actually work?” moments: equal parts of a CFO, operator, and hype man for big ideas. If it involves money, metrics, or momentum, he’s already on it.",
              reverse: false,
            },
          ].map((person, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                person.reverse ? "md:flex-row-reverse" : "md:flex-row"
              } items-center md:items-start gap-8`}
            >
              <div className="md:w-1/2 text-left">
                <h3 className="text-2xl font-semibold text-[#3B4CCA]">{person.name}</h3>
                <p className="mt-2 leading-relaxed text-gray-800">{person.text}</p>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="w-[220px] h-[220px] rounded-full overflow-hidden shadow-md transition transform hover:scale-105 hover:shadow-xl hover:shadow-[#3B4CCA]/30">
                  <Image
                    src={person.img}
                    alt={person.name}
                    width={220}
                    height={220}
                    className="object-cover w-full h-full"
                  />
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