"use client";
import {
  PaintBrush,
  Code,
  BookOpen,
  Camera,
  Microphone,
  DeviceMobile,
  FileText,
  Headphones,
  Wrench,
  Scissors,
} from "phosphor-react";

export default function WhatAreGigs() {
  const ideas = [
    { icon: <PaintBrush size={40} weight="duotone" color="#7A5AF8" />, label: "Something creative" },
    { icon: <Code size={40} weight="duotone" color="#7A5AF8" />, label: "A coding favor" },
    { icon: <BookOpen size={40} weight="duotone" color="#7A5AF8" />, label: "Study support" },
    { icon: <Camera size={40} weight="duotone" color="#7A5AF8" />, label: "Event help" },
    { icon: <Microphone size={40} weight="duotone" color="#7A5AF8" />, label: "Presentation prep" },
    { icon: <DeviceMobile size={40} weight="duotone" color="#7A5AF8" />, label: "Social media magic" },
    { icon: <FileText size={40} weight="duotone" color="#7A5AF8" />, label: "Proofreading" },
    { icon: <Headphones size={40} weight="duotone" color="#7A5AF8" />, label: "Podcast" },
    { icon: <Wrench size={40} weight="duotone" color="#7A5AF8" />, label: "Fixing something techy" },
    { icon: <Scissors size={40} weight="duotone" color="#7A5AF8" />, label: "Editing" },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-20 text-center font-bricolage">
      <h2 className="text-4xl font-bold text-[#3B4CCA] mb-4">
        What could a{" "}
        <span className="italic font-extrabold text-[#7A5AF8] drop-shadow-sm">
          Gig
        </span>{" "}
        be?
      </h2>

      <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-10">
        Gigs can be anything. If it uses your skills and helps someone around you, it’s a gig.
        Here’s just a taste of what’s possible:
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-center items-stretch">
        {ideas.map((idea, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-[#E6E4FF] to-[#F1EDFF] p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col items-center justify-center text-center"
          >
            <div className="mb-3">{idea.icon}</div>
            <p className="text-sm font-medium text-gray-800">{idea.label}</p>
          </div>
        ))}
      </div>

      <p className="mt-12 text-sm text-gray-600 italic">
        If it’s helpful, skillful, or creative, it belongs on GigsWall.
      </p>
    </section>
  );
}
