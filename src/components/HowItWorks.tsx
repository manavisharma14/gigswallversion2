"use client";

import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      title: "Post a Gig",
      description:
        "Share a task or opportunity — like tutoring, designing, coding, or errands. Others can apply to help.",
    },
    {
      title: "Browse Opportunities",
      description:
        "Explore gigs that match your skills and availability. Find ways to help, learn, and grow.",
    },
    {
      title: "Get Paid",
      description:
        "Complete gigs, build your experience, and earn money doing what you’re good at.",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-[#F8F8FF] text-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Section Title */}
      <h2 className="text-4xl sm:text-5xl font-extrabold text-[#3B4CCA] mb-14 font-bricolage">
        How It Works
      </h2>

      {/* Steps */}
      <div className="relative flex flex-col md:flex-row justify-center items-center gap-10 max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
            viewport={{ once: true }}
            className="relative z-10 flex flex-col items-center bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-2 p-8 max-w-sm w-full border border-gray-100"
          >
            {/* Step Number Circle */}
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-[#4B55C3] to-[#7C83F9] text-white text-2xl font-bold mb-4 shadow-md">
              {index + 1}
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-[#3B4CCA] font-bricolage">
              {step.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}

        {/* Connector Line for Desktop */}
        <div className="hidden md:block absolute top-[5.5rem] left-1/2 -translate-x-1/2 w-[70%] h-1 bg-gradient-to-r from-[#4B55C3]/30 via-[#7A5AF8]/40 to-[#4B55C3]/30 -z-0 rounded-full" />
      </div>
    </section>
  );
}