"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ContactUsPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="scroll-mt-20 min-h-screen bg-gradient-to-b from-white to-[#F8F8FF] font-bricolage px-6 py-20 flex items-center justify-center"
    >
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left Illustration / Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#4B55C3] to-[#6366F1] text-transparent bg-clip-text">
            Reach out to us
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Have a question, suggestion, or just want to connect?  
            We'd love to hear from you 👋
          </p>
          <p className="text-sm text-gray-500 italic">
            We typically respond within 24 hours.
          </p>
        </motion.div>

        {/* Right Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="space-y-5 bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B55C3] placeholder-gray-500 shadow-sm"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B55C3] placeholder-gray-500 shadow-sm"
            required
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows={5}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B55C3] placeholder-gray-500 shadow-sm"
            required
          ></textarea>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-gradient-to-r from-[#4B55C3] to-[#6366F1] text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-60"
          >
            {status === "loading" ? "Sending..." : "Send Message"}
          </button>

          {status === "success" && (
            <p className="text-green-600 text-sm mt-2 text-center">
              ✅ Your message has been sent successfully!
            </p>
          )}
          {status === "error" && (
            <p className="text-red-600 text-sm mt-2 text-center">
              ❌ Something went wrong. Please try again.
            </p>
          )}
        </motion.form>
      </div>
    </section>
  );
}