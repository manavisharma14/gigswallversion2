"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaStar, FaQuoteRight } from "react-icons/fa";

const testimonials = [
  {
    name: "Judy Jose",
    title: "I really appreciate!!",
    quote:
      "Needed a clean Canva poster made, fast. Posted it on GigsWall, and by evening, I had multiple students ready to take it up.",
    img: "/assets/judy.png",
    rating: 5,
    linkedin: "https://www.linkedin.com/in/judy-jose-20a73b172/",
    subtitle: "Educator & Community Builder • 🇮🇳",
  },
  {
    name: "Bijees Rai",
    title: "Super quick turnaround 👌",
    quote:
      "Found a student video editor within 2 days who nailed the brief perfectly. The speed and quality surprised me.",
    img: "/assets/bijees.png",
    rating: 5,
    linkedin: "https://www.linkedin.com/in/bijees-raj-26678089/",
    subtitle: "Founder & Creative Lead • 🇮🇳",
  },
  {
    name: "Ameen Farook",
    title: "Impressive tech skills!",
    quote:
      "Posted a backend gig and the student dev had my API live the very next day with a clean architecture.",
    img: "/assets/ameen.png",
    rating: 5,
    linkedin: "https://www.linkedin.com/in/ameenfarook/",
    subtitle: "Tech Entrepreneur • 🇺🇸",
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-24 px-6 bg-gray-50 overflow-hidden">
      {/* 🌈 Decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#3B4CCA]/10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#667EEA]/10 blur-3xl rounded-full translate-x-1/3 translate-y-1/3" />

      {/* 🧠 Header */}
      <div className="relative max-w-5xl mx-auto text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3B4CCA]">
          What People Are Saying
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mt-4 leading-relaxed">
          Real stories from verified LinkedIn users who’ve used GigsWall — across
          India 🇮🇳 and the U.S. 🇺🇸
        </p>
      </div>

      {/* 🧱 Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {testimonials.map((t, i) => (
          <a
            key={i}
            href={t.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="relative bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              {/* 🧍 Avatar */}
              <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-gray-100 -mt-16 mb-4">
                <Image
                  src={t.img}
                  alt={t.name}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* ⭐ Rating */}
              <div className="flex justify-center gap-1 mb-2">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <FaStar key={idx} className="text-yellow-400 text-sm" />
                ))}
              </div>

              {/* 📝 Title */}
              <h3 className="font-semibold text-lg mb-2">{t.title}</h3>

              {/* 📝 Quote */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {t.quote}
              </p>

              {/* 👤 Name + subtitle */}
              <div>
                <p className="font-semibold text-[#3B4CCA] hover:underline">
                  {t.name}
                </p>
                
              </div>

              {/* Decorative quote icon */}
              <FaQuoteRight className="text-3xl text-gray-700 absolute bottom-4 right-4 opacity-10" />
            </motion.div>
          </a>
        ))}
      </div>
    </section>
  );
}