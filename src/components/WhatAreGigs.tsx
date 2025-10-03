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
import { motion } from "framer-motion";

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
    <section className="max-w-6xl mx-auto px-4 py-24 text-center font-bricolage">
      {/* ✨ Intro Heading */}
      <h2 className="text-4xl sm:text-5xl font-extrabold text-[#3B4CCA] mb-4 leading-snug">
        Your idea. <span className="text-[#7A5AF8]">Someone’s next gig.</span>
      </h2>
      <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-14 leading-relaxed">
        GigsWall is powered by students and communities. Whether it’s a quick favor or a creative project,  
        if it uses your skills and helps someone — it belongs here.
      </p>

      {/* ✨ Grid of ideas with motion */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {ideas.map((idea, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.4 }}
            className="group bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-2 hover:border-[#7A5AF8]/30 flex flex-col items-center"
          >
            <div className="mb-3 transition-transform group-hover:scale-110 group-hover:drop-shadow-glow">
              {idea.icon}
            </div>
            <p className="text-sm font-medium text-gray-800">{idea.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ✨ Closing line */}
      <p className="mt-14 text-base text-gray-600 italic">
        If it’s <span className="font-semibold text-[#7A5AF8]">helpful</span>,{" "}
        <span className="font-semibold text-[#7A5AF8]">skillful</span>, or{" "}
        <span className="font-semibold text-[#7A5AF8]">creative</span> — it’s a gig.
      </p>
    </section>
  );
}