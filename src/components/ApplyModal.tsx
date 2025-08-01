'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Pencil, Briefcase, Globe, MessageCircle } from 'lucide-react';

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

export default function ApplyModal({ gigId, gigTitle, onClose, onSubmit }: ApplyModalProps) {
  const [formData, setFormData] = useState<{
    reason: string;
    experience: string;
    portfolio: string;
    extra: string;
  }>({
    reason: '',
    experience: '',
    portfolio: '',
    extra: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.reason.trim() || !formData.experience.trim()) {
      toast.error('Please fill out required fields.');
      return;
    }

    setSubmitting(true);

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in first to apply.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`/api/apply/${gigId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 201) {
        toast.success('Application submitted successfully!');
        onSubmit(formData);
        onClose();
      } else if (res.status === 400 && data.message === 'You cannot apply to your own gig.') {
        toast.error("You can't apply to your own gig.");
      } else if (res.status === 400 && data.message === 'You have already applied to this gig.') {
        toast.success('You have already applied to this gig!');
      } else {
        toast.error('Failed to apply. Please try again.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong.');
    }

    setSubmitting(false);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start pt-[10vh] bg-black bg-opacity-40 font-bricolage px-4">
      <div
        className="bg-white w-full max-w-lg p-6 sm:p-8 rounded-xl shadow-xl border border-gray-200 transition-all transform duration-300"
        role="dialog"
        aria-modal="true"
      >
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-[#4B55C3]">
          Apply for <span className="text-black">&quot;{gigTitle}&quot;</span>
        </h2>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <label className="block text-sm font-medium text-gray-900">
            <Pencil className="inline w-4 h-4 mr-1 text-[#4B55C3]" />
            Why are you interested?
            <textarea
              name="reason"
              rows={3}
              className="w-full p-3 border mt-1 rounded-md focus:ring-2 focus:ring-[#4B55C3] focus:outline-none"
              onChange={handleChange}
              value={formData.reason}
              required
              autoFocus
            />
          </label>

          <label className="block text-sm font-medium text-gray-900">
            <Briefcase className="inline w-4 h-4 mr-1 text-[#4B55C3]" />
            Relevant experience
            <input
              type="text"
              name="experience"
              className="w-full p-3 border mt-1 rounded-md focus:ring-2 focus:ring-[#4B55C3] focus:outline-none"
              onChange={handleChange}
              value={formData.experience}
              required
            />
          </label>

          <label className="block text-sm font-medium text-gray-900">
            <Globe className="inline w-4 h-4 mr-1 text-[#4B55C3]" />
            Portfolio (optional)
            <input
              type="url"
              name="portfolio"
              className="w-full p-3 border mt-1 rounded-md focus:ring-2 focus:ring-[#4B55C3] focus:outline-none"
              onChange={handleChange}
              value={formData.portfolio}
            />
          </label>

          <label className="block text-sm font-medium text-gray-900">
            <MessageCircle className="inline w-4 h-4 mr-1 text-[#4B55C3]" />
            Anything else (optional)
            <textarea
              name="extra"
              rows={2}
              className="w-full p-3 border mt-1 rounded-md focus:ring-2 focus:ring-[#4B55C3] focus:outline-none"
              onChange={handleChange}
              value={formData.extra}
            />
          </label>
        </form>

        <div className="flex justify-end mt-6 space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-600 hover:underline transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-5 py-2 rounded-md text-sm font-medium text-white transition ${
              submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#4B55C3] hover:bg-[#6D7BE4]'
            }`}
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </div>
    </div>
  );
}
