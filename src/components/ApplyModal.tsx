"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface ApplyModalProps {
  gigId: string;
  gigTitle: string;
  onClose: () => void;
  onSubmit: (formData: {
    reason: string;
    experience: string;
    portfolio: string;
    extra: string;
  }) => void;
}

export default function ApplyModal({
  gigId,
  gigTitle,
  onClose,
  onSubmit,
}: ApplyModalProps) {
  const [formData, setFormData] = useState({
    reason: "",
    experience: "",
    portfolio: "",
    extra: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (formData.reason.trim().length < 20)
      return toast.error("Tell us more about your motivation.");
    if (formData.experience.trim().length < 10)
      return toast.error("Add a bit more about your experience.");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/gigs/${gigId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 201) {
        toast.success("Application submitted.");
        onSubmit(formData);
        onClose();
      } else if (res.status === 400 && data.message.includes("own gig")) {
        toast.error("You cannot apply to your own gig.");
      } else if (res.status === 400) {
        toast("You have already applied.");
      } else {
        toast.error("Something went wrong. Try again.");
      }
    } catch {
      toast.error("Network error. Try again.");
    }

    setSubmitting(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50"
      >
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full sm:max-w-lg bg-white rounded-2xl p-8 shadow-xl border border-gray-200 font-bricolage"
        >
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Apply for <span className="text-indigo-600">{gigTitle}</span>
          </h2>

          <p className="text-gray-500 mt-1 mb-6 text-sm leading-relaxed">
            Tell us why this opportunity matters to you.
          </p>

          <div className="space-y-5">
            <div>
              <label className="text-sm text-gray-800 font-medium">
                Why are you interested?
              </label>
              <textarea
                name="reason"
                rows={3}
                className="mt-2 w-full p-3 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm text-gray-800 font-medium">
                Relevant experience
              </label>
              <input
                name="experience"
                className="mt-2 w-full p-3 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm text-gray-800 font-medium">
                Portfolio (optional)
              </label>
              <input
                name="portfolio"
                placeholder="https://"
                className="mt-2 w-full p-3 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm text-gray-800 font-medium">
                Anything else?
              </label>
              <textarea
                name="extra"
                rows={2}
                className="mt-2 w-full p-3 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 transition shadow-sm"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}