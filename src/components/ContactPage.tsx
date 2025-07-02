'use client';

import React, { useState } from 'react';

export default function ContactUsPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message sent!');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <section
      id="contact"
      className="scroll-mt-20 min-h-screen bg-white text-black font-bricolage px-6 py-20"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#4B55C3] to-[#6366F1] text-transparent bg-clip-text">
          Reach out to us
        </h1>
        <p className="text-gray-600 mb-10">
          Have a question, suggestion, or just want to connect?
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B55C3] placeholder-gray-500"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B55C3] placeholder-gray-500"
            required
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows={5}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B55C3] placeholder-gray-500"
            required
          ></textarea>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#4B55C3] to-[#6366F1] text-white font-semibold py-3 rounded-lg hover:opacity-90 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
